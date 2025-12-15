import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

type UserRole = 'admin' | 'teacher' | 'user'
type UserStatus = 'active' | 'block'

interface Permission {
  permission_id: number
  key: string
  name: string
  resource: string
  action: string
  description?: string
}

interface Role {
  role_id: number
  name: string
  description?: string
}

interface User {
  user_id: number
  full_name?: string
  email: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  avatar?: string | null
  bio?: string | null
  role: UserRole
  status: UserStatus
  isEmailVerified?: boolean
  created_at?: string
  updated_at?: string | null
  roles?: Role[]
  permissions?: Permission[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    userData: User,
    accessToken: string,
    refreshToken?: string,
  ) => Promise<void>
  logout: () => Promise<void>
  isTeacher: () => boolean
  isStudent: () => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthState = async () => {
    try {
      const [accessToken, userData] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('user'),
      ])

      console.log('Auth State Check:', {
        hasAccessToken: !!accessToken,
        hasUserData: !!userData,
        accessToken: accessToken ? accessToken.substring(0, 20) + '...' : null,
        userData: userData ? JSON.parse(userData) : null,
      })

      if (accessToken && userData) {
        setUser(JSON.parse(userData))
      } else {
        // Clear any partial data
        if (accessToken || userData) {
          console.log('Partial auth data found, clearing...')
          await logout()
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
      await logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (
    userData: User,
    accessToken: string,
    refreshToken?: string,
  ) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken)
      await AsyncStorage.setItem('user', JSON.stringify(userData))
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken)
      }
      setUser(userData)
    } catch (error) {
      console.error('Error storing auth data:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('refreshToken'),
        AsyncStorage.removeItem('user'),
      ])
      setUser(null)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const isTeacher = () => user?.role === 'teacher'
  const isStudent = () => user?.role === 'user'
  const isAdmin = () => user?.role === 'admin'

  useEffect(() => {
    checkAuthState()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isTeacher,
        isStudent,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
