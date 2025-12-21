import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },

    // Loading state
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: vs(Spacing.md),
    },

    loadingIndicator: {
      color: Colors[theme].primary,
    },

    loadingText: {
      ...Typography.bodyMedium,
      color: Colors[theme].textSecondary,
    },

    // Error state
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: vs(Spacing.md),
      padding: Spacing.lg,
    },

    errorIcon: {
      color: Colors[theme].error,
    },

    errorText: {
      ...Typography.h3,
      color: Colors[theme].textSecondary,
      textAlign: 'center',
    },

    // Header
    header: {
      backgroundColor: Colors[theme].surface,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
      ...Elevation.sm,
    },

    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: hs(Spacing.sm),
    },

    headerTitle: {
      ...Typography.h2,
      color: Colors[theme].text,
    },

    savingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: hs(Spacing.xs),
    },

    savingIndicatorColor: {
      color: Colors[theme].primary,
    },

    savingText: {
      ...Typography.caption,
      color: Colors[theme].textSecondary,
    },

    // Scroll content
    scrollView: {
      flex: 1,
    },

    scrollContent: {
      padding: Spacing.lg,
    },

    // Options container
    optionsContainer: {
      marginTop: vs(Spacing.sm),
    },

    // Footer
    footer: {
      backgroundColor: Colors[theme].surface,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].border,
      ...Elevation.md,
    },

    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(Spacing.md),
      gap: hs(Spacing.sm),
    },

    navButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: hs(Spacing.md),
      paddingVertical: vs(Spacing.sm),
      borderRadius: BorderRadius.md,
      minHeight: MIN_TOUCH_SIZE,
      gap: hs(Spacing.xs),
    },

    navButton_secondary: {
      backgroundColor: Colors[theme].backgroundSecondary,
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },

    navButton_disabled: {
      opacity: 0.5,
    },

    navButtonIcon: {
      color: Colors[theme].text,
    },

    navButtonIcon_disabled: {
      color: Colors[theme].textTertiary,
    },

    navButtonText: {
      ...Typography.bodyMedium,
      fontWeight: '600',
    },

    navButtonText_secondary: {
      color: Colors[theme].text,
    },

    navButtonText_disabled: {
      color: Colors[theme].textTertiary,
    },

    // Submit button
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: vs(Spacing.md),
      borderRadius: BorderRadius.md,
      minHeight: MIN_TOUCH_SIZE,
      gap: hs(Spacing.sm),
    },

    submitButton_primary: {
      backgroundColor: Colors[theme].primary,
    },

    submitButtonText: {
      ...Typography.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '700',
    },
  })
