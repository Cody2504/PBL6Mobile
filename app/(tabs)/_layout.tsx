import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useChatNotification } from '@/global/context/ChatNotificationContext'

// Badge component for unread count
const TabBarBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  )
}

// Chat tab icon with badge
const ChatTabIcon: React.FC<{ color: string; focused: boolean }> = ({ color, focused }) => {
  const { totalUnreadCount } = useChatNotification()

  return (
    <View>
      <Ionicons
        name={focused ? 'chatbubble' : 'chatbubble-outline'}
        size={24}
        color={color}
      />
      <TabBarBadge count={totalUnreadCount} />
    </View>
  )
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5B5FC7',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: Math.max(
            insets.bottom,
            Platform.OS === 'ios' ? 20 : 5,
          ),
          paddingTop: 5,
          height: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 5) + 55, // Adjust height based on safe area
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <ChatTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Lớp học',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Lịch thi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Bạn',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.avatarContainer, focused && styles.avatarFocused]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>VH</Text>
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFocused: {
    transform: [{ scale: 1.1 }],
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4E4C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B7355',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
})
