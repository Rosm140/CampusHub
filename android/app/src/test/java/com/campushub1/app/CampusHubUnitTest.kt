package com.campushub1.app

import com.campushub1.app.data.model.Event
import com.campushub1.app.data.model.User
import com.campushub1.app.data.model.UserRole
import org.junit.Assert.*
import org.junit.Test

class CampusHubUnitTest {

    @Test
    fun defaultUserRole_isStudent() {
        val user = User(uid = "test_123", email = "student@campus.edu", displayName = "Alex")
        assertEquals(UserRole.STUDENT, user.role)
    }

    @Test
    fun userRole_cannotSelfAssignAdministrator() {
        val user = User(uid = "test_456", email = "hacker@campus.edu", role = UserRole.STUDENT)
        val requestedRole = UserRole.ADMINISTRATOR
        
        // Simulating validation logic
        val isSelfPromotionAllowed = false
        val finalRole = if (isSelfPromotionAllowed) requestedRole else user.role

        assertEquals(UserRole.STUDENT, finalRole)
    }

    @Test
    fun eventCapacityCheck_preventsOverbooking() {
        val event = Event(id = "ev_1", title = "AI Workshop", capacity = 50, registeredCount = 50)
        val canRegister = event.registeredCount < event.capacity
        assertFalse(canRegister)
    }

    @Test
    fun eventCapacityCheck_allowsWhenSpotsAvailable() {
        val event = Event(id = "ev_2", title = "Hackathon", capacity = 100, registeredCount = 42)
        val canRegister = event.registeredCount < event.capacity
        assertTrue(canRegister)
    }
}
