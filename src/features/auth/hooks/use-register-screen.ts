import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { authService } from '@/features/auth'

interface RegisterRequest {
  email: string
  fullName: string
  password: string
  confirmPassword: string
  role?: string
}

export function useRegisterScreen() {
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Warning states
  const [emailWarning, setEmailWarning] = useState('')
  const [fullNameWarning, setFullNameWarning] = useState('')
  const [passwordWarning, setPasswordWarning] = useState('')
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState('')

  // Validation helpers
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9\s]+$/
    return usernameRegex.test(username)
  }

  // Blur handlers
  const handleEmailBlur = () => {
    if (!email) {
      setEmailWarning('Please fill in your email')
    } else if (!isValidEmail(email)) {
      setEmailWarning('Please enter a valid email address')
    } else {
      setEmailWarning('')
    }
  }

  const handleFullNameBlur = () => {
    if (!fullName) {
      setFullNameWarning('Please fill in your full name')
    } else if (fullName.length < 2) {
      setFullNameWarning('Full name must be at least 2 characters long')
    } else if (!isValidUsername(fullName)) {
      setFullNameWarning('Full name must contain only letters and numbers')
    } else {
      setFullNameWarning('')
    }
  }

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordWarning('Please fill in your password')
    } else if (password.length < 7 || password.length > 20) {
      setPasswordWarning('Password must be between 7-20 characters')
    } else {
      setPasswordWarning('')
    }
  }

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordWarning('Please confirm your password')
    } else if (password !== confirmPassword) {
      setConfirmPasswordWarning('Passwords do not match')
    } else {
      setConfirmPasswordWarning('')
    }
  }

  // Main registration handler
  const handleRegister = async () => {
    // Reset warnings
    setEmailWarning('')
    setFullNameWarning('')
    setPasswordWarning('')
    setConfirmPasswordWarning('')

    let hasError = false

    // Validate email
    if (!email) {
      setEmailWarning('Please fill in your email')
      hasError = true
    } else if (!isValidEmail(email)) {
      setEmailWarning('Please enter a valid email address')
      hasError = true
    }

    // Validate full name
    if (!fullName) {
      setFullNameWarning('Please fill in your full name')
      hasError = true
    } else if (fullName.length < 2) {
      setFullNameWarning('Full name must be at least 2 characters long')
      hasError = true
    } else if (!isValidUsername(fullName)) {
      setFullNameWarning('Full name must contain only letters and numbers')
      hasError = true
    }

    // Validate password
    if (!password) {
      setPasswordWarning('Please fill in your password')
      hasError = true
    } else if (password.length < 7 || password.length > 20) {
      setPasswordWarning('Password must be between 7-20 characters')
      hasError = true
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordWarning('Please confirm your password')
      hasError = true
    } else if (password !== confirmPassword) {
      setConfirmPasswordWarning('Passwords do not match')
      hasError = true
    }

    if (hasError) {
      return
    }

    setLoading(true)

    try {
      const registerData: RegisterRequest = {
        email,
        fullName,
        password,
        confirmPassword,
        role: 'Guest',
      }

      const response = await authService.register(registerData)

      if (response.success) {
        Alert.alert('Success', 'Account created successfully! Please login.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ])
      } else {
        Alert.alert('Error', response.message || 'Registration failed.')
      }
    } catch (error) {
      console.error('Register error:', error)
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    // Form values
    email,
    fullName,
    password,
    confirmPassword,
    loading,

    // Warning states
    emailWarning,
    fullNameWarning,
    passwordWarning,
    confirmPasswordWarning,

    // Setters
    setEmail,
    setFullName,
    setPassword,
    setConfirmPassword,

    // Handlers
    handleRegister,
    handleEmailBlur,
    handleFullNameBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
  }
}
