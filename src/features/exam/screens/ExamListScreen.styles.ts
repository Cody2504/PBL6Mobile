import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '@/libs/constants/theme'
import { hs, vs } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },

    // Header
    header: {
      paddingHorizontal: hs(Spacing.screenPadding),
      paddingVertical: vs(Spacing.lg),
      backgroundColor: Colors[theme].surface,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },

    headerTitle: {
      ...Typography.h1,
      color: Colors[theme].text,
    },

    // Filters
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: hs(Spacing.screenPadding),
      paddingVertical: vs(Spacing.md),
      backgroundColor: Colors[theme].surface,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
      gap: hs(Spacing.sm),
    },

    filterTab: {
      paddingHorizontal: hs(Spacing.md),
      paddingVertical: vs(Spacing.sm),
      borderRadius: BorderRadius.round,
      backgroundColor: Colors[theme].backgroundSecondary,
    },

    filterTabActive: {
      backgroundColor: Colors[theme].primary,
    },

    filterTabText: {
      ...Typography.bodySmall,
      color: Colors[theme].textSecondary,
      fontWeight: '500',
    },

    filterTabTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // List
    listContent: {
      padding: Spacing.screenPadding,
    },

    listContentEmpty: {
      flexGrow: 1,
    },

    // Loading state
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

    // Error state
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

    // Empty state
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.screenPadding),
      paddingVertical: vs(Spacing.xxxl),
    },

    emptyIcon: {
      color: Colors[theme].textTertiary,
      marginBottom: vs(Spacing.xl),
    },

    emptyTitle: {
      ...Typography.h2,
      color: Colors[theme].text,
      marginBottom: vs(Spacing.sm),
      textAlign: 'center',
    },

    emptyMessage: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      textAlign: 'center',
    },
  })
