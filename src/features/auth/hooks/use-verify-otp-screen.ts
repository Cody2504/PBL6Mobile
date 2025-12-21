import { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { authService, VerifyCodeRequest } from '@/features/auth'
import { useToast } from '@/global/context'

export function useVerifyOtpScreen() {
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email: string }>()
  const { showSuccess, showError, showWarning } = useToast()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleVerifyCode = async () => {
    if (!code) {
      showWarning('Vui lòng nhập mã xác nhận')
      return
    }

    if (code.length !== 6) {
      showWarning('Vui lòng nhập mã 6 chữ số hợp lệ')
      return
    }

    if (!email) {
      showError('Không tìm thấy email. Vui lòng thử lại.')
      return
    }

    setLoading(true)

    try {
      const verifyCodeData: VerifyCodeRequest = { email, code }
      const response = await authService.verifyCode(verifyCodeData)

      if (response.success) {
        showSuccess(response.message || 'Xác nhận thành công!')
        router.push({
          pathname: '/(auth)/reset-password',
          params: { email, code },
        })
      } else {
        showError(response.message)
      }
    } catch (error) {
      console.error('Verify code error:', error)
      showError('Lỗi mạng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) return

    try {
      setLoading(true)
      const response = await authService.forgotPassword({ email })
      if (response.success) {
        setTimeLeft(300) // Reset timer
        showSuccess('Đã gửi lại mã xác nhận!')
      }
    } catch (error) {
      showError('Gửi lại mã thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return {
    email,
    code,
    loading,
    timeLeft,
    setCode,
    handleVerifyCode,
    handleResendCode,
    handleBack,
    formatTime,
  }
}
