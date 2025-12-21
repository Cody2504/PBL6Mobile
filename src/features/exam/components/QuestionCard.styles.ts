import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors[theme].surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.cardPadding,
      ...Elevation.md,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: vs(Spacing.md),
      paddingBottom: vs(Spacing.sm),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 1,
      gap: hs(Spacing.xs),
    },

    questionNumber: {
      backgroundColor: Colors[theme].primary,
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.md,
    },

    questionNumberText: {
      ...Typography.bodySmall,
      color: '#FFFFFF',
      fontWeight: '700',
    },

    // Type badge
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.md,
      gap: hs(4),
    },

    typeBadge_info: {
      backgroundColor: Colors[theme].infoLight,
    },

    typeBadgeIcon: {
      color: Colors[theme].info,
    },

    typeBadgeText: {
      ...Typography.caption,
      color: Colors[theme].info,
      fontWeight: '600',
    },

    // Points badge
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[theme].warningLight,
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.md,
      gap: hs(4),
    },

    pointsIcon: {
      color: Colors[theme].warning,
    },

    pointsText: {
      ...Typography.bodySmall,
      color: Colors[theme].warning,
      fontWeight: '700',
    },

    // Content
    contentContainer: {
      marginBottom: vs(Spacing.md),
    },

    questionContent: {
      ...Typography.bodyLarge,
      color: Colors[theme].text,
      lineHeight: 24,
    },

    // Metadata
    metadata: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: hs(Spacing.sm),
      marginBottom: vs(Spacing.md),
    },

    // Difficulty badge
    difficultyBadge: {
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.sm,
    },

    difficultyBadge_success: {
      backgroundColor: Colors[theme].successLight,
    },

    difficultyBadge_warning: {
      backgroundColor: Colors[theme].warningLight,
    },

    difficultyBadge_error: {
      backgroundColor: Colors[theme].errorLight,
    },

    difficultyText: {
      ...Typography.caption,
      fontWeight: '600',
    },

    difficultyText_success: {
      color: Colors[theme].success,
    },

    difficultyText_warning: {
      color: Colors[theme].warning,
    },

    difficultyText_error: {
      color: Colors[theme].error,
    },

    // Category badge
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[theme].backgroundSecondary,
      paddingHorizontal: hs(Spacing.sm),
      paddingVertical: vs(4),
      borderRadius: BorderRadius.sm,
      gap: hs(4),
    },

    categoryIcon: {
      color: Colors[theme].textTertiary,
    },

    categoryText: {
      ...Typography.caption,
      color: Colors[theme].textSecondary,
    },

    // Answer section
    answerSection: {
      marginTop: vs(Spacing.sm),
    },
  })
