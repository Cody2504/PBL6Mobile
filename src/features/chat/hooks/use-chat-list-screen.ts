import { useEffect, useState, useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { profileService } from '@/features/profile'
import { chatService, ConversationDto } from '@/features/chat'
import { useChatNotification } from '@/global/context/ChatNotificationContext'

interface ConversationItemUI {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  lastMessageDate: Date
  isOnline?: boolean
  hasNewMessage?: boolean
  type: 'group' | 'individual'
  conversationId: number
  receiverId: number
}

export function useChatListScreen() {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState<
    'recent' | 'unread'
  >('recent')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<ConversationItemUI[]>([])

  // Chat notification context
  const { refreshUnreadCount, updateParticipantName } = useChatNotification()

  const formatTs = useCallback((iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) {
      return d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    })
  }, [])

  const loadConversations = useCallback(async (uid: number) => {
    try {
      console.log('📋 Loading conversations for user:', uid)
      const convs: ConversationDto[] = await chatService.listConversations(
        uid,
        1,
        50,
      )
      console.log('📋 Loaded conversations:', convs.length)

      const unreadList = await chatService.getUnreadByConversation(uid)
      const unreadMap = new Map(
        unreadList.map((i) => [i.conversation_id, i.unread_count]),
      )

      const items: ConversationItemUI[] = (convs || []).map((c) => {
        const otherId = c.sender_id === uid ? c.receiver_id : c.sender_id
        const last = c.last_message
        const hasNew = (unreadMap.get(c.id) || 0) > 0
        const participantName = c.receiver_name || `User #${otherId}`

        // Cache participant name for notifications
        if (c.receiver_name) {
          updateParticipantName(otherId, c.receiver_name)
        }

        return {
          id: String(c.id),
          conversationId: c.id,
          receiverId: otherId,
          name: participantName,
          lastMessage: last?.content || '',
          timestamp: formatTs(last?.timestamp),
          lastMessageDate: last?.timestamp ? new Date(last.timestamp) : new Date(0),
          type: 'individual',
          hasNewMessage: hasNew,
        }
      })

      // Sort by most recent message first (newest at top)
      const sortedItems = items.sort((a, b) => {
        return b.lastMessageDate.getTime() - a.lastMessageDate.getTime()
      })

      console.log('📋 Sorted conversations by most recent message')
      setConversations(sortedItems)
      // Refresh global unread count when conversations load
      refreshUnreadCount()
    } catch (e) {
      console.warn('Failed to load conversations', e)
    }
  }, [formatTs, refreshUnreadCount, updateParticipantName])

  // Get user profile on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const profile = await profileService.getProfile()
        const uid = profile?.data?.user_id
        if (!uid || !mounted) return
        setCurrentUserId(uid)
        await loadConversations(uid)
      } catch (e) {
        console.warn('Failed to initialize chat list', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [loadConversations])

  // Refresh conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        console.log('🔄 Screen focused, refreshing conversations...')
        loadConversations(currentUserId)
      }
    }, [currentUserId, loadConversations])
  )

  const filters = [
    { key: 'recent', label: 'Gần đây', icon: 'time-outline' },
    { key: 'unread', label: 'Chưa đọc', icon: 'radio-button-off-outline' },
  ]

  const filteredConversations = conversations
    .filter((conversation) => {
      // First filter by search text
      const matchesSearch =
        conversation.name.toLowerCase().includes(searchText.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchText.toLowerCase())

      if (!matchesSearch) return false

      // Then filter by active filter
      if (activeFilter === 'unread') {
        return conversation.hasNewMessage
      }

      // 'recent' shows all conversations
      return true
    })

  const handleConversationPress = (conversation: ConversationItemUI) => {
    router.push({
      pathname: '/(chat)/conversation',
      params: {
        contactName: conversation.name,
        contactEmail: conversation.name,
        conversationId: conversation.conversationId,
        receiverId: conversation.receiverId,
        currentUserId: currentUserId || 0,
      },
    })
  }

  return {
    searchText,
    activeFilter,
    currentUserId,
    loading,
    conversations,
    filteredConversations,
    filters,
    setSearchText,
    setActiveFilter,
    handleConversationPress,
  }
}

export type { ConversationItemUI }
