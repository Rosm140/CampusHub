package com.campushub1.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// CampusHUB1 Color Palette
val IndigoPrimary = Color(0xFF4F46E5)
val IndigoPrimaryDark = Color(0xFF3730A3)
val VioletSecondary = Color(0xFF7C3AED)
val CyanAccent = Color(0xFF06B6D4)
val BackgroundLight = Color(0xFFF8FAFC)
val SurfaceLight = Color(0xFFFFFFFF)
val TextPrimaryLight = Color(0xFF0F172A)
val TextSecondaryLight = Color(0xFF64748B)

val BackgroundDark = Color(0xFF0F172A)
val SurfaceDark = Color(0xFF1E293B)
val TextPrimaryDark = Color(0xFFF8FAFC)
val TextSecondaryDark = Color(0xFF94A3B8)

val SuccessGreen = Color(0xFF16A34A)
val WarningAmber = Color(0xFFF59E0B)
val ErrorRed = Color(0xFFDC2626)

private val LightColorScheme = lightColorScheme(
    primary = IndigoPrimary,
    onPrimary = Color.White,
    secondary = VioletSecondary,
    onSecondary = Color.White,
    tertiary = CyanAccent,
    background = BackgroundLight,
    surface = SurfaceLight,
    onBackground = TextPrimaryLight,
    onSurface = TextPrimaryLight,
    error = ErrorRed,
    onError = Color.White
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF818CF8),
    onPrimary = Color(0xFF1E1B4B),
    secondary = Color(0xFFA78BFA),
    onSecondary = Color(0xFF2E1065),
    tertiary = Color(0xFF22D3EE),
    background = BackgroundDark,
    surface = SurfaceDark,
    onBackground = TextPrimaryDark,
    onSurface = TextPrimaryDark,
    error = Color(0xFFF87171),
    onError = Color(0xFF450A0A)
)

@Composable
fun CampusHUB1Theme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
