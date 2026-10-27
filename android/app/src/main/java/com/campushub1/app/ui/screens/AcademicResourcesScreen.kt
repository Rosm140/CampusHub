package com.campushub1.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.BookmarkAdd
import androidx.compose.material.icons.outlined.FileDownload
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AcademicResourcesScreen(onBack: () -> Unit) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedType by remember { mutableStateOf("All") }
    var bookmarkedIds by remember { mutableStateOf(setOf<String>()) }

    val types = listOf("All", "Notes", "Question Papers", "Syllabus", "Lab Manuals", "Tutorials")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Academic Resources", fontWeight = FontWeight.Bold) },
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
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search subject, code, or professor...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(12.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(types) { t ->
                    FilterChip(
                        selected = selectedType == t,
                        onClick = { selectedType = t },
                        label = { Text(t) }
                    )
                }
            }

            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    ResourceItemCard(
                        id = "res_1",
                        title = "CS301: Algorithms & Complexity Complete Lecture Notes",
                        subject = "Computer Science • Sem 5",
                        author = "Prof. D. Knuth (Faculty Verified)",
                        type = "Notes",
                        fileSize = "4.2 MB PDF",
                        isBookmarked = bookmarkedIds.contains("res_1"),
                        onBookmarkToggle = {
                            bookmarkedIds = if (bookmarkedIds.contains("res_1")) bookmarkedIds - "res_1" else bookmarkedIds + "res_1"
                        }
                    )
                }

                item {
                    ResourceItemCard(
                        id = "res_2",
                        title = "Previous 5 Years Solved Midterm Papers (2020-2025)",
                        subject = "Engineering Mathematics III",
                        author = "Academic Resource Council",
                        type = "Question Papers",
                        fileSize = "12.8 MB PDF",
                        isBookmarked = bookmarkedIds.contains("res_2"),
                        onBookmarkToggle = {
                            bookmarkedIds = if (bookmarkedIds.contains("res_2")) bookmarkedIds - "res_2" else bookmarkedIds + "res_2"
                        }
                    )
                }

                item {
                    ResourceItemCard(
                        id = "res_3",
                        title = "Digital Signal Processing Lab Manual & MATLAB Codes",
                        subject = "Electronics & Comm • Sem 6",
                        author = "Dr. S. K. Mitra",
                        type = "Lab Manuals",
                        fileSize = "8.1 MB ZIP",
                        isBookmarked = bookmarkedIds.contains("res_3"),
                        onBookmarkToggle = {
                            bookmarkedIds = if (bookmarkedIds.contains("res_3")) bookmarkedIds - "res_3" else bookmarkedIds + "res_3"
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ResourceItemCard(
    id: String,
    title: String,
    subject: String,
    author: String,
    type: String,
    fileSize: String,
    isBookmarked: Boolean,
    onBookmarkToggle: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Description,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(36.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(2.dp))
                Text(subject, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                Text("$author • $fileSize", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            IconButton(onClick = onBookmarkToggle) {
                Icon(
                    imageVector = if (isBookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkAdd,
                    contentDescription = "Bookmark",
                    tint = if (isBookmarked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                )
            }
        }
    }
}
