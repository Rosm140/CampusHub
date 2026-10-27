package com.campushub1.app.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.ui.theme.ErrorRed
import com.campushub1.app.ui.theme.IndigoPrimary
import com.campushub1.app.ui.theme.WarningAmber

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnnouncementsScreen(onBack: () -> Unit) {
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Urgent", "Academic", "Examination", "Placement", "Events")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Campus Announcements", fontWeight = FontWeight.Bold) },
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
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    AnnouncementCard(
                        title = "URGENT: Revised End-Semester Exam Schedule Released",
                        sender = "Office of the Controller of Examinations",
                        date = "Today, 10:30 AM",
                        category = "Examination",
                        priority = "URGENT",
                        content = "All students are directed to check their updated exam timetables on the portal. Due to the regional elections, exams originally scheduled for Dec 02 are moved to Dec 09."
                    )
                }

                item {
                    AnnouncementCard(
                        title = "Campus Placement Drive: Google & Microsoft Pre-Placement Talks",
                        sender = "Career Development & Training Cell",
                        date = "Yesterday, 04:15 PM",
                        category = "Placement",
                        priority = "HIGH",
                        content = "Pre-placement talk for final year B.Tech/Dual Degree students will take place on Saturday at 11 AM in the Main Seminar Hall. Formal dress code is mandatory."
                    )
                }

                item {
                    AnnouncementCard(
                        title = "Library Book Return Grace Period Extended",
                        sender = "Central Library Committee",
                        date = "Oct 24, 2026",
                        category = "Academic",
                        priority = "NORMAL",
                        content = "Overdue fines for books issued prior to mid-semester breaks are waived until next Monday. Please return or re-issue your books at counter 2."
                    )
                }
            }
        }
    }
}

@Composable
fun AnnouncementCard(
    title: String,
    sender: String,
    date: String,
    category: String,
    priority: String,
    content: String
) {
    val priorityColor = when (priority) {
        "URGENT" -> ErrorRed
        "HIGH" -> WarningAmber
        else -> IndigoPrimary
    }

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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(priorityColor)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = priority,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = priorityColor
                    )
                }
                Text(date, fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            Text(sender, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)

            Spacer(modifier = Modifier.height(8.dp))
            Text(content, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 19.sp)
        }
    }
}
