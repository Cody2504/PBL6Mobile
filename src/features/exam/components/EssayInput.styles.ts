import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginTop: vs(Spacing.sm),
    },

    // Label
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: vs(Spacing.sm),
      gap: hs(Spacing.xs),
    },

    labelIcon: {
      color: Colors[theme].textSecondary,
    },

    label: {
      ...Typography.bodyMedium,
      color: Colors[theme].textSecondary,
      fontWeight: '600',
    },

    // Input container
    inputContainer: {
      backgroundColor: Colors[theme].background,
      borderWidth: 2,
      borderColor: Colors[theme].border,
      borderRadius: BorderRadius.md,
      minHeight: vs(150),
    },

    inputContainer_focused: {
      borderColor: Colors[theme].primary,
      backgroundColor: Colors[theme].surface,
    },

    inputContainer_disabled: {
      opacity: 0.5,
      backgroundColor: Colors[theme].backgroundSecondary,
    },

    // Text input
    input: {
      ...Typography.bodyMedium,
      color: Colors[theme].text,
      padding: Spacing.md,
      minHeight: vs(150),
    },

    placeholder: {
      color: Colors[theme].textTertiary,
    },

    // Footer
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: vs(Spacing.xs),
    },

    // Character count
    characterCount: {
      paddingHorizontal: hs(Spacing.xs),
    },

    characterCountText: {
      ...Typography.caption,
      color: Colors[theme].textTertiary,
    },

    characterCountText_limit: {
      color: Colors[theme].error,
      fontWeight: '600',
    },

    // Helper text
    helperContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: hs(4),
    },

    helperIcon: {
      color: Colors[theme].textTertiary,
    },

    helperText: {
      ...Typography.caption,
      color: Colors[theme].textTertiary,
      fontStyle: 'italic',
    },
  })
