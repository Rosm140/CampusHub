package com.campushub1.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.ui.theme.CyanAccent
import com.campushub1.app.ui.theme.IndigoPrimary
import com.campushub1.app.ui.theme.VioletSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToEvents: () -> Unit,
    onNavigateToClubs: () -> Unit,
    onNavigateToAnnouncements: () -> Unit,
    onNavigateToResources: () -> Unit,
    onNavigateToNotifications: () -> Unit,
    onNavigateToAdmin: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "CampusHUB1",
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "Welcome back, Alex 👋",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToNotifications) {
                        BadgedBox(
                            badge = { Badge { Text("3") } }
                        ) {
                            Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                        }
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Quick Action Grid / Chips
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    QuickActionCard(
                        title = "Notices",
                        icon = Icons.Default.Campaign,
                        color = IndigoPrimary,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToAnnouncements
                    )
                    QuickActionCard(
                        title = "Resources",
                        icon = Icons.Default.MenuBook,
                        color = VioletSecondary,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToResources
                    )
                    QuickActionCard(
                        title = "Clubs",
                        icon = Icons.Default.Groups,
                        color = CyanAccent,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToClubs
                    )
                    QuickActionCard(
                        title = "Admin",
                        icon = Icons.Default.Security,
                        color = Color(0xFFF59E0B),
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToAdmin
                    )
                }
            }

            // High Priority Notice Banner
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth().clickable { onNavigateToAnnouncements() }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.PriorityHigh,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier
                                .size(40.dp)
                                .background(MaterialTheme.colorScheme.errorContainer, CircleShape)
                                .padding(8.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Mid-Term Examination Schedule",
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "Published by Controller of Exams. View detailed timetable.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                    }
                }
            }

            // Featured Upcoming Events
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Upcoming Events",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    TextButton(onClick = onNavigateToEvents) {
                        Text("View all")
                    }
                }
            }

            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    item {
                        EventMiniCard(
                            title = "HackMatrix 2026",
                            date = "Nov 12 • 09:00 AM",
                            venue = "Innovation Lab",
                            category = "Hackathon",
                            seatsLeft = "18 spots left",
                            onClick = onNavigateToEvents
                        )
                    }
                    item {
                        EventMiniCard(
                            title = "AI in Healthcare Seminar",
                            date = "Nov 16 • 02:00 PM",
                            venue = "Main Auditorium",
                            category = "Seminar",
                            seatsLeft = "45 spots left",
                            onClick = onNavigateToEvents
                        )
                    }
                }
            }

            // Recommended Clubs
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Popular Student Clubs",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    TextButton(onClick = onNavigateToClubs) {
                        Text("Explore")
                    }
                }
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    ClubRowItem(
                        name = "Google Developer Student Club",
                        category = "Technical",
                        members = "340 Members",
                        onClick = onNavigateToClubs
                    )
                    ClubRowItem(
                        name = "Robotics & Automation Society",
                        category = "Technical",
                        members = "195 Members",
                        onClick = onNavigateToClubs
                    )
                }
            }
        }
    }
}

@Composable
fun QuickActionCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(imageVector = icon, contentDescription = title, tint = color, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun EventMiniCard(
    title: String,
    date: String,
    venue: String,
    category: String,
    seatsLeft: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(240.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            SuggestionChip(
                onClick = {},
                label = { Text(category, fontSize = 10.sp) },
                colors = SuggestionChipDefaults.suggestionChipColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp, maxLines = 1)
            Spacer(modifier = Modifier.height(4.dp))
            Text(date, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(venue, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(8.dp))
            Text(seatsLeft, fontSize = 11.sp, color = IndigoPrimary, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun ClubRowItem(
    name: String,
    category: String,
    members: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.secondaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = name.take(2).uppercase(),
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Text("$category • $members", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
