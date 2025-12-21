import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { profileService } from '../api'
import type { UserProfile } from '../types'
import { useAuth, useProfileCache, useToast } from '@/global/context'

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
    const { showSuccess, showError } = useToast()
    const { cachedProfile, setCachedProfile, isCacheValid } = useProfileCache()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(cachedProfile)
    const [loading, setLoading] = useState(!isCacheValid)

    useEffect(() => {
        // If cache is valid, use it and skip loading
        if (isCacheValid && cachedProfile) {
            setUserProfile(cachedProfile)
            setLoading(false)
            return
        }

        // Otherwise, fetch fresh data
        fetchUserProfile()
    }, [isCacheValid, cachedProfile])

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true)
            const response = await profileService.getProfile()
            if (response.success) {
                setUserProfile(response.data)
                setCachedProfile(response.data) // Cache the data
            } else {
                showError(response.message || 'Không thể tải thông tin hồ sơ')
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            showError('Không thể tải thông tin hồ sơ')
        } finally {
            setLoading(false)
        }
    }, [setCachedProfile, showError])

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

    const handleAvatarPress = useCallback(async () => {
        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (permissionResult.granted === false) {
            showError('Bạn cần cấp quyền truy cập thư viện ảnh!')
            return
        }

        // Pick image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            try {
                setLoading(true)
                const asset = result.assets[0]

                // Extract file extension from URI
                const uriParts = asset.uri.split('.')
                const fileExtension = uriParts[uriParts.length - 1]

                const file = {
                    uri: asset.uri,
                    name: `avatar.${fileExtension}`,
                    type: `image/${fileExtension}`,
                }

                const response = await profileService.uploadAvatar(file)

                if (response.success) {
                    showSuccess('Cập nhật ảnh đại diện thành công!')
                    setUserProfile(response.data)
                    setCachedProfile(response.data)
                } else {
                    showError(response.message || 'Không thể tải lên ảnh đại diện')
                }
            } catch (error: any) {
                console.error('Error uploading avatar:', error)
                showError('Không thể tải lên ảnh đại diện')
            } finally {
                setLoading(false)
            }
        }
    }, [setCachedProfile, showSuccess, showError])

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
                            showError('Không thể đăng xuất. Vui lòng thử lại.')
                        }
                    },
                },
            ],
        )
    }, [logout, router, showError])

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
        handleAvatarPress,
        fetchUserProfile,
    }
}
