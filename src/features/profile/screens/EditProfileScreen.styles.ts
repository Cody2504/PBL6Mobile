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
        justifyContent: 'space-between',
        paddingHorizontal: hs(15),
        paddingVertical: vs(10),
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
    },
    backButton: {
        padding: hs(5),
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
    },
    headerSpacer: {
        width: hs(24),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: vs(10),
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].textSecondary,
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    content: {
        padding: hs(Spacing.xl),
    },
    inputContainer: {
        marginBottom: vs(Spacing.xl),
        backgroundColor: Colors[theme].inputBackground,
        borderRadius: hs(BorderRadius.md),
        paddingHorizontal: hs(15),
        paddingVertical: vs(5),
        borderWidth: 1,
        borderColor: Colors[theme].warning,
    },
    dropdownContainer: {
        paddingBottom: vs(5),
    },
    inputLabel: {
        fontSize: getFontSize(Typography.caption.fontSize),
        color: Colors[theme].textSecondary,
        marginBottom: vs(2),
        lineHeight: getFontSize(Typography.caption.lineHeight),
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].inputText,
        paddingVertical: 0,
        minHeight: MIN_TOUCH_SIZE - vs(10),
    },
    countryFlag: {
        fontSize: getFontSize(20),
        marginRight: hs(10),
    },
    dropdownIcon: {
        marginLeft: hs(5),
        opacity: 0.6,
    },
    inlineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(Spacing.xl),
    },
    inlineItem: {
        flex: 1,
        marginRight: hs(10),
    },
    submitButton: {
        backgroundColor: Colors[theme].warning,
        borderRadius: hs(BorderRadius.md),
        paddingVertical: vs(15),
        marginTop: vs(30),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: Colors[theme].warning,
        shadowOffset: { width: 0, height: vs(2) },
        shadowOpacity: 0.4,
        shadowRadius: hs(3),
        minHeight: MIN_TOUCH_SIZE,
    },
    submitButtonDisabled: {
        backgroundColor: Colors[theme].buttonPrimaryDisabled,
    },
    submitButtonText: {
        color: Colors[theme].textInverse,
        fontSize: getFontSize(Typography.h3.fontSize),
        fontWeight: Typography.h3.fontWeight,
        lineHeight: getFontSize(Typography.h3.lineHeight),
    },
})
