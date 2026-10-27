# CampusHUB1 - Native Android Application

**Tagline:** Your Campus. Your Community. One Hub.  
**Package Name:** `com.campushub1.app`  
**Architecture:** Kotlin • Jetpack Compose • Material 3 • MVVM • StateFlow • Coroutines • Firebase Authentication & Cloud Firestore

---

## 📱 Features

- **Personalized Home Dashboard:** Live greetings, urgent announcements banner, quick action tiles, upcoming events carousel, and popular clubs.
- **Events Discovery & RSVP:** Discover events by category, live seat counter (`capacity - registered`), duplicate registration prevention, and cancellation.
- **Clubs & Societies Directory:** Browse student clubs, view leads & faculty advisors, submit membership requests, and coordinator approval queue.
- **Academic Resources:** Search lecture notes, previous 5-year solved question papers, lab manuals, and syllabus with bookmarking.
- **Campus Community Feed:** Real-time posts, category filtering, likes/unlikes with atomic transactions, comments, and post reporting.
- **In-App Notification Center:** Unread notifications badge, event confirmation tickets, and club acceptance alerts.
- **Role-Based Experience:** 4 roles (Student, Faculty, Club Coordinator, Administrator).
- **Administration Console:** Metric counters, pending event approvals, user role management, and immutable audit logs.
- **Hardened Security Rules:** Atomic Firestore transactions prevent overbooking, enforce role isolation, and prevent self-privilege escalation.

---

## 🛠 Project Structure

```
android/
├── build.gradle.kts                # Project root Gradle configuration
├── settings.gradle.kts             # Module repository settings
├── gradle.properties               # JVM memory & AndroidX settings
├── gradle/libs.versions.toml       # Gradle Version Catalog (AGP, Compose, Firebase BoM)
├── firestore.rules                 # Production Firestore Security Rules
├── firestore.indexes.json          # Composite query indexes
└── app/
    ├── build.gradle.kts            # App module build dependencies
    ├── proguard-rules.pro          # ProGuard / R8 optimization rules
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml # Permissions & Application entry point
        │   ├── java/com/campushub1/app/
        │   │   ├── MainActivity.kt
        │   │   ├── CampusHubApp.kt
        │   │   ├── data/
        │   │   │   ├── model/Models.kt
        │   │   │   └── repository/Repositories.kt
        │   │   └── ui/
        │   │       ├── theme/Theme.kt
        │   │       ├── navigation/CampusNavigation.kt
        │   │       └── screens/
        │   │           ├── HomeScreen.kt
        │   │           ├── EventsScreen.kt
        │   │           ├── ClubsScreen.kt
        │   │           ├── CommunityScreen.kt
        │   │           ├── AcademicResourcesScreen.kt
        │   │           ├── AnnouncementsScreen.kt
        │   │           ├── AdminScreen.kt
        │   │           ├── ProfileScreen.kt
        │   │           ├── NotificationsScreen.kt
        │   │           └── AuthScreens.kt
        │   └── res/values/
        │       ├── strings.xml
        │       ├── colors.xml
        │       └── themes.xml
        └── test/java/com/campushub1/app/
            └── CampusHubUnitTest.kt
```

---

## 🚀 How to Run in Android Studio

### 1. Prerequisites
- **Android Studio Ladybug (2024.2+)** or **Android Studio Koala / Hedgehog**
- **JDK 17** or **JDK 21**
- Android SDK Platform 35 / 36

### 2. Import Project
1. Open Android Studio.
2. Select **File > Open...** and select the `/android` folder.
3. Allow Gradle to sync dependencies from the `libs.versions.toml` catalog.

### 3. Connect Firebase
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create a project named `CampusHUB1`.
3. Register an Android App with package name:
   ```
   com.campushub1.app
   ```
4. Download the generated `google-services.json` file.
5. Place `google-services.json` in:
   ```
   android/app/google-services.json
   ```
6. Enable **Firebase Authentication** (Email/Password provider).
7. Enable **Cloud Firestore** in test or production mode.
8. Deploy rules using Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### 4. Run on Device or Emulator
1. Start an Android Virtual Device (AVD) running Android 10+ (API 29+).
2. Click **Run > Run 'app'** (`Shift + F10`).
3. The app will launch with the Edge-to-Edge Compose interface!

---

## 🔒 Security Architecture
- Users can never elevate their own role (`role` field is protected in `firestore.rules`).
- Event registrations use atomic Firestore transactions to prevent exceeding room capacity.
- Community posts and comments can only be edited/deleted by original authors or Admins.
- Audit logs are append-only.
