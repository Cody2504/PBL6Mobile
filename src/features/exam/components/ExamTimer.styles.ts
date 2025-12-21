import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.md),
      paddingVertical: vs(Spacing.sm),
      borderRadius: BorderRadius.md,
      gap: hs(Spacing.xs),
    },

    container_normal: {
      // No background
    },

    container_warning: {
      // No background
    },

    container_critical: {
      // No background
    },

    // Icons
    icon_normal: {
      color: Colors[theme].primary,
    },

    icon_warning: {
      color: Colors[theme].warning,
    },

    icon_critical: {
      color: Colors[theme].error,
    },

    // Time text
    time: {
      ...Typography.h3,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },

    time_normal: {
      color: Colors[theme].primary,
    },

    time_warning: {
      color: Colors[theme].warning,
    },

    time_critical: {
      color: Colors[theme].error,
    },
  })
