import { StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '@/libs/constants/theme'
import { hs, vs, wp } from '@/libs/utils/responsive'

export const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modal: {
      backgroundColor: Colors[theme].surface,
      borderRadius: BorderRadius.xl,
      width: wp(85),
      maxWidth: 400,
      ...Elevation.xl,
    },

    // Header
    header: {
      alignItems: 'center',
      paddingHorizontal: hs(Spacing.xl),
      paddingTop: vs(Spacing.xl),
      paddingBottom: vs(Spacing.lg),
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },

    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors[theme].primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(Spacing.md),
    },

    icon: {
      color: Colors[theme].primary,
    },

    title: {
      ...Typography.h2,
      color: Colors[theme].text,
      marginBottom: vs(Spacing.xs),
      textAlign: 'center',
    },

    examTitle: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      textAlign: 'center',
    },

    // Content
    content: {
      paddingHorizontal: hs(Spacing.xl),
      paddingVertical: vs(Spacing.xl),
    },

    label: {
      ...Typography.bodyMedium,
      color: Colors[theme].textSecondary,
      marginBottom: vs(Spacing.sm),
    },

    inputContainer: {
      position: 'relative',
    },

    input: {
      ...Typography.bodyLarge,
      backgroundColor: Colors[theme].inputBackground,
      borderWidth: 1,
      borderColor: Colors[theme].inputBorder,
      borderRadius: BorderRadius.md,
      paddingHorizontal: hs(Spacing.md),
      paddingVertical: vs(Spacing.md),
      paddingRight: hs(48), // Space for eye icon
      color: Colors[theme].text,
    },

    inputError: {
      borderColor: Colors[theme].error,
    },

    placeholder: {
      color: Colors[theme].textTertiary,
    },

    eyeButton: {
      position: 'absolute',
      right: hs(Spacing.md),
      top: '50%',
      transform: [{ translateY: -12 }],
    },

    eyeIcon: {
      color: Colors[theme].textTertiary,
    },

    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: vs(Spacing.sm),
      gap: hs(Spacing.xs),
    },

    errorIcon: {
      color: Colors[theme].error,
    },

    errorText: {
      ...Typography.bodySmall,
      color: Colors[theme].error,
      flex: 1,
    },

    // Footer
    footer: {
      flexDirection: 'row',
      paddingHorizontal: hs(Spacing.xl),
      paddingBottom: vs(Spacing.xl),
      gap: hs(Spacing.md),
    },

    cancelButton: {
      flex: 1,
      paddingVertical: vs(Spacing.md),
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelButtonText: {
      ...Typography.bodyLarge,
      color: Colors[theme].textSecondary,
      fontWeight: '600',
    },

    submitButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: vs(Spacing.md),
      borderRadius: BorderRadius.md,
      backgroundColor: Colors[theme].primary,
      gap: hs(Spacing.xs),
    },

    submitButtonDisabled: {
      opacity: 0.6,
    },

    submitButtonText: {
      ...Typography.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  })
