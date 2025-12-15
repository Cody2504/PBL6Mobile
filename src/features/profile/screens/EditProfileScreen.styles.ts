import { StyleSheet, Platform, StatusBar } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'

const INPUT_BACKGROUND = '#FFFFFF'
const BORDER_COLOR = '#FF9900'

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(15),
        paddingVertical: vs(10),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: hs(5),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: getFontSize(18),
        fontWeight: 'bold',
        color: '#000',
        lineHeight: getFontSize(24),
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
        fontSize: getFontSize(16),
        color: '#666',
        lineHeight: getFontSize(22),
    },
    content: {
        padding: hs(20),
    },
    inputContainer: {
        marginBottom: vs(20),
        backgroundColor: INPUT_BACKGROUND,
        borderRadius: hs(8),
        paddingHorizontal: hs(15),
        paddingVertical: vs(5),
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    dropdownContainer: {
        paddingBottom: vs(5),
    },
    inputLabel: {
        fontSize: getFontSize(12),
        color: '#666',
        marginBottom: vs(2),
        lineHeight: getFontSize(16),
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: getFontSize(16),
        color: '#000',
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
        marginBottom: vs(20),
    },
    inlineItem: {
        flex: 1,
        marginRight: hs(10),
    },
    submitButton: {
        backgroundColor: '#FF8C00',
        borderRadius: hs(8),
        paddingVertical: vs(15),
        marginTop: vs(30),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#FF8C00',
        shadowOffset: { width: 0, height: vs(2) },
        shadowOpacity: 0.4,
        shadowRadius: hs(3),
        minHeight: MIN_TOUCH_SIZE,
    },
    submitButtonDisabled: {
        backgroundColor: '#FFB366',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: getFontSize(18),
        fontWeight: 'bold',
        lineHeight: getFontSize(24),
    },
})
