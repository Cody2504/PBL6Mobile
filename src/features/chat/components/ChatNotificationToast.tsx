import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { InAppNotification } from '@/global/context/ChatNotificationContext'

interface ChatNotificationToastProps {
  visible: boolean
  notification: InAppNotification | null
  onPress: () => void
  onDismiss: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const ChatNotificationToast: React.FC<ChatNotificationToastProps> = ({
  visible,
  notification,
  onPress,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets()
  const translateY = useRef(new Animated.Value(-100)).current
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (visible && notification) {
      // Slide in
      Animated.timing(translateY, {
        toValue: insets.top + 8,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Auto-dismiss after 4 seconds
      timeoutRef.current = setTimeout(() => {
        handleDismiss()
      }, 4000)
    } else {
      // Slide out
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Clear timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible, notification, insets.top])

  const handleDismiss = () => {
    // Slide out
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss()
    })
  }

  const handlePress = () => {
    handleDismiss()
    // Small delay to allow animation to complete before navigation
    setTimeout(() => {
      onPress()
    }, 100)
  }

  if (!notification) {
    return null
  }

  // Get first letter of sender name for avatar
  const initial = notification.senderName.charAt(0).toUpperCase()

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          {/* Message content */}
          <View style={styles.messageContainer}>
            <Text style={styles.senderName} numberOfLines={1}>
              {notification.senderName}
            </Text>
            <Text style={styles.messagePreview} numberOfLines={2}>
              {notification.messagePreview}
            </Text>
          </View>

          {/* Dismiss button */}
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.dismissText}>×</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 8,
  },
  touchable: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6264a7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
    marginRight: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  messagePreview: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  dismissButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  dismissText: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
    lineHeight: 28,
  },
})

export default ChatNotificationToast
