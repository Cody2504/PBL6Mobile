import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { authService, ResetPasswordRequest } from '@/features/auth'
import { useToast } from '@/global/context'

export function useResetPasswordScreen() {
  const router = useRouter()
  const { email, code } = useLocalSearchParams<{
    email: string
    code: string
  }>()
  const { showSuccess, showError, showWarning } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showWarning('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (password.length < 6) {
      showWarning('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (password !== confirmPassword) {
      showWarning('Mật khẩu không khớp')
      return
    }

    if (!email || !code) {
      showError('Yêu cầu không hợp lệ. Vui lòng thử lại từ đầu.')
      return
    }

    setLoading(true)

    try {
      const resetPasswordData: ResetPasswordRequest = {
        email,
        code,
        password,
        confirmPassword,
      }

      const response = await authService.resetPassword(resetPasswordData)

      if (response.success) {
        showSuccess(response.message || 'Đặt lại mật khẩu thành công!')
        router.replace('/(auth)/login')
      } else {
        showError(response.message)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      showError('Lỗi mạng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return {
    password,
    confirmPassword,
    loading,
    setPassword,
    setConfirmPassword,
    handleResetPassword,
    handleBack,
  }
}
