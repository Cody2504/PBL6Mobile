import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { authService, ForgotPasswordRequest } from '@/features/auth'

export function useForgotPasswordScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const forgotPasswordData: ForgotPasswordRequest = { email }
      const response = await authService.forgotPassword(forgotPasswordData)

      if (response.success) {
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/verify-otp',
                params: { email },
              })
            },
          },
        ])
      } else {
        Alert.alert('Error', response.message)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      Alert.alert('Error', 'Network error. Please try again.')
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
