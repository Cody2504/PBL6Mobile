import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { authService, ResetPasswordRequest } from '@/features/auth'

export function useResetPasswordScreen() {
  const router = useRouter()
  const { email, code } = useLocalSearchParams<{
    email: string
    code: string
  }>()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (!email || !code) {
      Alert.alert(
        'Error',
        'Invalid request. Please try again from the beginning.',
      )
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
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(auth)/login')
            },
          },
        ])
      } else {
        Alert.alert('Error', response.message)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      Alert.alert('Error', 'Network error. Please try again.')
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
