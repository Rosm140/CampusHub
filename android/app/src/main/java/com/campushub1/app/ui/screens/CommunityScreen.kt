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
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.campushub1.app.data.model.PostCategory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommunityScreen() {
    var selectedCategory by remember { mutableStateOf<String>("All") }
    var showCreatePostDialog by remember { mutableStateOf(false) }
    var newPostContent by remember { mutableStateOf("") }
    var likedPosts by remember { mutableStateOf(setOf<String>()) }

    val categories = listOf("All", "Campus Life", "Academic Help", "Projects", "Achievements", "Opportunities")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Campus Community", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { /* Search */ }) {
                        Icon(Icons.Default.Search, contentDescription = "Search")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreatePostDialog = true },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.AddComment, contentDescription = "New Post", tint = MaterialTheme.colorScheme.onPrimary)
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
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

            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    PostCard(
                        id = "p1",
                        author = "Samantha Hayes",
                        authorRole = "Student (3rd Year CSE)",
                        timeAgo = "2h ago",
                        category = "Projects",
                        content = "Hey everyone! We are putting together an autonomous solar drone team for the Smart India Hackathon. We are looking for an Embedded Systems/IoT specialist. Drop a comment if interested!",
                        likes = if (likedPosts.contains("p1")) 25 else 24,
                        comments = 8,
                        isLiked = likedPosts.contains("p1"),
                        onLikeToggle = {
                            likedPosts = if (likedPosts.contains("p1")) likedPosts - "p1" else likedPosts + "p1"
                        }
                    )
                }

                item {
                    PostCard(
                        id = "p2",
                        author = "Prof. Marcus Vance",
                        authorRole = "Faculty Advisor",
                        timeAgo = "5h ago",
                        category = "Academic Help",
                        content = "Reminder for CS304: Distributed Systems assignment 2 is due this Friday by 11:59 PM. Office hours tomorrow from 3 to 5 PM in Room 412.",
                        likes = if (likedPosts.contains("p2")) 41 else 40,
                        comments = 14,
                        isLiked = likedPosts.contains("p2"),
                        onLikeToggle = {
                            likedPosts = if (likedPosts.contains("p2")) likedPosts - "p2" else likedPosts + "p2"
                        }
                    )
                }
            }
        }

        if (showCreatePostDialog) {
            AlertDialog(
                onDismissRequest = { showCreatePostDialog = false },
                title = { Text("Create Community Post") },
                text = {
                    OutlinedTextField(
                        value = newPostContent,
                        onValueChange = { newPostContent = it },
                        placeholder = { Text("Share updates, questions, project openings...") },
                        modifier = Modifier.fillMaxWidth().height(140.dp)
                    )
                },
                confirmButton = {
                    Button(
                        onClick = {
                            showCreatePostDialog = false
                            newPostContent = ""
                        },
                        enabled = newPostContent.isNotBlank()
                    ) {
                        Text("Post")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showCreatePostDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}

@Composable
fun PostCard(
    id: String,
    author: String,
    authorRole: String,
    timeAgo: String,
    category: String,
    content: String,
    likes: Int,
    comments: Int,
    isLiked: Boolean,
    onLikeToggle: () -> Unit
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
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = author.take(1),
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(author, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("$authorRole • $timeAgo", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                SuggestionChip(
                    onClick = {},
                    label = { Text(category, fontSize = 10.sp) }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(content, fontSize = 14.sp, lineHeight = 20.sp)

            Spacer(modifier = Modifier.height(14.dp))
            Divider(color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.clickable { onLikeToggle() },
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (isLiked) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$likes likes",
                        fontSize = 12.sp,
                        color = if (isLiked) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "Comments",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("$comments comments", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                IconButton(onClick = { /* Report */ }) {
                    Icon(Icons.Outlined.Flag, contentDescription = "Report", tint = MaterialTheme.colorScheme.outline, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}
