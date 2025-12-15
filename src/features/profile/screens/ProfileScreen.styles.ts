import { StyleSheet, Platform, StatusBar } from 'react-native'
import {
    hs,
    vs,
    getFontSize,
    MIN_TOUCH_SIZE,
} from '@/libs/utils'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: hs(20),
        paddingVertical: vs(15),
        backgroundColor: '#fff',
    },
    headerRightIcons: {
        flexDirection: 'row',
    },
    headerIconWrapper: {
        marginLeft: hs(15),
        minHeight: MIN_TOUCH_SIZE,
        minWidth: MIN_TOUCH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: vs(30),
        paddingHorizontal: hs(20),
        marginBottom: vs(15),
        borderBottomLeftRadius: hs(20),
        borderBottomRightRadius: hs(20),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: vs(15),
    },
    avatar: {
        width: hs(120),
        height: hs(120),
        borderRadius: hs(60),
        borderWidth: hs(5),
        borderColor: '#E6F0FF',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: hs(15),
        width: hs(30),
        height: hs(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f5f5f5',
    },
    userName: {
        fontSize: getFontSize(22),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: vs(5),
        lineHeight: getFontSize(28),
    },
    userEmail: {
        fontSize: getFontSize(14),
        color: '#666',
        lineHeight: getFontSize(20),
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: hs(15),
        borderRadius: hs(15),
        marginBottom: vs(15),
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: vs(1) },
        shadowOpacity: 0.05,
        shadowRadius: hs(3),
    },
    lastSection: {
        marginBottom: vs(20),
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: hs(20),
        paddingVertical: vs(15),
        minHeight: MIN_TOUCH_SIZE,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionTitle: {
        fontSize: getFontSize(16),
        color: '#333',
        marginLeft: hs(15),
        lineHeight: getFontSize(22),
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionValue: {
        fontSize: getFontSize(14),
        color: '#666',
        marginRight: hs(10),
        fontWeight: '500',
        lineHeight: getFontSize(20),
    },
    valueOrange: {
        color: '#FF6B35',
    },
    statusBarSpacer: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    bottomSpacer: {
        height: vs(20),
    },
})
