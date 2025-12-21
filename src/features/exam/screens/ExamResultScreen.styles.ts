import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },

    content: {
      flex: 1,
      padding: Spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Success icon
    iconContainer: {
      marginBottom: vs(Spacing.xl),
    },

    successIcon: {
      color: Colors[theme].success,
    },

    // Title
    title: {
      ...Typography.h1,
      color: Colors[theme].text,
      textAlign: 'center',
      marginBottom: vs(Spacing.md),
    },

    // Message
    message: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: vs(Spacing.xl),
    },

    // Info card
    infoCard: {
      backgroundColor: Colors[theme].surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      width: '100%',
      marginBottom: vs(Spacing.xl),
      ...Elevation.sm,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: vs(Spacing.sm),
      gap: hs(Spacing.sm),
    },

    infoIcon: {
      color: Colors[theme].primary,
    },

    infoLabel: {
      ...Typography.bodyMedium,
      color: Colors[theme].textSecondary,
    },

    infoValue: {
      ...Typography.bodyMedium,
      color: Colors[theme].text,
      fontWeight: '600',
      flex: 1,
      textAlign: 'right',
    },

    // Actions
    actions: {
      width: '100%',
    },

    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: vs(Spacing.md),
      borderRadius: BorderRadius.md,
      minHeight: MIN_TOUCH_SIZE,
      gap: hs(Spacing.sm),
    },

    button_primary: {
      backgroundColor: Colors[theme].primary,
    },

    buttonText: {
      ...Typography.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '700',
    },
  })
