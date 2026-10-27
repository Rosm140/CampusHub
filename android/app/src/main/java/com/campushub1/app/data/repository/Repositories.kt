package com.campushub1.app.data.repository

import com.campushub1.app.data.model.*
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

sealed class ResourceResult<out T> {
    data class Success<T>(val data: T) : ResourceResult<T>()
    data class Error(val message: String, val exception: Throwable? = null) : ResourceResult<Nothing>()
    object Loading : ResourceResult<Nothing>()
}

class AuthRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    val currentUserId: String?
        get() = auth.currentUser?.uid

    suspend fun registerUser(
        email: String,
        pass: String,
        displayName: String,
        department: String,
        course: String,
        academicYear: String,
        studentId: String
    ): ResourceResult<User> {
        return try {
            val authResult = auth.createUserWithEmailAndPassword(email, pass).await()
            val uid = authResult.user?.uid ?: throw IllegalStateException("UID not generated")
            
            // Safe default role is always STUDENT
            val newUser = User(
                uid = uid,
                email = email,
                displayName = displayName,
                department = department,
                course = course,
                academicYear = academicYear,
                studentId = studentId,
                role = UserRole.STUDENT,
                createdAt = Timestamp.now()
            )
            
            firestore.collection("users").document(uid).set(newUser).await()
            ResourceResult.Success(newUser)
        } catch (e: Exception) {
            ResourceResult.Error(e.localizedMessage ?: "Registration failed", e)
        }
    }

    suspend fun getUserProfile(uid: String): ResourceResult<User> {
        return try {
            val snapshot = firestore.collection("users").document(uid).get().await()
            val user = snapshot.toObject(User::class.java)
            if (user != null) ResourceResult.Success(user)
            else ResourceResult.Error("User record not found")
        } catch (e: Exception) {
            ResourceResult.Error(e.localizedMessage ?: "Failed to fetch user", e)
        }
    }

    suspend fun updateProfile(uid: String, updates: Map<String, Any>): ResourceResult<Unit> {
        return try {
            // Protect role and account status fields from being updated here
            val safeUpdates = updates.filterKeys { it != "role" && it != "isActive" && it != "uid" }
            firestore.collection("users").document(uid).update(safeUpdates).await()
            ResourceResult.Success(Unit)
        } catch (e: Exception) {
            ResourceResult.Error(e.localizedMessage ?: "Update failed", e)
        }
    }

    fun signOut() {
        auth.signOut()
    }
}

class EventsRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    fun getUpcomingEvents(): Flow<List<Event>> = callbackFlow {
        val listener = firestore.collection("events")
            .whereEqualTo("isApproved", true)
            .whereEqualTo("isCancelled", false)
            .orderBy("startDate", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val events = snapshot?.toObjects(Event::class.java) ?: emptyList()
                trySend(events)
            }
        awaitClose { listener.remove() }
    }

    // Atomic transaction ensuring capacity safety & duplicate registration prevention
    suspend fun registerForEvent(eventId: String, user: User): ResourceResult<String> {
        val eventRef = firestore.collection("events").document(eventId)
        val regDocId = "${eventId}_${user.uid}"
        val registrationRef = firestore.collection("eventRegistrations").document(regDocId)

        return try {
            firestore.runTransaction { transaction ->
                val eventSnap = transaction.get(eventRef)
                if (!eventSnap.exists()) {
                    throw IllegalStateException("Event does not exist")
                }
                val capacity = eventSnap.getLong("capacity") ?: 0L
                val currentCount = eventSnap.getLong("registeredCount") ?: 0L
                val isApproved = eventSnap.getBoolean("isApproved") ?: false
                val isCancelled = eventSnap.getBoolean("isCancelled") ?: false

                if (!isApproved || isCancelled) {
                    throw IllegalStateException("Event is not currently open for registrations")
                }

                // Check registration deadline if present
                val deadline = eventSnap.getTimestamp("registrationDeadline")
                if (deadline != null && deadline.seconds < Timestamp.now().seconds) {
                    throw IllegalStateException("Registration deadline has passed")
                }

                val existingReg = transaction.get(registrationRef)
                if (existingReg.exists() && existingReg.getString("status") == "CONFIRMED") {
                    throw IllegalStateException("You are already registered for this event")
                }

                if (currentCount >= capacity) {
                    throw IllegalStateException("This event has reached maximum capacity")
                }

                // Increment registeredCount safely
                transaction.update(eventRef, "registeredCount", currentCount + 1)

                // Write registration record
                val regData = hashMapOf(
                    "id" to regDocId,
                    "eventId" to eventId,
                    "userId" to user.uid,
                    "userName" to user.displayName,
                    "userEmail" to user.email,
                    "registeredAt" to FieldValue.serverTimestamp(),
                    "status" to "CONFIRMED"
                )
                transaction.set(registrationRef, regData)
            }.await()
            ResourceResult.Success(regDocId)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Failed to register for event", e)
        }
    }

    suspend fun cancelRegistration(eventId: String, userId: String): ResourceResult<Unit> {
        val eventRef = firestore.collection("events").document(eventId)
        val regDocId = "${eventId}_${userId}"
        val registrationRef = firestore.collection("eventRegistrations").document(regDocId)

        return try {
            firestore.runTransaction { transaction ->
                val regSnap = transaction.get(registrationRef)
                if (!regSnap.exists() || regSnap.getString("status") != "CONFIRMED") {
                    throw IllegalStateException("Active registration not found")
                }
                val eventSnap = transaction.get(eventRef)
                val currentCount = eventSnap.getLong("registeredCount") ?: 1L

                transaction.update(eventRef, "registeredCount", (currentCount - 1).coerceAtLeast(0L))
                transaction.update(registrationRef, "status", "CANCELLED")
            }.await()
            ResourceResult.Success(Unit)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Cancellation failed", e)
        }
    }
}

class ClubsRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    fun getAllClubs(): Flow<List<Club>> = callbackFlow {
        val listener = firestore.collection("clubs")
            .orderBy("name")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val clubs = snapshot?.toObjects(Club::class.java) ?: emptyList()
                trySend(clubs)
            }
        awaitClose { listener.remove() }
    }

    suspend fun requestMembership(club: Club, user: User): ResourceResult<String> {
        val membershipId = "${club.id}_${user.uid}"
        val membershipRef = firestore.collection("clubMemberships").document(membershipId)

        return try {
            val existing = membershipRef.get().await()
            if (existing.exists() && existing.getString("status") == "PENDING") {
                return ResourceResult.Error("You already have a pending request for this club")
            }

            val membership = ClubMembership(
                id = membershipId,
                clubId = club.id,
                clubName = club.name,
                userId = user.uid,
                userName = user.displayName,
                userEmail = user.email,
                requestedAt = Timestamp.now(),
                status = MembershipStatus.PENDING
            )
            membershipRef.set(membership).await()
            ResourceResult.Success(membershipId)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Failed to submit membership request", e)
        }
    }

    suspend fun reviewMembership(
        membershipId: String,
        newStatus: MembershipStatus,
        reviewerId: String
    ): ResourceResult<Unit> {
        return try {
            firestore.collection("clubMemberships").document(membershipId).update(
                mapOf(
                    "status" to newStatus.name,
                    "reviewedBy" to reviewerId,
                    "reviewedAt" to FieldValue.serverTimestamp()
                )
            ).await()
            ResourceResult.Success(Unit)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Failed to review membership", e)
        }
    }
}

class CommunityRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    fun getFeed(category: PostCategory? = null): Flow<List<CommunityPost>> = callbackFlow {
        var query: Query = firestore.collection("posts")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(50)

        if (category != null) {
            query = query.whereEqualTo("category", category.name)
        }

        val listener = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val posts = snapshot?.toObjects(CommunityPost::class.java) ?: emptyList()
            trySend(posts)
        }
        awaitClose { listener.remove() }
    }

    suspend fun createPost(post: CommunityPost): ResourceResult<String> {
        return try {
            val docRef = firestore.collection("posts").document()
            val newPost = post.copy(id = docRef.id, createdAt = Timestamp.now())
            docRef.set(newPost).await()
            ResourceResult.Success(docRef.id)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Post creation failed", e)
        }
    }

    suspend fun toggleLike(postId: String, userId: String): ResourceResult<Boolean> {
        val likeDocRef = firestore.collection("postLikes").document("${postId}_$userId")
        val postRef = firestore.collection("posts").document(postId)

        return try {
            val isLiked = firestore.runTransaction { transaction ->
                val likeSnap = transaction.get(likeDocRef)
                val postSnap = transaction.get(postRef)
                val currentLikes = postSnap.getLong("likesCount") ?: 0L

                if (likeSnap.exists()) {
                    transaction.delete(likeDocRef)
                    transaction.update(postRef, "likesCount", (currentLikes - 1).coerceAtLeast(0L))
                    false
                } else {
                    val likeData = hashMapOf(
                        "postId" to postId,
                        "userId" to userId,
                        "likedAt" to FieldValue.serverTimestamp()
                    )
                    transaction.set(likeDocRef, likeData)
                    transaction.update(postRef, "likesCount", currentLikes + 1)
                    true
                }
            }.await()
            ResourceResult.Success(isLiked)
        } catch (e: Exception) {
            ResourceResult.Error(e.message ?: "Failed to like post", e)
        }
    }
}
