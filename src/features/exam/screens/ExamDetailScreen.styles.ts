import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.screenPadding),
      paddingVertical: vs(Spacing.md),
      backgroundColor: Colors[theme].surface,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },

    backButton: {
      marginRight: hs(Spacing.md),
    },

    backIcon: {
      color: Colors[theme].text,
    },

    headerTitle: {
      ...Typography.h2,
      color: Colors[theme].text,
    },

    // Content
    content: {
      flex: 1,
    },

    // Title Section
    titleSection: {
      alignItems: 'center',
      paddingVertical: vs(Spacing.xl),
      paddingHorizontal: hs(Spacing.screenPadding),
      backgroundColor: Colors[theme].surface,
    },

    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors[theme].primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(Spacing.md),
    },

    titleIcon: {
      color: Colors[theme].primary,
    },

    title: {
      ...Typography.displayMedium,
      color: Colors[theme].text,
      textAlign: 'center',
    },

    description: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      lineHeight: 24,
    },

    // Sections
    section: {
      padding: Spacing.screenPadding,
      marginTop: vs(Spacing.md),
      backgroundColor: Colors[theme].surface,
    },

    sectionTitle: {
      ...Typography.h3,
      color: Colors[theme].text,
      marginBottom: vs(Spacing.md),
    },

    // Info Grid
    infoGrid: {
      gap: vs(Spacing.md),
    },

    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors[theme].backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: hs(Spacing.md),
    },

    infoIcon: {
      color: Colors[theme].primary,
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      ...Typography.bodySmall,
      color: Colors[theme].textTertiary,
      marginBottom: vs(2),
    },

    infoValue: {
      ...Typography.bodyLarge,
      color: Colors[theme].text,
      fontWeight: '600',
    },

    // Instructions
    instructionsList: {
      gap: vs(Spacing.md),
    },

    instructionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    instructionBullet: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors[theme].primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: hs(Spacing.md),
      marginTop: vs(2),
    },

    instructionBulletText: {
      ...Typography.bodyMedium,
      color: '#FFFFFF',
      fontWeight: '700',
    },

    instructionText: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      flex: 1,
      lineHeight: 22,
    },

    // Score Section
    scoreSection: {
      alignItems: 'center',
    },

    scoreContainer: {
      alignItems: 'center',
      paddingVertical: vs(Spacing.xl),
    },

    starIcon: {
      color: Colors[theme].warning,
      marginBottom: vs(Spacing.md),
    },

    scoreText: {
      ...Typography.displayLarge,
      color: Colors[theme].success,
      fontWeight: '700',
    },

    scoreLabel: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
    },

    // Footer
    footer: {
      padding: Spacing.screenPadding,
      backgroundColor: Colors[theme].surface,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].border,
      ...Elevation.md,
    },

    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors[theme].primary,
      paddingVertical: vs(Spacing.lg),
      borderRadius: BorderRadius.md,
      gap: hs(Spacing.sm),
    },

    startButtonDisabled: {
      backgroundColor: Colors[theme].backgroundTertiary,
    },

    startButtonText: {
      ...Typography.h3,
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // Loading State
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.screenPadding),
    },

    loader: {
      color: Colors[theme].primary,
    },

    loadingText: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      marginTop: vs(Spacing.md),
    },

    // Error State
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.screenPadding),
    },

    errorIcon: {
      color: Colors[theme].error,
      marginBottom: vs(Spacing.lg),
    },

    errorTitle: {
      ...Typography.h2,
      color: Colors[theme].text,
      marginBottom: vs(Spacing.sm),
      textAlign: 'center',
    },

    errorMessage: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      marginBottom: vs(Spacing.xl),
      textAlign: 'center',
    },

    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.xl),
      paddingVertical: vs(Spacing.md),
      backgroundColor: Colors[theme].primary,
      borderRadius: BorderRadius.md,
      gap: hs(Spacing.sm),
    },

    retryButtonText: {
      ...Typography.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  })
