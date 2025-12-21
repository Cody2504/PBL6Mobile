import { useState } from 'react'
import { useRouter } from 'expo-router'
import { authService, ForgotPasswordRequest } from '@/features/auth'
import { useToast } from '@/global/context'

export function useForgotPasswordScreen() {
  const router = useRouter()
  const { showSuccess, showError, showWarning } = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleForgotPassword = async () => {
    if (!email) {
      showWarning('Vui lòng nhập địa chỉ email')
      return
    }

    if (!isValidEmail(email)) {
      showWarning('Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      const forgotPasswordData: ForgotPasswordRequest = { email }
      const response = await authService.forgotPassword(forgotPasswordData)

      if (response.success) {
        showSuccess(response.message || 'Mã xác nhận đã được gửi!')
        router.push({
          pathname: '/(auth)/verify-otp',
          params: { email },
        })
      } else {
        showError(response.message)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      showError('Lỗi mạng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.back()
  }

  return {
    email,
    loading,
    setEmail,
    handleForgotPassword,
    handleBackToLogin,
  }
}
