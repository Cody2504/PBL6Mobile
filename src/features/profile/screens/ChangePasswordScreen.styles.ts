import { StyleSheet, Platform, StatusBar } from 'react-native'
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
    BorderRadius,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors[theme].surface,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: hs(10),
        paddingVertical: vs(10),
    },
    backButton: {
        padding: hs(5),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: hs(Spacing.xl),
        paddingTop: vs(10),
    },
    title: {
        fontSize: getFontSize(Typography.h1.fontSize),
        fontWeight: Typography.h1.fontWeight,
        color: Colors[theme].text,
        marginBottom: vs(10),
        lineHeight: getFontSize(Typography.h1.lineHeight),
    },
    instructions: {
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].text,
        marginBottom: vs(30),
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    input: {
        borderWidth: 1,
        borderColor: Colors[theme].inputBorder,
        borderRadius: hs(BorderRadius.sm),
        paddingHorizontal: hs(15),
        paddingVertical: vs(Spacing.md),
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        marginBottom: vs(15),
        backgroundColor: Colors[theme].inputBackground,
        minHeight: MIN_TOUCH_SIZE,
        color: Colors[theme].inputText,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-start',
        marginBottom: vs(Spacing.xl),
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'center',
    },
    forgotPasswordText: {
        fontSize: getFontSize(15),
        color: Colors[theme].info,
        fontWeight: Typography.h4.fontWeight,
        lineHeight: getFontSize(20),
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(30),
    },
    checkbox: {
        marginRight: hs(10),
        paddingTop: vs(2),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        flex: 1,
        fontSize: getFontSize(15),
        color: Colors[theme].text,
        lineHeight: getFontSize(22),
    },
    submitButton: {
        borderRadius: hs(BorderRadius.sm),
        paddingVertical: vs(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors[theme].buttonSecondary,
        minHeight: MIN_TOUCH_SIZE,
    },
    facebookBlue: {
        backgroundColor: Colors[theme].info,
    },
    submitButtonDisabled: {
        backgroundColor: Colors[theme].buttonPrimaryDisabled,
    },
    submitButtonText: {
        color: Colors[theme].buttonPrimaryText,
        fontSize: getFontSize(Typography.h3.fontSize),
        fontWeight: Typography.h3.fontWeight,
        lineHeight: getFontSize(Typography.h3.lineHeight),
    },
})
