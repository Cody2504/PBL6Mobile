import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { profileService } from '@/features/profile'
import { chatService, ConversationDto } from '@/features/chat'
import { useChatNotification } from '@/global/context/ChatNotificationContext'

interface ConversationItemUI {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  isOnline?: boolean
  hasNewMessage?: boolean
  type: 'group' | 'individual'
  conversationId: number
  receiverId: number
}

export function useChatListScreen() {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'recent' | 'unread' | 'mentions'
  >('recent')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<ConversationItemUI[]>([])

  // Chat notification context
  const { refreshUnreadCount } = useChatNotification()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const profile = await profileService.getProfile()
        const uid = profile?.data?.user_id
        if (!uid) return
        if (!mounted) return
        setCurrentUserId(uid)

        const convs: ConversationDto[] = await chatService.listConversations(
          uid,
          1,
          50,
        )
        const unreadList = await chatService.getUnreadByConversation(uid)
        const unreadMap = new Map(
          unreadList.map((i) => [i.conversation_id, i.unread_count]),
        )

        const formatTs = (iso?: string) => {
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
        }

        const items: ConversationItemUI[] = (convs || []).map((c) => {
          const otherId = c.sender_id === uid ? c.receiver_id : c.sender_id
          const last = c.last_message
          const hasNew = (unreadMap.get(c.id) || 0) > 0
          return {
            id: String(c.id),
            conversationId: c.id,
            receiverId: otherId,
            name: c.receiver_name || `User #${otherId}`,
            lastMessage: last?.content || '',
            timestamp: formatTs(last?.timestamp),
            type: 'individual',
            hasNewMessage: hasNew,
          }
        })

        if (mounted) setConversations(items)

        // Refresh global unread count when conversations load
        refreshUnreadCount()
      } catch (e) {
        console.warn('Failed to load conversations', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refreshUnreadCount])

  const filters = [
    { key: 'recent', label: 'Gần đây', icon: 'time-outline' },
    { key: 'unread', label: 'Chưa đọc', icon: 'radio-button-off-outline' },
    { key: 'mentions', label: 'Đề cập', icon: 'at' },
  ]

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchText.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchText.toLowerCase()),
  )

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
