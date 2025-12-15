import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { UserProfile } from '../types'

export interface ProfileOption {
    icon: string
    title: string
    value?: string
    hasArrow?: boolean
    onPress?: () => void
}

export function useProfileScreen() {
    const router = useRouter()
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

    const profileOptions: ProfileOption[] = [
        {
            icon: 'document-text-outline',
            title: 'Edit profile information',
            hasArrow: true,
            onPress: handleEditProfile,
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            value: 'ON',
            hasArrow: true,
            onPress: handleNotifications,
        },
        {
            icon: 'language-outline',
            title: 'Language',
            value: 'English',
            hasArrow: true,
            onPress: handleLanguage,
        },
    ]

    const securityOptions: ProfileOption[] = [
        {
            icon: 'lock-closed-outline',
            title: 'Change Password',
            hasArrow: true,
            onPress: handleChangePassword,
        },
        {
            icon: 'bulb-outline',
            title: 'Theme',
            value: 'Light mode',
            hasArrow: true,
            onPress: handleTheme,
        },
    ]

    const supportOptions: ProfileOption[] = [
        {
            icon: 'person-circle-outline',
            title: 'Help & Support',
            hasArrow: true,
            onPress: handleHelpSupport,
        },
        {
            icon: 'chatbubble-outline',
            title: 'Contact us',
            hasArrow: true,
            onPress: handleContactUs,
        },
        {
            icon: 'lock-closed-outline',
            title: 'Privacy policy',
            hasArrow: true,
            onPress: handlePrivacyPolicy,
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
