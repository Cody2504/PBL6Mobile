import React, { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router'
import { useChatNotification, InAppNotification } from '@/global/context/ChatNotificationContext'
import ChatNotificationToast from './ChatNotificationToast'

const MAX_QUEUE_SIZE = 5

const ChatNotificationManager: React.FC = () => {
  const { onNotification, setActiveConversationId } = useChatNotification()
  const [currentNotification, setCurrentNotification] = useState<InAppNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const queueRef = useRef<InAppNotification[]>([])

  // Subscribe to notifications from context
  useEffect(() => {
    const unsubscribe = onNotification((notification) => {
      // Add to queue if queue is not full
      if (queueRef.current.length < MAX_QUEUE_SIZE) {
        queueRef.current.push(notification)
      } else {
        console.warn('Notification queue is full, dropping notification')
      }

      // Show notification if none is currently displayed
      if (!isVisible) {
        showNextNotification()
      }
    })

    return unsubscribe
  }, [onNotification, isVisible])

  const showNextNotification = () => {
    const nextNotification = queueRef.current.shift()

    if (nextNotification) {
      setCurrentNotification(nextNotification)
      setIsVisible(true)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)

    // Wait for animation to complete before showing next
    setTimeout(() => {
      setCurrentNotification(null)
      showNextNotification()
    }, 300)
  }

  const handlePress = () => {
    if (!currentNotification) return

    // Navigate to conversation
    try {
      // Set active conversation ID
      setActiveConversationId(currentNotification.conversationId)

      // Navigate to conversation screen
      router.push({
        pathname: '/(chat)/conversation',
        params: {
          conversationId: currentNotification.conversationId.toString(),
        },
      })
    } catch (error) {
      console.error('Error navigating to conversation:', error)
    }
  }

  return (
    <ChatNotificationToast
      visible={isVisible}
      notification={currentNotification}
      onPress={handlePress}
      onDismiss={handleDismiss}
    />
  )
}

export default ChatNotificationManager
