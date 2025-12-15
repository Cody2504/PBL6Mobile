import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/global/hooks'
import { AuthProvider, useAuth } from '@/global/context'
import { ChatNotificationProvider } from '@/global/context/ChatNotificationContext'
import ChatNotificationManager from '@/features/chat/components/ChatNotificationManager'

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const inAuthGroup = segments[0] === '(auth)'

    console.log('Navigation check:', {
      isAuthenticated,
      isLoading,
      inAuthGroup,
      segments,
    })

    // Initial navigation when auth state is determined
    if (!isAuthenticated && !inAuthGroup) {
      console.log('Not authenticated, redirecting to login')
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      console.log('Authenticated, redirecting to activity')
      router.replace('/(tabs)/activity')
    }
  }, [isAuthenticated, isLoading])

  // Show nothing while loading
  if (isLoading) {
    return null
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(group)" options={{ headerShown: false }} />
      <Stack.Screen name="(post)" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      <Stack.Screen name="(chat)" options={{ headerShown: false }} />
    </Stack>
  )
}

export const unstable_settings = {
  initialRouteName: '(auth)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <ChatNotificationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <ChatNotificationManager />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ChatNotificationProvider>
    </AuthProvider>
  )
}
