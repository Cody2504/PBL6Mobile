import { useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { ChangePasswordRequest } from '../types'
import { useToast } from '@/global/context'

export function useChangePasswordScreen() {
    const router = useRouter()
    const { showSuccess, showError, showWarning } = useToast()
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [logoutOtherDevices, setLogoutOtherDevices] = useState(false)

    const validateForm = useCallback(() => {
        if (!currentPassword.trim()) {
            showWarning('Vui lòng nhập mật khẩu hiện tại')
            return false
        }

        if (!newPassword.trim()) {
            showWarning('Vui lòng nhập mật khẩu mới')
            return false
        }

        if (newPassword.length < 6) {
            showWarning('Mật khẩu mới phải có ít nhất 6 ký tự')
            return false
        }

        if (newPassword !== confirmNewPassword) {
            showWarning('Mật khẩu mới không khớp')
            return false
        }

        return true
    }, [currentPassword, newPassword, confirmNewPassword, showWarning])

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
                showSuccess('Đổi mật khẩu thành công')
                // Clear form
                setCurrentPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
                router.back()
            } else {
                showError(response.message || 'Đổi mật khẩu thất bại')
            }
        } catch (error: any) {
            console.error('Error changing password:', error)
            showError('Đổi mật khẩu thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }, [validateForm, currentPassword, newPassword, confirmNewPassword, router, showSuccess, showError])

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
