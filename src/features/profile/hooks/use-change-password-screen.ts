import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { ChangePasswordRequest } from '../types'

export function useChangePasswordScreen() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [logoutOtherDevices, setLogoutOtherDevices] = useState(false)

    const validateForm = useCallback(() => {
        if (!currentPassword.trim()) {
            Alert.alert('Validation Error', 'Please enter your current password')
            return false
        }

        if (!newPassword.trim()) {
            Alert.alert('Validation Error', 'Please enter a new password')
            return false
        }

        if (newPassword.length < 6) {
            Alert.alert(
                'Validation Error',
                'New password must be at least 6 characters long',
            )
            return false
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Validation Error', 'New passwords do not match')
            return false
        }

        return true
    }, [currentPassword, newPassword, confirmNewPassword])

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)

            const changePasswordData: ChangePasswordRequest = {
                currentPassword,
                newPassword,
                confirmPassword: confirmNewPassword,
            }

            const response = await profileService.changePassword(changePasswordData)

            if (response.success) {
                Alert.alert('Success', 'Password changed successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setCurrentPassword('')
                            setNewPassword('')
                            setConfirmNewPassword('')
                            router.back()
                        },
                    },
                ])
            } else {
                Alert.alert('Error', response.message || 'Failed to change password')
            }
        } catch (error: any) {
            console.error('Error changing password:', error)
            Alert.alert('Error', 'Failed to change password. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [validateForm, currentPassword, newPassword, confirmNewPassword, router])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleForgotPassword = useCallback(() => {
        router.push('/(auth)/forgot-password')
    }, [router])

    const toggleLogoutOtherDevices = useCallback(() => {
        if (!loading) {
            setLogoutOtherDevices((prev) => !prev)
        }
    }, [loading])

    return {
        // State
        loading,
        currentPassword,
        newPassword,
        confirmNewPassword,
        logoutOtherDevices,

        // Setters
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,

        // Handlers
        handleSubmit,
        handleBack,
        handleForgotPassword,
        toggleLogoutOtherDevices,
    }
}
