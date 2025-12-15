/**
 * MSTeam Color Schema
 *
 * A comprehensive color system for the MSTeam application supporting both light and dark modes.
 * Colors are organized by purpose: brand colors, neutral grays, semantic colors, and UI elements.
 *
 * Usage: Import Colors and use with the useThemeColor hook for automatic theme switching.
 */

import { Platform } from 'react-native'

/**
 * Brand Colors - Primary purple-blue palette (muted, professional)
 * Based on calendar's preferred aesthetic: #6264a7
 */
const BrandColors = {
  primary: {
    50: '#F0F0FF',   // Very light purple-blue
    100: '#E0E1F5',  // Light purple-blue
    200: '#C5C6E8',  // Lighter purple-blue
    300: '#9FA0D9',  // Medium light purple-blue
    400: '#7E80C3',  // Medium purple-blue
    500: '#6264A7',  // Primary purple-blue - main brand color (calendar)
    600: '#5254A7',  // Darker purple-blue
    700: '#474996',  // Deep purple-blue
    800: '#3C3D7E',  // Very deep purple-blue
    900: '#2E2F5E',  // Darkest purple-blue
  },
}

/**
 * Neutral Grays - For text, backgrounds, borders, and subtle UI elements
 */
const NeutralColors = {
  gray: {
    50: '#F9FAFB',   // Almost white
    100: '#F3F4F6',  // Very light gray
    200: '#E5E7EB',  // Light gray
    300: '#D1D5DB',  // Medium light gray
    400: '#9CA3AF',  // Medium gray
    500: '#6B7280',  // Gray
    600: '#4B5563',  // Dark gray
    700: '#374151',  // Darker gray
    800: '#1F2937',  // Very dark gray
    900: '#111827',  // Almost black
  },
}

/**
 * Semantic Colors - For status indicators and feedback
 */
const SemanticColors = {
  success: {
    light: '#10B981',  // Green
    dark: '#34D399',
  },
  warning: {
    light: '#F59E0B',  // Amber
    dark: '#FBBF24',
  },
  error: {
    light: '#EF4444',  // Red
    dark: '#F87171',
  },
  info: {
    light: '#3B82F6',  // Blue
    dark: '#60A5FA',
  },
}

/**
 * Main Color Theme - Light Mode
 * Updated to match calendar's muted, professional aesthetic
 */
const lightColors = {
  // Primary brand color - calendar's muted purple-blue
  primary: BrandColors.primary[500],        // #6264a7 - calendar's primary
  primaryLight: BrandColors.primary[400],
  primaryDark: BrandColors.primary[600],
  primaryPressed: BrandColors.primary[700],
  primaryDisabled: BrandColors.primary[200],

  // Background colors - calendar's soft warm gray
  background: '#F8F9FA',                     // Calendar's preferred background
  backgroundSecondary: '#F0F0F0',            // Very subtle gray
  backgroundTertiary: '#E8E9EB',             // Slightly darker
  backgroundElevated: '#FFFFFF',             // White for elevated surfaces

  // Surface colors (for cards, modals, etc.)
  surface: '#FFFFFF',                        // Pure white for cards
  surfaceSecondary: '#F8F9FA',              // Calendar's pressed state
  surfaceHover: '#F0F0F0',                  // Subtle hover

  // Text colors - calendar's text hierarchy
  text: '#000000',                           // Pure black like calendar
  textSecondary: '#666666',                  // Calendar's time/secondary text
  textTertiary: '#999999',                   // Calendar's disabled/type text
  textDisabled: '#CCCCCC',                   // Lighter disabled
  textInverse: '#FFFFFF',
  textPlaceholder: '#999999',                // Match tertiary

  // Border colors - calendar's very subtle borders
  border: '#F0F0F0',                         // Calendar's preferred border
  borderSecondary: '#E0E0E0',                // Slightly more visible
  borderFocus: BrandColors.primary[500],     // Match primary

  // Icon colors
  icon: '#666666',                           // Match textSecondary
  iconSecondary: '#999999',                  // Match textTertiary
  iconActive: BrandColors.primary[500],      // Match primary

  // Input colors
  inputBackground: '#F8F9FA',                // Match background
  inputBorder: '#E0E0E0',                    // Subtle border
  inputText: '#000000',                      // Black text
  inputPlaceholder: '#999999',               // Gray placeholder

  // Button colors - calendar's purple-blue
  buttonPrimary: BrandColors.primary[500],   // #6264a7
  buttonPrimaryHover: BrandColors.primary[600],
  buttonPrimaryPressed: BrandColors.primary[700],
  buttonPrimaryDisabled: '#CCCCCC',
  buttonPrimaryText: '#FFFFFF',

  buttonSecondary: '#FFFFFF',
  buttonSecondaryHover: '#F8F9FA',
  buttonSecondaryBorder: '#E0E0E0',
  buttonSecondaryText: '#000000',

  // Tab colors
  tabIconDefault: '#999999',
  tabIconSelected: BrandColors.primary[500],
  tabBackground: '#F8F9FA',
  tabBorder: '#F0F0F0',

  // Semantic colors - muted versions
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: BrandColors.primary[500],

  // Overlay & Shadow - very subtle like calendar
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowColor: '#000000',

  // Link
  link: BrandColors.primary[500],
  linkHover: BrandColors.primary[600],

  // Divider
  divider: '#F0F0F0',                        // Match border

  // Badge
  badgeBackground: BrandColors.primary[100],
  badgeText: BrandColors.primary[700],

  // Legacy support (for backward compatibility)
  tint: BrandColors.primary[500],
}

/**
 * Main Color Theme - Dark Mode
 * Complementing the calendar's muted aesthetic
 */
const darkColors = {
  // Primary brand color - lighter shade for dark mode
  primary: BrandColors.primary[400],         // Lighter purple-blue for visibility
  primaryLight: BrandColors.primary[300],
  primaryDark: BrandColors.primary[500],
  primaryPressed: BrandColors.primary[600],
  primaryDisabled: BrandColors.primary[800],

  // Background colors
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  backgroundElevated: '#1E293B',

  // Surface colors (for cards, modals, etc.)
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  surfaceHover: '#475569',

  // Text colors
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textDisabled: '#64748B',
  textInverse: '#0F172A',
  textPlaceholder: '#64748B',

  // Border colors
  border: '#334155',
  borderSecondary: '#475569',
  borderFocus: BrandColors.primary[400],

  // Icon colors
  icon: '#94A3B8',
  iconSecondary: '#64748B',
  iconActive: BrandColors.primary[400],

  // Input colors
  inputBackground: '#1E293B',
  inputBorder: '#334155',
  inputText: '#F1F5F9',
  inputPlaceholder: '#64748B',

  // Button colors
  buttonPrimary: BrandColors.primary[500],
  buttonPrimaryHover: BrandColors.primary[600],
  buttonPrimaryPressed: BrandColors.primary[700],
  buttonPrimaryDisabled: '#334155',
  buttonPrimaryText: '#FFFFFF',

  buttonSecondary: '#334155',
  buttonSecondaryHover: '#475569',
  buttonSecondaryBorder: '#475569',
  buttonSecondaryText: '#F1F5F9',

  // Tab colors
  tabIconDefault: '#94A3B8',
  tabIconSelected: BrandColors.primary[400],
  tabBackground: '#1E293B',
  tabBorder: '#334155',

  // Semantic colors
  success: SemanticColors.success.dark,
  warning: SemanticColors.warning.dark,
  error: SemanticColors.error.dark,
  info: SemanticColors.info.dark,

  // Overlay & Shadow
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadowColor: '#000000',

  // Link
  link: BrandColors.primary[400],
  linkHover: BrandColors.primary[300],

  // Divider
  divider: '#334155',

  // Badge
  badgeBackground: BrandColors.primary[900],
  badgeText: BrandColors.primary[300],

  // Legacy support (for backward compatibility)
  tint: BrandColors.primary[400],
}

/**
 * Export the main Colors object with light and dark themes
 */
export const Colors = {
  light: lightColors,
  dark: darkColors,
}

/**
 * Direct color palette exports for specific use cases
 */
export const Palette = {
  brand: BrandColors.primary,
  gray: NeutralColors.gray,
  semantic: SemanticColors,
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})

/**
 * Typography System - Standardized text styles for professional hierarchy
 *
 * Usage: Always use with getFontSize() for responsive scaling
 * Example: fontSize: getFontSize(Typography.h1.fontSize)
 */
export const Typography = {
  // Display - Large headings (page titles)
  displayLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  // Headings - Section titles
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Body - Main content text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Labels - Form labels, UI labels
  labelLarge: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },

  // Caption - Supplementary text
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  captionSmall: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 14,
    letterSpacing: 0.3,
  },

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
}

/**
 * Spacing System - Standardized spacing scale for consistent layouts
 *
 * Usage: Always use with hs() or vs() for responsive scaling
 * Example: paddingHorizontal: hs(Spacing.lg)
 */
export const Spacing = {
  xs: 4,      // Extra small - tight spacing
  sm: 8,      // Small - compact elements
  md: 12,     // Medium - default spacing
  lg: 16,     // Large - comfortable spacing
  xl: 20,     // Extra large - section spacing
  xxl: 24,    // 2X large - major sections
  xxxl: 32,   // 3X large - page-level spacing

  // Semantic spacing
  cardPadding: 16,
  screenPadding: 16,
  sectionGap: 24,
  itemGap: 12,
}

/**
 * Border Radius System - Standardized corner rounding
 *
 * Usage: Always use with hs() for responsive scaling
 * Example: borderRadius: hs(BorderRadius.md)
 */
export const BorderRadius = {
  none: 0,
  sm: 4,      // Small elements (checkboxes)
  md: 8,      // Buttons, inputs, cards
  lg: 12,     // Large cards
  xl: 16,     // Modals, major surfaces
  round: 999, // Pills, badges, fully rounded
}

/**
 * Elevation System - Standardized shadows and elevations
 *
 * Usage: Spread into styles object
 * Example: ...Elevation.md
 */
export const Elevation = {
  none: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 16,
    },
  }),
}
