import { StyleSheet, Platform } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'
import {
    Colors,
    Spacing,
    Elevation,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors[theme].backgroundSecondary,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBar: {
        backgroundColor: Colors[theme].surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
        ...Platform.select({
            android: { elevation: 2 },
        }),
    },
    fab: {
        position: 'absolute',
        right: hs(Spacing.lg),
        bottom: vs(Spacing.lg),
        width: hs(56),
        height: hs(56),
        borderRadius: hs(28),
        backgroundColor: Colors[theme].buttonPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: Colors[theme].shadowColor,
                shadowOffset: { width: 0, height: vs(3) },
                shadowOpacity: 0.3,
                shadowRadius: hs(4),
            },
            android: {
                elevation: 6,
            },
        }),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
    },
})
