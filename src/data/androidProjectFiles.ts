export interface AndroidFileRecord {
  path: string;
  name: string;
  category: 'Kotlin Source' | 'Gradle Build' | 'Android XML' | 'Firebase Rules' | 'Documentation';
  language: 'kotlin' | 'groovy' | 'xml' | 'javascript' | 'markdown';
  content: string;
}

export const ANDROID_FILES: AndroidFileRecord[] = [
  {
    path: 'android/build.gradle.kts',
    name: 'build.gradle.kts (Root)',
    category: 'Gradle Build',
    language: 'groovy',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}`
  },
  {
    path: 'android/settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'Gradle Build',
    language: 'groovy',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CampusHUB1"
include(":app")`
  },
  {
    path: 'android/gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    category: 'Gradle Build',
    language: 'groovy',
    content: `[versions]
agp = "8.8.0"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.10.0"
composeBom = "2024.12.01"
navigationCompose = "2.8.5"
firebaseBom = "33.7.0"
coilCompose = "2.7.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-auth-ktx = { group = "com.google.firebase", name = "firebase-auth-ktx" }
firebase-firestore-ktx = { group = "com.google.firebase", name = "firebase-firestore-ktx" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coilCompose" }`
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'Gradle Build',
    language: 'groovy',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.campushub1.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.campushub1.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth.ktx)
    implementation(libs.firebase.firestore.ktx)
    implementation(libs.coil.compose)
}`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'Android XML',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".CampusHubApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.CampusHUB1">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'android/app/src/main/java/com/campushub1/app/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    content: `package com.campushub1.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.campushub1.app.ui.navigation.CampusNavHost
import com.campushub1.app.ui.theme.CampusHUB1Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CampusHUB1Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CampusNavHost()
                }
            }
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/campushub1/app/data/model/Models.kt',
    name: 'Models.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    content: `package com.campushub1.app.data.model

import com.google.firebase.Timestamp

enum class UserRole {
    STUDENT, FACULTY, CLUB_COORDINATOR, ADMINISTRATOR
}

data class User(
    val uid: String = "",
    val email: String = "",
    val displayName: String = "",
    val department: String = "",
    val course: String = "",
    val academicYear: String = "",
    val studentId: String = "",
    val role: UserRole = UserRole.STUDENT,
    val joinedClubs: List<String> = emptyList(),
    val registeredEvents: List<String> = emptyList()
)

data class Event(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val category: String = "Other",
    val startDate: Timestamp? = null,
    val venue: String = "",
    val organizer: String = "",
    val capacity: Int = 100,
    val registeredCount: Int = 0,
    val isApproved: Boolean = false
)

data class Club(
    val id: String = "",
    val name: String = "",
    val category: String = "Technical",
    val description: String = "",
    val coordinatorId: String = "",
    val memberCount: Int = 0
)

data class CommunityPost(
    val id: String = "",
    val authorId: String = "",
    val authorName: String = "",
    val content: String = "",
    val category: String = "Campus Life",
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val createdAt: Timestamp? = null
)`
  },
  {
    path: 'android/app/src/main/java/com/campushub1/app/data/repository/Repositories.kt',
    name: 'Repositories.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    content: `package com.campushub1.app.data.repository

import com.campushub1.app.data.model.*
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class EventsRepository(private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()) {
    // Atomic transaction ensuring capacity safety & duplicate check
    suspend fun registerForEvent(eventId: String, userId: String, userName: String): Boolean {
        val eventRef = firestore.collection("events").document(eventId)
        val regRef = firestore.collection("eventRegistrations").document("\${eventId}_\${userId}")
        
        return firestore.runTransaction { tx ->
            val eventSnap = tx.get(eventRef)
            val cap = eventSnap.getLong("capacity") ?: 0
            val count = eventSnap.getLong("registeredCount") ?: 0
            if (count >= cap) throw IllegalStateException("Event is full")
            if (tx.get(regRef).exists()) throw IllegalStateException("Already registered")
            
            tx.update(eventRef, "registeredCount", count + 1)
            tx.set(regRef, mapOf("status" to "CONFIRMED", "userId" to userId))
            true
        }.await()
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/campushub1/app/ui/navigation/CampusNavigation.kt',
    name: 'CampusNavigation.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    content: `package com.campushub1.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.campushub1.app.ui.screens.*

sealed class Screen(val route: String, val title: String) {
    object Home : Screen("home", "Home")
    object Events : Screen("events", "Events")
    object Clubs : Screen("clubs", "Clubs")
    object Community : Screen("community", "Community")
    object Profile : Screen("profile", "Profile")
}

@Composable
fun CampusNavHost() {
    val navController = rememberNavController()
    // Scaffold with Material 3 NavigationBar and NavHost...
}`
  },
  {
    path: 'android/firestore.rules',
    name: 'firestore.rules',
    category: 'Firebase Rules',
    language: 'javascript',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMINISTRATOR'; }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow update: if (request.auth.uid == userId && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isActive'])) || isAdmin();
    }

    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow update: if isAdmin() || (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['registeredCount']));
    }

    match /eventRegistrations/{regId} {
      allow read, create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}`
  },
  {
    path: 'android/README.md',
    name: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    content: `# CampusHUB1 - Native Android Application Setup Guide
Open Android Studio, select File -> Open -> select this directory.
Add your google-services.json to android/app/google-services.json.
Run on emulator or physical phone.`
  }
];
