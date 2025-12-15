import { StyleSheet } from 'react-native'
import {
    wp,
    hp,
    hs,
    vs,
    getSafePadding,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'
import {
    Colors,
    Typography,
    Spacing,
    BorderRadius,
    Palette,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors[theme].surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(Spacing.lg),
        paddingVertical: vs(Spacing.md),
        backgroundColor: Colors[theme].surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
    },
    backButton: {
        padding: hs(Spacing.sm),
        marginRight: hs(Spacing.xs),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    botHeaderAvatar: {
        width: hs(44),
        height: hs(44),
        borderRadius: hs(22),
        backgroundColor: Palette.brand[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hs(Spacing.md),
    },
    headerTitle: {
        fontSize: getFontSize(Typography.h3.fontSize),
        fontWeight: Typography.h3.fontWeight,
        color: Colors[theme].text,
        lineHeight: getFontSize(Typography.h3.lineHeight),
    },
    headerSubtitle: {
        fontSize: getFontSize(Typography.bodySmall.fontSize),
        color: Colors[theme].textSecondary,
        marginTop: vs(2),
        lineHeight: getFontSize(Typography.bodySmall.lineHeight),
    },
    clearButton: {
        padding: hs(Spacing.sm),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: hs(Spacing.lg),
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: hs(32),
    },
    emptyStateTitle: {
        fontSize: getFontSize(Typography.h1.fontSize),
        fontWeight: Typography.h1.fontWeight,
        color: Colors[theme].text,
        marginTop: vs(Spacing.lg),
        marginBottom: vs(Spacing.sm),
        lineHeight: getFontSize(Typography.h1.lineHeight),
    },
    emptyStateText: {
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        color: Colors[theme].textSecondary,
        textAlign: 'center',
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: vs(4),
        maxWidth: '85%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
        alignSelf: 'flex-start',
    },
    botAvatarContainer: {
        width: hs(32),
        height: hs(32),
        borderRadius: hs(16),
        backgroundColor: Palette.brand[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hs(Spacing.sm),
        marginTop: vs(Spacing.xs),
    },
    messageBubble: {
        borderRadius: hs(BorderRadius.lg),
        paddingHorizontal: hs(Spacing.md),
        paddingVertical: vs(Spacing.sm),
        flex: 1,
    },
    userMessage: {
        backgroundColor: Palette.brand[600],
        borderBottomRightRadius: hs(BorderRadius.sm),
    },
    assistantMessage: {
        backgroundColor: Colors[theme].surface,
        borderBottomLeftRadius: hs(BorderRadius.sm),
        borderWidth: 1,
        borderColor: Colors[theme].border,
    },
    messageText: {
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        lineHeight: getFontSize(Typography.bodyLarge.lineHeight),
    },
    userMessageText: {
        color: Colors[theme].textInverse,
    },
    assistantMessageText: {
        color: Colors[theme].text,
    },
    timestamp: {
        fontSize: getFontSize(Typography.captionSmall.fontSize),
        marginTop: vs(6),
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    assistantTimestamp: {
        color: Colors[theme].textTertiary,
    },
    streamingIndicator: {
        marginTop: vs(Spacing.sm),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: hs(Spacing.lg),
        paddingVertical: vs(Spacing.md),
        backgroundColor: Colors[theme].surface,
        borderTopWidth: 1,
        borderTopColor: Colors[theme].border,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors[theme].inputBorder,
        borderRadius: hs(20),
        paddingHorizontal: hs(Spacing.lg),
        paddingVertical: vs(Spacing.sm),
        maxHeight: vs(100),
        fontSize: getFontSize(Typography.bodyLarge.fontSize),
        marginRight: hs(Spacing.sm),
        minHeight: MIN_TOUCH_SIZE,
        color: Colors[theme].inputText,
    },
    sendButton: {
        width: hs(44),
        height: hs(44),
        borderRadius: hs(22),
        backgroundColor: Colors[theme].primary,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
    },
    sendButtonDisabled: {
        backgroundColor: Colors[theme].buttonPrimaryDisabled,
    },
})
