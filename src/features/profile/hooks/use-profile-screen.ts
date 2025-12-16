import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { UserProfile } from '../types'
import { useAuth } from '@/global/context'

export interface ProfileOption {
    icon: string
    title: string
    value?: string
    hasArrow?: boolean
    onPress?: () => void
}

export function useProfileScreen() {
    const router = useRouter()
    const { logout } = useAuth()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true)
            const response = await profileService.getProfile()
            if (response.success) {
                setUserProfile(response.data)
            } else {
                Alert.alert('Error', response.message || 'Failed to fetch profile')
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            Alert.alert('Error', 'Failed to load profile information')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleEditProfile = useCallback(() => {
        router.push('/(profile)/edit-profile')
    }, [router])

    const handleNotifications = useCallback(() => {
        console.log('Notifications')
    }, [])

    const handleLanguage = useCallback(() => {
        console.log('Language')
    }, [])

    const handleChangePassword = useCallback(() => {
        router.push('/(profile)/change-password')
    }, [router])

    const handleTheme = useCallback(() => {
        console.log('Theme')
    }, [])

    const handleHelpSupport = useCallback(() => {
        console.log('Help & Support')
    }, [])

    const handleContactUs = useCallback(() => {
        console.log('Contact us')
    }, [])

    const handlePrivacyPolicy = useCallback(() => {
        console.log('Privacy policy')
    }, [])

    const handleLogout = useCallback(() => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout()
                            router.replace('/(auth)/login')
                        } catch (error) {
                            console.error('Logout error:', error)
                            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.')
                        }
                    },
                },
            ],
        )
    }, [logout, router])

    const profileOptions: ProfileOption[] = [
        {
            icon: 'document-text-outline',
            title: 'Chỉnh sửa thông tin',
            hasArrow: true,
            onPress: handleEditProfile,
        },
    ]

    const securityOptions: ProfileOption[] = [
        {
            icon: 'lock-closed-outline',
            title: 'Đổi mật khẩu',
            hasArrow: true,
            onPress: handleChangePassword,
        },
    ]

    const supportOptions: ProfileOption[] = [
        {
            icon: 'person-circle-outline',
            title: 'Trợ giúp & Hỗ trợ',
            hasArrow: true,
            onPress: handleHelpSupport,
        },
        {
            icon: 'chatbubble-outline',
            title: 'Liên hệ',
            hasArrow: true,
            onPress: handleContactUs,
        },
        {
            icon: 'lock-closed-outline',
            title: 'Chính sách bảo mật',
            hasArrow: true,
            onPress: handlePrivacyPolicy,
        },
        {
            icon: 'log-out-outline',
            title: 'Đăng xuất',
            hasArrow: true,
            onPress: handleLogout,
        },
    ]

    return {
        // State
        userProfile,
        loading,

        // Options
        profileOptions,
        securityOptions,
        supportOptions,

        // Handlers
        handleEditProfile,
        fetchUserProfile,
    }
}
