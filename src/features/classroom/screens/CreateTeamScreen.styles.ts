import { StyleSheet } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'
import {
    Colors,
    Typography,
    Spacing,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors[theme].backgroundSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(Spacing.lg),
        paddingVertical: vs(Spacing.md),
        backgroundColor: Colors[theme].surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors[theme].border,
    },
    backButton: {
        padding: hs(Spacing.sm),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: getFontSize(Typography.h3.fontSize),
        fontWeight: Typography.h3.fontWeight,
        color: Colors[theme].text,
        lineHeight: getFontSize(Typography.h3.lineHeight),
        letterSpacing: Typography.h3.letterSpacing,
    },
    doneButton: {
        padding: hs(Spacing.sm),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    doneText: {
        fontSize: getFontSize(Typography.labelLarge.fontSize),
        color: Colors[theme].primary,
        fontWeight: Typography.labelLarge.fontWeight,
        lineHeight: getFontSize(Typography.labelLarge.lineHeight),
        letterSpacing: Typography.labelLarge.letterSpacing,
    },
    content: {
        flex: 1,
        padding: hs(Spacing.lg),
    },
    inputSection: {
        marginBottom: vs(Spacing.sectionGap),
    },
    label: {
        fontSize: getFontSize(Typography.h4.fontSize),
        fontWeight: Typography.h4.fontWeight,
        color: Colors[theme].text,
        marginBottom: vs(Spacing.sm),
        lineHeight: getFontSize(Typography.h4.lineHeight),
        letterSpacing: Typography.h4.letterSpacing,
    },
    textInput: {
        borderBottomWidth: 2,
        borderBottomColor: Colors[theme].border,
        paddingVertical: vs(Spacing.md),
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].inputText,
        minHeight: MIN_TOUCH_SIZE,
    },
    descriptionInput: {
        minHeight: vs(60),
    },
    infoSection: {
        marginTop: vs(Spacing.xxxl),
    },
    infoText: {
        fontSize: getFontSize(Typography.bodyMedium.fontSize),
        color: Colors[theme].textSecondary,
        lineHeight: getFontSize(Typography.bodyMedium.lineHeight),
        marginBottom: vs(Spacing.md),
    },
    codeInfo: {
        fontSize: getFontSize(Typography.bodyMedium.fontSize),
        color: Colors[theme].primary,
        lineHeight: getFontSize(Typography.bodyMedium.lineHeight),
        fontStyle: 'italic',
    },
})
