import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { authService, VerifyCodeRequest } from '@/features/auth'

export function useVerifyOtpScreen() {
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email: string }>()

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
      Alert.alert('Error', 'Please enter the verification code')
      return
    }

    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code')
      return
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again.')
      return
    }

    setLoading(true)

    try {
      const verifyCodeData: VerifyCodeRequest = { email, code }
      const response = await authService.verifyCode(verifyCodeData)

      if (response.success) {
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/reset-password',
                params: { email, code },
              })
            },
          },
        ])
      } else {
        Alert.alert('Error', response.message)
      }
    } catch (error) {
      console.error('Verify code error:', error)
      Alert.alert('Error', 'Network error. Please try again.')
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
        Alert.alert('Success', 'Verification code resent to your email')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.')
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
