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
    BorderRadius,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors[theme].backgroundSecondary,
    },
    headerBar: {
        backgroundColor: Colors[theme].surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
        elevation: 2,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: hs(Spacing.lg),
        paddingVertical: vs(Spacing.sm),
        justifyContent: 'space-between',
    },
    backButtonContainer: {
        padding: hs(Spacing.xs),
        width: hs(40),
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupNameContainer: {
        flex: 1,
        alignItems: 'center',
    },
    groupName: {
        fontSize: getFontSize(Typography.h3.fontSize),
        fontWeight: Typography.h3.fontWeight,
        color: Colors[theme].text,
        lineHeight: getFontSize(Typography.h3.lineHeight),
    },
    headerRight: {
        flexDirection: 'row',
    },
    headerIcon: {
        padding: hs(Spacing.xs),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors[theme].surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: vs(Spacing.md),
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'center',
    },
    tabText: {
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].textSecondary,
        fontWeight: Typography.labelMedium.fontWeight,
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    activeTabContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: vs(Spacing.md),
        position: 'relative',
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'center',
    },
    activeTabText: {
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].primary,
        fontWeight: Typography.h4.fontWeight,
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: vs(3),
        width: '100%',
        backgroundColor: Colors[theme].primary,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: hs(Spacing.lg),
    },
    section: {
        marginBottom: vs(Spacing.xxl),
    },
    sectionTitle: {
        fontSize: getFontSize(Typography.bodyMedium.fontSize),
        fontWeight: Typography.h4.fontWeight,
        color: Colors[theme].textSecondary,
        marginBottom: vs(Spacing.md),
        textTransform: 'uppercase',
        lineHeight: getFontSize(Typography.bodyMedium.lineHeight),
    },
    appItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors[theme].surface,
        padding: hs(Spacing.lg),
        borderRadius: hs(BorderRadius.md),
        marginBottom: vs(Spacing.sm),
        elevation: 1,
        shadowColor: Colors[theme].shadowColor,
        shadowOffset: { width: 0, height: vs(1) },
        shadowOpacity: 0.1,
        shadowRadius: hs(2),
        minHeight: MIN_TOUCH_SIZE,
    },
    appIconContainer: {
        width: hs(48),
        height: hs(48),
        borderRadius: hs(BorderRadius.md),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hs(Spacing.lg),
    },
    appName: {
        flex: 1,
        fontSize: getFontSize(Typography.h4.fontSize),
        fontWeight: Typography.labelMedium.fontWeight,
        color: Colors[theme].text,
        lineHeight: getFontSize(Typography.h4.lineHeight),
    },
    appMoreButton: {
        padding: hs(Spacing.xs),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
