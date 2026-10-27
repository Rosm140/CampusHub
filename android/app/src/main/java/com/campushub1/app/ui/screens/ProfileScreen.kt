package com.campushub1.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.data.model.UserRole

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(onNavigateToAdmin: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Student Profile", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { /* Settings */ }) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "AH",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Alex Harrison", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("alex.harrison@university.edu", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        AssistChip(
                            onClick = {},
                            label = { Text("Role: Student (UID: #CS-2023-8941)") },
                            leadingIcon = { Icon(Icons.Default.School, contentDescription = null, modifier = Modifier.size(16.dp)) }
                        )

                        Spacer(modifier = Modifier.height(16.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            ProfileStatItem("3", "Joined Clubs")
                            ProfileStatItem("4", "Registered Events")
                            ProfileStatItem("12", "Bookmarks")
                        }
                    }
                }
            }

            item {
                Text("Academic Information", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Card(modifier = Modifier.fillMaxWidth().padding(top = 8.dp), shape = RoundedCornerShape(12.dp)) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        ProfileInfoRow("Department", "Computer Science & Engineering")
                        ProfileInfoRow("Degree Program", "B.Tech in Artificial Intelligence")
                        ProfileInfoRow("Academic Year", "3rd Year (Semester 5)")
                        ProfileInfoRow("Enrolled Campus", "Main Campus - West Wing")
                    }
                }
            }

            item {
                Text("Account & Preferences", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Card(modifier = Modifier.fillMaxWidth().padding(top = 8.dp), shape = RoundedCornerShape(12.dp)) {
                    Column {
                        ListItem(
                            headlineContent = { Text("Push & Email Notifications") },
                            leadingContent = { Icon(Icons.Outlined.Notifications, contentDescription = null) },
                            trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("App Theme (Dark / Light / System)") },
                            leadingContent = { Icon(Icons.Outlined.DarkMode, contentDescription = null) },
                            trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("Help & Campus Support Desk") },
                            leadingContent = { Icon(Icons.Outlined.HelpOutline, contentDescription = null) },
                            trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                        )
                        Divider()
                        ListItem(
                            headlineContent = { Text("Switch to Administrator Console", color = MaterialTheme.colorScheme.primary) },
                            leadingContent = { Icon(Icons.Default.AdminPanelSettings, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                            modifier = Modifier.clickable { onNavigateToAdmin() }
                        )
                    }
                }
            }

            item {
                OutlinedButton(
                    onClick = { /* Sign Out */ },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                ) {
                    Icon(Icons.Default.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Sign Out of CampusHUB1")
                }
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
fun ProfileStatItem(count: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(count, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MaterialTheme.colorScheme.primary)
        Text(label, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun ProfileInfoRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontSize = 12.sp, fontWeight = FontWeight.Medium)
    }
}
