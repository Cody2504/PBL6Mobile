import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors[theme].surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.cardPadding,
      marginBottom: vs(Spacing.md),
      ...Elevation.sm,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: vs(Spacing.sm),
    },

    titleContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginRight: hs(Spacing.sm),
    },

    titleIcon: {
      marginRight: hs(Spacing.xs),
      marginTop: 2,
    },

    icon: {
      color: Colors[theme].primary,
    },

    title: {
      ...Typography.h3,
      color: Colors[theme].text,
      flex: 1,
    },

    // Badges
    badge: {
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.round,
    },

    badge_primary: {
      backgroundColor: Colors[theme].primaryLight,
    },

    badge_success: {
      backgroundColor: Colors[theme].successLight,
    },

    badge_warning: {
      backgroundColor: Colors[theme].warningLight,
    },

    badge_info: {
      backgroundColor: Colors[theme].infoLight,
    },

    badge_disabled: {
      backgroundColor: Colors[theme].backgroundSecondary,
    },

    badgeText: {
      ...Typography.caption,
      fontWeight: '600',
    },

    badgeText_primary: {
      color: Colors[theme].primary,
    },

    badgeText_success: {
      color: Colors[theme].success,
    },

    badgeText_warning: {
      color: Colors[theme].warning,
    },

    badgeText_info: {
      color: Colors[theme].info,
    },

    badgeText_disabled: {
      color: Colors[theme].textTertiary,
    },

    // Description
    description: {
      ...Typography.bodyMedium,
      color: Colors[theme].textSecondary,
      marginBottom: vs(Spacing.md),
    },

    // Metadata
    metadata: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: vs(Spacing.md),
      gap: hs(Spacing.md),
    },

    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    metadataIcon: {
      color: Colors[theme].textTertiary,
      marginRight: hs(4),
    },

    metadataText: {
      ...Typography.bodySmall,
      color: Colors[theme].textSecondary,
    },

    scoreText: {
      ...Typography.bodySmall,
      color: Colors[theme].success,
      fontWeight: '600',
    },

    // Time window
    timeWindow: {
      backgroundColor: Colors[theme].backgroundSecondary,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      marginBottom: vs(Spacing.md),
    },

    timeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(4),
    },

    timeLabel: {
      ...Typography.bodySmall,
      color: Colors[theme].textTertiary,
    },

    timeValue: {
      ...Typography.bodySmall,
      color: Colors[theme].text,
      fontWeight: '500',
    },

    // Footer
    footer: {
      alignItems: 'flex-end',
    },

    // Action button
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.md),
      paddingVertical: vs(Spacing.sm),
      borderRadius: BorderRadius.md,
      gap: hs(Spacing.xs),
    },

    actionButton_primary: {
      backgroundColor: Colors[theme].primary,
    },

    actionButton_success: {
      backgroundColor: Colors[theme].success,
    },

    actionButton_warning: {
      backgroundColor: Colors[theme].warning,
    },

    actionButton_info: {
      backgroundColor: Colors[theme].info,
    },

    actionButton_disabled: {
      backgroundColor: Colors[theme].backgroundTertiary,
    },

    actionButtonIcon_primary: {
      color: '#FFFFFF',
    },

    actionButtonIcon_success: {
      color: '#FFFFFF',
    },

    actionButtonIcon_warning: {
      color: '#FFFFFF',
    },

    actionButtonIcon_info: {
      color: '#FFFFFF',
    },

    actionButtonIcon_disabled: {
      color: Colors[theme].textTertiary,
    },

    actionButtonText: {
      ...Typography.bodyMedium,
      fontWeight: '600',
    },

    actionButtonText_primary: {
      color: '#FFFFFF',
    },

    actionButtonText_success: {
      color: '#FFFFFF',
    },

    actionButtonText_warning: {
      color: '#FFFFFF',
    },

    actionButtonText_info: {
      color: '#FFFFFF',
    },

    actionButtonText_disabled: {
      color: Colors[theme].textTertiary,
    },
  })
