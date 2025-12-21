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
import { AuthProvider, useAuth, ProfileCacheProvider, TeamsCacheProvider, ToastProvider } from '@/global/context'
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
      console.log('Authenticated, redirecting to teams')
      router.replace('/(tabs)/teams')
    }
  }, [isAuthenticated, isLoading])

  // Show nothing while loading
  if (isLoading) {
    return null
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 150,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="(group)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 150,
        }}
      />
      <Stack.Screen
        name="(post)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 150,
        }}
      />
      <Stack.Screen
        name="(profile)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 150,
        }}
      />
      <Stack.Screen
        name="(chat)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 150,
        }}
      />
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
      <ProfileCacheProvider>
        <TeamsCacheProvider>
          <ChatNotificationProvider>
            <ToastProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <RootLayoutNav />
                <ChatNotificationManager />
                <StatusBar style="auto" />
              </ThemeProvider>
            </ToastProvider>
          </ChatNotificationProvider>
        </TeamsCacheProvider>
      </ProfileCacheProvider>
    </AuthProvider>
  )
}

