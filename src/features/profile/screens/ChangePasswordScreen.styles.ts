import { StyleSheet, Platform, StatusBar } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
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
        paddingHorizontal: hs(20),
        paddingTop: vs(10),
    },
    title: {
        fontSize: getFontSize(24),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: vs(10),
        lineHeight: getFontSize(32),
    },
    instructions: {
        fontSize: getFontSize(16),
        color: '#333',
        marginBottom: vs(30),
        lineHeight: getFontSize(24),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: hs(6),
        paddingHorizontal: hs(15),
        paddingVertical: vs(12),
        fontSize: getFontSize(16),
        marginBottom: vs(15),
        backgroundColor: '#f7f7f7',
        minHeight: MIN_TOUCH_SIZE,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-start',
        marginBottom: vs(20),
        minHeight: MIN_TOUCH_SIZE,
        justifyContent: 'center',
    },
    forgotPasswordText: {
        fontSize: getFontSize(15),
        color: '#1877F2',
        fontWeight: '600',
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
        color: '#333',
        lineHeight: getFontSize(22),
    },
    submitButton: {
        borderRadius: hs(6),
        paddingVertical: vs(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7F3FF',
        minHeight: MIN_TOUCH_SIZE,
    },
    facebookBlue: {
        backgroundColor: '#1877F2',
    },
    submitButtonDisabled: {
        backgroundColor: '#B0C4DE',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: getFontSize(18),
        fontWeight: 'bold',
        lineHeight: getFontSize(24),
    },
})
