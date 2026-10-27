package com.campushub1.app.data.model

import com.google.firebase.Timestamp

enum class UserRole {
    STUDENT,
    FACULTY,
    CLUB_COORDINATOR,
    ADMINISTRATOR
}

data class User(
    val uid: String = "",
    val email: String = "",
    val displayName: String = "",
    val department: String = "",
    val course: String = "",
    val academicYear: String = "",
    val studentId: String = "",
    val photoUrl: String = "",
    val role: UserRole = UserRole.STUDENT,
    val interests: List<String> = emptyList(),
    val joinedClubs: List<String> = emptyList(),
    val registeredEvents: List<String> = emptyList(),
    val createdAt: Timestamp? = null,
    val isActive: Boolean = true
)

enum class EventCategory {
    TECHNICAL,
    CULTURAL,
    SPORTS,
    WORKSHOP,
    SEMINAR,
    HACKATHON,
    COMPETITION,
    PLACEMENT,
    CLUB_ACTIVITY,
    OTHER
}

data class Event(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val category: EventCategory = EventCategory.OTHER,
    val startDate: Timestamp? = null,
    val endDate: Timestamp? = null,
    val registrationDeadline: Timestamp? = null,
    val venue: String = "",
    val organizer: String = "",
    val organizerId: String = "",
    val capacity: Int = 100,
    val registeredCount: Int = 0,
    val imageUrl: String = "",
    val eligibility: String = "All Students",
    val isApproved: Boolean = false,
    val isCancelled: Boolean = false,
    val createdAt: Timestamp? = null
)

data class EventRegistration(
    val id: String = "",
    val eventId: String = "",
    val userId: String = "",
    val userName: String = "",
    val userEmail: String = "",
    val registeredAt: Timestamp? = null,
    val status: String = "CONFIRMED" // CONFIRMED, CANCELLED
)

enum class ClubCategory {
    TECHNICAL,
    CULTURAL,
    SPORTS,
    SOCIAL_SERVICE,
    ACADEMIC,
    ENTREPRENEURSHIP,
    MEDIA_ARTS
}

data class Club(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val category: ClubCategory = ClubCategory.TECHNICAL,
    val logoUrl: String = "",
    val bannerUrl: String = "",
    val coordinatorId: String = "",
    val coordinatorName: String = "",
    val facultyAdvisor: String = "",
    val memberCount: Int = 0,
    val tags: List<String> = emptyList(),
    val createdAt: Timestamp? = null
)

enum class MembershipStatus {
    PENDING,
    APPROVED,
    REJECTED
}

data class ClubMembership(
    val id: String = "",
    val clubId: String = "",
    val clubName: String = "",
    val userId: String = "",
    val userName: String = "",
    val userEmail: String = "",
    val requestedAt: Timestamp? = null,
    val status: MembershipStatus = MembershipStatus.PENDING,
    val reviewedBy: String = "",
    val reviewedAt: Timestamp? = null
)

enum class AnnouncementCategory {
    GENERAL,
    ACADEMIC,
    EXAMINATION,
    PLACEMENT,
    EVENTS,
    CLUBS,
    ADMINISTRATION,
    URGENT
}

enum class AnnouncementPriority {
    LOW,
    NORMAL,
    HIGH,
    URGENT
}

data class Announcement(
    val id: String = "",
    val title: String = "",
    val content: String = "",
    val category: AnnouncementCategory = AnnouncementCategory.GENERAL,
    val priority: AnnouncementPriority = AnnouncementPriority.NORMAL,
    val authorName: String = "",
    val authorRole: String = "",
    val authorId: String = "",
    val targetAudience: String = "All", // "All", "Students", "Faculty", Department name
    val attachmentUrl: String = "",
    val publishedAt: Timestamp? = null
)

enum class ResourceType {
    NOTES,
    QUESTION_PAPERS,
    SYLLABUS,
    LAB_MANUALS,
    REFERENCE_MATERIAL,
    TUTORIALS,
    PROJECT_RESOURCES,
    PLACEMENT_PREPARATION
}

data class AcademicResource(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val subject: String = "",
    val department: String = "",
    val semester: Int = 1,
    val academicYear: String = "2024-2025",
    val type: ResourceType = ResourceType.NOTES,
    val fileUrl: String = "",
    val authorName: String = "",
    val authorId: String = "",
    val uploadedAt: Timestamp? = null,
    val isVerified: Boolean = true
)

enum class PostCategory {
    CAMPUS_LIFE,
    ACADEMIC_HELP,
    PROJECTS,
    ACHIEVEMENTS,
    OPPORTUNITIES,
    GENERAL_DISCUSSION
}

data class CommunityPost(
    val id: String = "",
    val authorId: String = "",
    val authorName: String = "",
    val authorRole: String = "Student",
    val authorPhotoUrl: String = "",
    val content: String = "",
    val category: PostCategory = PostCategory.CAMPUS_LIFE,
    val imageUrl: String = "",
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val createdAt: Timestamp? = null
)

data class PostComment(
    val id: String = "",
    val postId: String = "",
    val authorId: String = "",
    val authorName: String = "",
    val content: String = "",
    val createdAt: Timestamp? = null
)

data class InAppNotification(
    val id: String = "",
    val userId: String = "",
    val title: String = "",
    val message: String = "",
    val type: String = "SYSTEM", // EVENT, CLUB, ANNOUNCEMENT, SYSTEM, MODERATION
    val targetRoute: String = "",
    val isRead: Boolean = false,
    val createdAt: Timestamp? = null
)

data class FeedbackSubmission(
    val id: String = "",
    val userId: String = "",
    val userName: String = "",
    val subject: String = "",
    val category: String = "General Feedback",
    val description: String = "",
    val status: String = "OPEN", // OPEN, IN_REVIEW, RESOLVED, CLOSED
    val submittedAt: Timestamp? = null
)

data class AuditLog(
    val id: String = "",
    val actorId: String = "",
    val actorEmail: String = "",
    val action: String = "",
    val targetType: String = "",
    val targetId: String = "",
    val details: String = "",
    val timestamp: Timestamp? = null
)
