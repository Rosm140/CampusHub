package com.campushub1.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClubsScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var requestedClubIds by remember { mutableStateOf(setOf<String>()) }
    var snackbarHostState = remember { SnackbarHostState() }
    var scope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Student Clubs & Societies", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search by club name, tech, arts...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )

            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    ClubDetailedCard(
                        id = "club_1",
                        name = "Google Developer Student Club (GDSC)",
                        category = "Technical",
                        description = "Community for university students interested in Google developer technologies, mobile development, web, and cloud.",
                        lead = "Rohan Verma (Lead)",
                        advisor = "Dr. Anita Desai",
                        members = 340,
                        isRequested = requestedClubIds.contains("club_1"),
                        onRequest = {
                            requestedClubIds = requestedClubIds + "club_1"
                        }
                    )
                }

                item {
                    ClubDetailedCard(
                        id = "club_2",
                        name = "Literary and Debating Society",
                        category = "Cultural & Arts",
                        description = "Fosters intellectual dialogue, public speaking, model United Nations conferences, and creative writing workshops.",
                        lead = "Priya Sen (President)",
                        advisor = "Prof. Robert Smith",
                        members = 185,
                        isRequested = requestedClubIds.contains("club_2"),
                        onRequest = {
                            requestedClubIds = requestedClubIds + "club_2"
                        }
                    )
                }

                item {
                    ClubDetailedCard(
                        id = "club_3",
                        name = "Campus Robotics & AI Wing",
                        category = "Technical & Research",
                        description = "Building combat robots, line followers, autonomous drones, and competing in national robotics challenges.",
                        lead = "Dev Patel (Head)",
                        advisor = "Dr. K. Narayanan",
                        members = 210,
                        isRequested = requestedClubIds.contains("club_3"),
                        onRequest = {
                            requestedClubIds = requestedClubIds + "club_3"
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ClubDetailedCard(
    id: String,
    name: String,
    category: String,
    description: String,
    lead: String,
    advisor: String,
    members: Int,
    isRequested: Boolean,
    onRequest: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = name.take(2).uppercase(),
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("$category • $members members", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(description, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Coordinator: $lead", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                Text("Advisor: $advisor", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
            }

            Spacer(modifier = Modifier.height(14.dp))
            if (isRequested) {
                FilledTonalButton(
                    onClick = {},
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.HourglassTop, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Membership Request Pending Review")
                }
            } else {
                OutlinedButton(
                    onClick = onRequest,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Request to Join Club")
                }
            }
        }
    }
}
