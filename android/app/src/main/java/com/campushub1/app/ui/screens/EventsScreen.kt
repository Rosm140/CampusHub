package com.campushub1.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.data.model.EventCategory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EventsScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf<String?>("All") }
    var registeredEventIds by remember { mutableStateOf(setOf<String>()) }
    var showDialogForEvent by remember { mutableStateOf<String?>(null) }

    val categories = listOf("All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Hackathon")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Campus Events", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { /* Filter */ }) {
                        Icon(Icons.Default.FilterList, contentDescription = "Filter")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search workshops, hackathons, seminars...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear")
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )

            // Category Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat) }
                    )
                }
            }

            // Events List
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    EventCard(
                        id = "ev_1",
                        title = "National Hackathon 2026: CodeSpark",
                        organizer = "Computer Science Dept & GDSC",
                        date = "Nov 14 - Nov 15, 2026",
                        venue = "Computing Center & Virtual",
                        category = "Hackathon",
                        capacity = 120,
                        registered = 86,
                        isRegistered = registeredEventIds.contains("ev_1"),
                        onRegister = {
                            registeredEventIds = registeredEventIds + "ev_1"
                            showDialogForEvent = "CodeSpark"
                        },
                        onCancel = { registeredEventIds = registeredEventIds - "ev_1" }
                    )
                }

                item {
                    EventCard(
                        id = "ev_2",
                        title = "Robotics Workshop: Autonomous Rovers",
                        organizer = "Robotics Club",
                        date = "Nov 20, 2026 • 10:00 AM",
                        venue = "Mechatronics Lab 3",
                        category = "Workshop",
                        capacity = 40,
                        registered = 38,
                        isRegistered = registeredEventIds.contains("ev_2"),
                        onRegister = {
                            registeredEventIds = registeredEventIds + "ev_2"
                            showDialogForEvent = "Autonomous Rovers"
                        },
                        onCancel = { registeredEventIds = registeredEventIds - "ev_2" }
                    )
                }

                item {
                    EventCard(
                        id = "ev_3",
                        title = "Annual Campus Cultural Fest: AURA 2026",
                        organizer = "Student Cultural Council",
                        date = "Dec 01 - Dec 03, 2026",
                        venue = "Open Air Amphitheatre",
                        category = "Cultural",
                        capacity = 1500,
                        registered = 820,
                        isRegistered = registeredEventIds.contains("ev_3"),
                        onRegister = {
                            registeredEventIds = registeredEventIds + "ev_3"
                            showDialogForEvent = "AURA 2026"
                        },
                        onCancel = { registeredEventIds = registeredEventIds - "ev_3" }
                    )
                }
            }
        }

        // Registration Confirmation Dialog
        if (showDialogForEvent != null) {
            AlertDialog(
                onDismissRequest = { showDialogForEvent = null },
                icon = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                title = { Text("Registration Confirmed!") },
                text = { Text("You are now registered for $showDialogForEvent. We sent an in-app confirmation ticket to your profile.") },
                confirmButton = {
                    TextButton(onClick = { showDialogForEvent = null }) {
                        Text("Awesome")
                    }
                }
            )
        }
    }
}

@Composable
fun EventCard(
    id: String,
    title: String,
    organizer: String,
    date: String,
    venue: String,
    category: String,
    capacity: Int,
    registered: Int,
    isRegistered: Boolean,
    onRegister: () -> Unit,
    onCancel: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                AssistChip(
                    onClick = {},
                    label = { Text(category, fontSize = 11.sp) }
                )
                Text(
                    text = "${capacity - registered} spots left",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Text("Organized by $organizer", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

            Spacer(modifier = Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CalendarToday, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.width(6.dp))
                Text(date, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Place, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.width(6.dp))
                Text(venue, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            Spacer(modifier = Modifier.height(14.dp))
            LinearProgressIndicator(
                progress = { registered.toFloat() / capacity.toFloat() },
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )

            Spacer(modifier = Modifier.height(14.dp))
            if (isRegistered) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    FilledTonalButton(onClick = {}, colors = ButtonDefaults.filledTonalButtonColors()) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Registered")
                    }
                    OutlinedButton(onClick = onCancel) {
                        Text("Cancel RSVP", color = MaterialTheme.colorScheme.error)
                    }
                }
            } else {
                Button(
                    onClick = onRegister,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.AppRegistration, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Register Now")
                }
            }
        }
    }
}
