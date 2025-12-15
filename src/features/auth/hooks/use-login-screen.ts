import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '../api'
import type { LoginRequest } from '../types'
import { useAuth } from '@/global/context'

export function useLoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { login } = useAuth()

  // Load saved credentials on mount
  useEffect(() => {
    loadSavedCredentials()
  }, [])

  const loadSavedCredentials = async () => {
    try {
      const rememberMeEnabled = await AsyncStorage.getItem('rememberMe')
      const savedEmail = await AsyncStorage.getItem('savedEmail')

      if (rememberMeEnabled === 'true' && savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error)
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const loginData: LoginRequest = { email, password }
      const response = await authService.login(loginData)

      // Check if the response is successful and has the expected structure
      if (
        response.success &&
        response.data?.success &&
        response.data.accessToken &&
        response.data.user
      ) {
        // Store remember me preference
        if (rememberMe) {
          await AsyncStorage.setItem('rememberMe', 'true')
          await AsyncStorage.setItem('savedEmail', email)
        } else {
          await AsyncStorage.removeItem('rememberMe')
          await AsyncStorage.removeItem('savedEmail')
        }

        // Transform user data
        const userData = {
          id: response.data.user.user_id.toString(),
          email: response.data.user.email,
          name: response.data.user.full_name,
          phone: response.data.user.phone,
          address: response.data.user.address,
          dateOfBirth: response.data.user.dateOfBirth,
          gender: response.data.user.gender,
          avatar: response.data.user.avatar,
          role: response.data.user.role,
          status: response.data.user.status,
        }

        // Use auth context to handle login
        await login(
          userData,
          response.data.accessToken,
          response.data.refreshToken,
        )

        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/teams'),
          },
        ])
      } else {
        Alert.alert(
          'Login Failed',
          response.message || 'Login failed. Please try again.',
        )
      }
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    router.push('/(auth)/register')
  }

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe)
  }

  return {
    // State
    email,
    password,
    rememberMe,
    loading,

    // Setters
    setEmail,
    setPassword,

    // Handlers
    handleLogin,
    handleSignUp,
    toggleRememberMe,
  }
}
