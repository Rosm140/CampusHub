package com.campushub1.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.ui.theme.ErrorRed
import com.campushub1.app.ui.theme.SuccessGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(onBack: () -> Unit) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("Overview", "Event Approvals", "User Roles", "Reports")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Campus Administration", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
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
            TabRow(selectedTabIndex = selectedTab) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title, fontSize = 12.sp) }
                    )
                }
            }

            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Metric cards
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        MetricCard("Total Users", "4,280", Icons.Default.People, Modifier.weight(1f))
                        MetricCard("Active Events", "38", Icons.Default.Event, Modifier.weight(1f))
                        MetricCard("Pending Approvals", "6", Icons.Default.PendingActions, Modifier.weight(1f))
                    }
                }

                item {
                    Text("Pending Event Submissions", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }

                item {
                    AdminApprovalItem(
                        title = "Inter-College Autonomous Drone Racing",
                        submittedBy = "Robotics Club • Rohan V.",
                        date = "Dec 10, 2026",
                        venue = "North Sports Ground",
                        onApprove = { /* Approve */ },
                        onReject = { /* Reject */ }
                    )
                }

                item {
                    AdminApprovalItem(
                        title = "DevOps & Cloud Architecture Bootcamp",
                        submittedBy = "CSE Faculty • Dr. K. Rao",
                        date = "Nov 28, 2026",
                        venue = "Computer Lab 4",
                        onApprove = { /* Approve */ },
                        onReject = { /* Reject */ }
                    )
                }

                item {
                    Text("System Audit Logs (Last 24h)", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }

                item {
                    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("• User 'prof.sharma@campus.edu' promoted to FACULTY by Admin", fontSize = 12.sp)
                            Text("• Event 'CodeSpark Hackathon' capacity increased to 120", fontSize = 12.sp)
                            Text("• Flagged community comment removed for policy violation", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(title: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier = Modifier) {
    Card(modifier = modifier, shape = RoundedCornerShape(12.dp)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Icon(imageVector = icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text(title, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun AdminApprovalItem(
    title: String,
    submittedBy: String,
    date: String,
    venue: String,
    onApprove: () -> Unit,
    onReject: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            Text("Submitted by: $submittedBy", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
            Text("$date • $venue", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

            Spacer(modifier = Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = onApprove,
                    colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Approve")
                }
                OutlinedButton(
                    onClick = onReject,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = ErrorRed),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Reject")
                }
            }
        }
    }
}
