package com.campushub1.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.campushub1.app.ui.screens.*

sealed class Screen(val route: String, val title: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Events : Screen("events", "Events", Icons.Filled.Event, Icons.Outlined.Event)
    object Clubs : Screen("clubs", "Clubs", Icons.Filled.Groups, Icons.Outlined.Groups)
    object Community : Screen("community", "Community", Icons.Filled.Forum, Icons.Outlined.Forum)
    object Profile : Screen("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
    
    // Sub-screens
    object Announcements : Screen("announcements", "Announcements", Icons.Filled.Campaign, Icons.Outlined.Campaign)
    object AcademicResources : Screen("resources", "Resources", Icons.Filled.MenuBook, Icons.Outlined.MenuBook)
    object AdminDashboard : Screen("admin", "Admin", Icons.Filled.AdminPanelSettings, Icons.Outlined.AdminPanelSettings)
    object Notifications : Screen("notifications", "Notifications", Icons.Filled.Notifications, Icons.Outlined.Notifications)
}

val bottomNavItems = listOf(
    Screen.Home,
    Screen.Events,
    Screen.Clubs,
    Screen.Community,
    Screen.Profile
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CampusNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            if (bottomNavItems.any { it.route == currentRoute }) {
                NavigationBar {
                    bottomNavItems.forEach { screen ->
                        val isSelected = currentRoute == screen.route
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (isSelected) screen.selectedIcon else screen.unselectedIcon,
                                    contentDescription = screen.title
                                )
                            },
                            label = { Text(screen.title) },
                            selected = isSelected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToEvents = { navController.navigate(Screen.Events.route) },
                    onNavigateToClubs = { navController.navigate(Screen.Clubs.route) },
                    onNavigateToAnnouncements = { navController.navigate(Screen.Announcements.route) },
                    onNavigateToResources = { navController.navigate(Screen.AcademicResources.route) },
                    onNavigateToNotifications = { navController.navigate(Screen.Notifications.route) },
                    onNavigateToAdmin = { navController.navigate(Screen.AdminDashboard.route) }
                )
            }
            composable(Screen.Events.route) {
                EventsScreen()
            }
            composable(Screen.Clubs.route) {
                ClubsScreen()
            }
            composable(Screen.Community.route) {
                CommunityScreen()
            }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    onNavigateToAdmin = { navController.navigate(Screen.AdminDashboard.route) }
                )
            }
            composable(Screen.Announcements.route) {
                AnnouncementsScreen(onBack = { navController.popBackStack() })
            }
            composable(Screen.AcademicResources.route) {
                AcademicResourcesScreen(onBack = { navController.popBackStack() })
            }
            composable(Screen.AdminDashboard.route) {
                AdminDashboardScreen(onBack = { navController.popBackStack() })
            }
            composable(Screen.Notifications.route) {
                NotificationsScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
