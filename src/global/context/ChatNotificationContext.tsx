import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { getChatSocket } from '@/libs/http/socket'
import { chatService } from '@/features/chat/api/chat-service'
import { useAuth } from './AuthContext'

export interface InAppNotification {
  conversationId: number
  senderId: number
  senderName: string
  messagePreview: string
  timestamp: Date
}

interface ChatNotificationState {
  totalUnreadCount: number
  activeConversationId: number | null
  isSocketConnected: boolean
}

interface ChatNotificationContextType {
  totalUnreadCount: number
  activeConversationId: number | null
  isSocketConnected: boolean
  setActiveConversationId: (id: number | null) => void
  refreshUnreadCount: () => Promise<void>
  updateParticipantName: (userId: number, name: string) => void
  onNotification: (callback: (notification: InAppNotification) => void) => () => void
}

const ChatNotificationContext = createContext<ChatNotificationContextType | undefined>(undefined)

export const useChatNotification = () => {
  const context = useContext(ChatNotificationContext)
  if (!context) {
    throw new Error('useChatNotification must be used within a ChatNotificationProvider')
  }
  return context
}

export const ChatNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  // Cache participant names for notification display
  const participantNamesRef = useRef<Map<number, string>>(new Map())

  // Notification subscribers
  const notificationCallbacksRef = useRef<Set<(notification: InAppNotification) => void>>(new Set())

  // App state ref for detecting foreground/background
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  // Fetch and calculate total unread count
  const refreshUnreadCount = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setTotalUnreadCount(0)
      return
    }

    const userId = parseInt(user.id, 10)
    if (isNaN(userId)) {
      console.warn('Invalid user ID for unread count')
      return
    }

    try {
      const unreadList = await chatService.getUnreadByConversation(userId)
      const total = unreadList.reduce((sum, item) => sum + item.unread_count, 0)
      setTotalUnreadCount(total)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [user, isAuthenticated])

  // Update participant name cache
  const updateParticipantName = useCallback((userId: number, name: string) => {
    participantNamesRef.current.set(userId, name)
  }, [])

  // Subscribe to notifications
  const onNotification = useCallback((callback: (notification: InAppNotification) => void) => {
    notificationCallbacksRef.current.add(callback)

    // Return unsubscribe function
    return () => {
      notificationCallbacksRef.current.delete(callback)
    }
  }, [])

  // Trigger notification to all subscribers
  const triggerNotification = useCallback((notification: InAppNotification) => {
    notificationCallbacksRef.current.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error('Error in notification callback:', error)
      }
    })
  }, [])

  // Initialize WebSocket listener and fetch initial unread count
  useEffect(() => {
    if (!user || !isAuthenticated) {
      setTotalUnreadCount(0)
      setIsSocketConnected(false)
      return
    }

    const userId = parseInt(user.id, 10)
    if (isNaN(userId)) {
      console.warn('Invalid user ID for chat notifications')
      return
    }

    let mounted = true

    // Fetch initial unread count
    refreshUnreadCount()

    // Initialize WebSocket connection
    const socket = getChatSocket(userId)

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Chat notification socket connected')
      if (mounted) setIsSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Chat notification socket disconnected')
      if (mounted) setIsSocketConnected(false)
    })

    socket.on('reconnect', () => {
      console.log('Chat notification socket reconnected')
      if (mounted) {
        setIsSocketConnected(true)
        refreshUnreadCount() // Refresh unread count on reconnect
      }
    })

    // Listen for new messages globally
    socket.on('message:received', (payload: any) => {
      if (!mounted) return

      try {
        const messageConversationId = payload?.conversation_id
        const messageSenderId = payload?.sender_id
        const messageContent = payload?.content || ''

        // Ignore messages from the current user
        if (messageSenderId === userId) {
          return
        }

        // Don't show notification if user is viewing this conversation
        if (activeConversationId === messageConversationId) {
          return
        }

        // Get sender name from cache or use fallback
        const senderName = participantNamesRef.current.get(messageSenderId) || `User #${messageSenderId}`

        // Truncate message preview to 50 characters
        const messagePreview = messageContent.length > 50
          ? messageContent.substring(0, 50) + '...'
          : messageContent || 'New message'

        // Create notification object
        const notification: InAppNotification = {
          conversationId: messageConversationId,
          senderId: messageSenderId,
          senderName,
          messagePreview,
          timestamp: new Date(),
        }

        // Increment unread count locally (will be synced with API later)
        setTotalUnreadCount(prev => prev + 1)

        // Trigger notification to subscribers
        triggerNotification(notification)

      } catch (error) {
        console.error('Error processing received message:', error)
      }
    })

    // Cleanup
    return () => {
      mounted = false
      socket.off('connect')
      socket.off('disconnect')
      socket.off('reconnect')
      socket.off('message:received')
    }
  }, [user, isAuthenticated, activeConversationId, refreshUnreadCount, triggerNotification])

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // App is coming to foreground
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App came to foreground, refreshing unread count')
        refreshUnreadCount()
      }

      appStateRef.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [refreshUnreadCount])

  return (
    <ChatNotificationContext.Provider
      value={{
        totalUnreadCount,
        activeConversationId,
        isSocketConnected,
        setActiveConversationId,
        refreshUnreadCount,
        updateParticipantName,
        onNotification,
      }}
    >
      {children}
    </ChatNotificationContext.Provider>
  )
}
