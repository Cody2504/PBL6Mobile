import { StyleSheet } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(16),
        paddingVertical: vs(12),
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: hs(8),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: getFontSize(18),
        fontWeight: '600',
        color: '#000',
        lineHeight: getFontSize(24),
    },
    doneButton: {
        padding: hs(8),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    doneText: {
        fontSize: getFontSize(16),
        color: '#0078d4',
        fontWeight: '600',
        lineHeight: getFontSize(22),
    },
    content: {
        flex: 1,
        padding: hs(16),
    },
    inputSection: {
        marginBottom: vs(24),
    },
    label: {
        fontSize: getFontSize(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: vs(8),
        lineHeight: getFontSize(22),
    },
    textInput: {
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
        paddingVertical: vs(12),
        fontSize: getFontSize(16),
        color: '#000',
        minHeight: MIN_TOUCH_SIZE,
    },
    descriptionInput: {
        minHeight: vs(60),
    },
    infoSection: {
        marginTop: vs(32),
    },
    infoText: {
        fontSize: getFontSize(14),
        color: '#666',
        lineHeight: getFontSize(20),
        marginBottom: vs(12),
    },
    codeInfo: {
        fontSize: getFontSize(14),
        color: '#0078d4',
        lineHeight: getFontSize(20),
        fontStyle: 'italic',
    },
})
