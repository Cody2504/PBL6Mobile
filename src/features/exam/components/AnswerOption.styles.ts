import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '@/libs/constants/theme'
import { hs, vs, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    option: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: Colors[theme].background,
      borderWidth: 2,
      borderColor: Colors[theme].border,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: vs(Spacing.sm),
      minHeight: MIN_TOUCH_SIZE,
    },

    option_selected: {
      backgroundColor: Colors[theme].primaryLight,
      borderColor: Colors[theme].primary,
    },

    option_disabled: {
      opacity: 0.5,
    },

    // Icon container
    iconContainer: {
      marginRight: hs(Spacing.sm),
      paddingTop: 2,
    },

    icon: {
      color: Colors[theme].textTertiary,
    },

    icon_selected: {
      color: Colors[theme].primary,
    },

    icon_disabled: {
      color: Colors[theme].textTertiary,
    },

    // Content
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    optionIdContainer: {
      marginRight: hs(Spacing.xs),
    },

    optionId: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      fontWeight: '700',
    },

    optionId_selected: {
      color: Colors[theme].primary,
    },

    optionId_disabled: {
      color: Colors[theme].textTertiary,
    },

    optionText: {
      ...Typography.bodyMedium,
      color: Colors[theme].text,
      flex: 1,
      lineHeight: 22,
    },

    optionText_selected: {
      color: Colors[theme].text,
      fontWeight: '500',
    },

    optionText_disabled: {
      color: Colors[theme].textSecondary,
    },
  })
