package com.campushub1.app

import android.app.Application
import com.google.firebase.FirebaseApp

class CampusHubApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Firebase if configured via google-services.json
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            // Firebase initialized automatically by Google Services plugin if google-services.json is present
        }
    }
}
