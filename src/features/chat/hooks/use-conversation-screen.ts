import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { Alert, ScrollView } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as Haptics from 'expo-haptics'
import { chatService } from '@/features/chat'
import { getChatSocket } from '@/libs/http'
import { profileService } from '@/features/profile'
import { useChatNotification } from '@/global/context/ChatNotificationContext'
import type { FileUpload } from '../types'

interface Message {
  id: string
  text: string
  timestamp: Date
  isSent: boolean
  hasAttachment?: boolean
  attachmentName?: string
  attachmentSize?: string
  attachmentType?: 'document' | 'image'
}

export function useConversationScreen() {
  const params = useLocalSearchParams()
  const contactName = (params.contactName as string) || 'User'
  const contactEmail = (params.contactEmail as string) || ''
  const conversationId = params.conversationId
    ? parseInt(params.conversationId as string)
    : undefined
  const propUserId = params.currentUserId
    ? parseInt(params.currentUserId as string)
    : undefined
  const otherUserId = params.receiverId
    ? parseInt(params.receiverId as string)
    : undefined

  const [messageText, setMessageText] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<number | null>(propUserId ?? null)
  const messageIdsRef = useRef<Set<string>>(new Set())

  // File upload state
  const [attachedFile, setAttachedFile] = useState<FileUpload | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Pull to refresh
  const [refreshing, setRefreshing] = useState(false)

  // Chat notification context
  const { setActiveConversationId, refreshUnreadCount, updateParticipantName } = useChatNotification()

  const sanitize = (content?: string | null) => {
    if (typeof content !== 'string') return ''
    return content.trim()
  }

  // Get user profile
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!userId) {
          const profile = await profileService.getProfile()
          if (!mounted) return
          setUserId(profile?.data?.user_id ?? null)
        }
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [propUserId])

  // Load messages and setup socket
  useEffect(() => {
    let mounted = true
    let sock: ReturnType<typeof getChatSocket> | null = null
    ;(async () => {
      if (!conversationId) return

      // Set active conversation to prevent notifications
      setActiveConversationId(conversationId)

      try {
        // Load messages
        const data = await chatService.getMessages(conversationId, 1, 50)
        console.log(data)
        if (!mounted) return
        const msgs: Message[] = data.messages.map((m) => ({
          id: String(m.id),
          text: sanitize(m.content),
          timestamp: new Date(m.timestamp),
          isSent: userId ? m.sender_id === userId : false,
          hasAttachment: !!m.file_url,
          attachmentName: m.file_name,
          attachmentSize: formatFileSize(m.file_size),
          attachmentType: m.mime_type?.startsWith('image/')
            ? 'image'
            : 'document',
        }))
        setMessages(msgs)
        messageIdsRef.current = new Set(msgs.map((m) => m.id))

        // Mark as read and refresh unread count
        if (userId) {
          try {
            await chatService.markAsRead(conversationId, userId)
            // Refresh global unread count after marking as read
            refreshUnreadCount()
          } catch {}
        }

        // Cache participant name for notifications
        if (otherUserId && contactName) {
          updateParticipantName(otherUserId, contactName)
        }

        // Connect socket
        if (userId) {
          sock = getChatSocket(userId)
          // Join conversation room
          sock.emit('conversation:join', {
            conversation_id: conversationId,
            user_id: userId,
          })

          // Receive incoming messages (ignore own-sent to prevent duplicates)
          sock.on('message:received', (payload: any) => {
            if (payload?.conversation_id !== conversationId) return
            if (payload?.sender_id === userId) return // don't render own sends from socket
            const idStr = payload?.id ? String(payload.id) : `ts-${Date.now()}`
            if (payload?.id && messageIdsRef.current.has(String(payload.id)))
              return
            const msg: Message = {
              id: idStr,
              text: sanitize(payload?.content),
              timestamp: new Date(
                payload?.timestamp || new Date().toISOString(),
              ),
              isSent: false,
              hasAttachment: !!payload?.file_url,
              attachmentName: payload?.file_name,
              attachmentSize: formatFileSize(payload?.file_size),
              attachmentType: payload?.mime_type?.startsWith('image/')
                ? 'image'
                : 'document',
            }
            setMessages((prev) => {
              if (payload?.id) messageIdsRef.current.add(String(payload.id))
              return [...prev, msg]
            })
          })
        }
      } catch (e) {
        console.warn('Failed to init conversation', e)
      }
    })()

    return () => {
      mounted = false
      // Clear active conversation when leaving
      setActiveConversationId(null)
      try {
        if ((sock as any)?.off) {
          ;(sock as any).off('message:received')
        }
      } catch {}
    }
  }, [conversationId, userId, setActiveConversationId, refreshUnreadCount, updateParticipantName, otherUserId, contactName])

  const formatMessageDate = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)

    const isSameDay = messageDate.toDateString() === now.toDateString()
    const isYesterday =
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
      messageDate.toDateString()

    if (isSameDay) {
      return messageDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (isYesterday) {
      return 'Hôm qua'
    } else {
      return messageDate.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
    }
  }

  const formatDateHeader = (date: Date) => {
    return `ngày ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      const kb = bytes / 1024
      return `${kb.toFixed(1)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  // File handling
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (result.canceled) return

      const file = result.assets[0]
      const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

      if ((file.size || 0) > MAX_FILE_SIZE) {
        Alert.alert('File quá lớn', 'Kích thước file tối đa là 50MB')
        return
      }

      setAttachedFile({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      })
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (error) {
      console.error('Error selecting file:', error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Lỗi', 'Không thể chọn file')
    }
  }, [])

  const handleRemoveFile = useCallback(() => {
    setAttachedFile(null)
  }, [])

  const handleDownloadFile = useCallback(async (message: Message) => {
    // For now, just log - full implementation would use expo-file-system
    console.log('Download file:', message.attachmentName)
    Alert.alert('Tải file', `Đang tải: ${message.attachmentName}`)
  }, [])

  const sendMessageWithFile = useCallback(async () => {
    if (!userId || !conversationId || !attachedFile) return

    try {
      setIsUploading(true)
      console.log(attachedFile)

      // Step 1: Upload file
      const uploadResult = await chatService.uploadFile(attachedFile)

      // Step 2: Send message with file metadata
      const messageContent = messageText.trim() || attachedFile.name
      const payload = {
        sender_id: userId,
        conversation_id: conversationId,
        content: messageContent,
        message_type: 'file' as const,
        file_url: uploadResult.file_url,
        file_name: uploadResult.file_name,
        file_size: uploadResult.file_size,
        mime_type: uploadResult.mime_type,
        client_id: `client-${Date.now()}`,
      }
      // Broadcast via socket
      getChatSocket(userId).emit('message:send', payload)

      // Persist via API
      const res = await chatService.sendMessage({
        sender_id: userId,
        conversation_id: conversationId,
        content: messageContent,
        message_type: 'file',
        file_url: uploadResult.file_url,
        file_name: uploadResult.file_name,
        file_size: uploadResult.file_size,
        mime_type: uploadResult.mime_type,
      })

      const saved = res?.data
      if (saved) {
        const msg: Message = {
          id: String(saved.id),
          text: sanitize(saved.content),
          timestamp: new Date(saved.timestamp),
          isSent: true,
          hasAttachment: true,
          attachmentName: uploadResult.file_name,
          attachmentSize: formatFileSize(uploadResult.file_size),
          attachmentType: uploadResult.mime_type?.startsWith('image/')
            ? 'image'
            : 'document',
        }
        setMessages((prev) => {
          if (!messageIdsRef.current.has(msg.id)) {
            messageIdsRef.current.add(msg.id)
            return [...prev, msg]
          }
          return prev
        })
      }

      setMessageText('')
      setAttachedFile(null)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (error) {
      console.error('Error sending file:', error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Lỗi', 'Không thể gửi file. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }, [userId, conversationId, attachedFile, messageText])

  const sendMessage = async () => {
    if (!messageText.trim() || !userId || !conversationId) return
    const payload = {
      sender_id: userId,
      conversation_id: conversationId,
      content: messageText.trim(),
      message_type: 'text' as const,
      client_id: `client-${Date.now()}`,
    }
    try {
      // Broadcast to others (we will not render this locally)
      getChatSocket(userId).emit('message:send', payload)
      // Persist via API and render only server response
      const res = await chatService.sendMessage({
        sender_id: userId,
        conversation_id: conversationId,
        content: messageText.trim(),
        message_type: 'text',
      })
      const saved = res?.data
      if (saved) {
        const msg: Message = {
          id: String(saved.id),
          text: sanitize(saved.content),
          timestamp: new Date(saved.timestamp),
          isSent: true,
        }
        setMessages((prev) => {
          if (!messageIdsRef.current.has(msg.id)) {
            messageIdsRef.current.add(msg.id)
            return [...prev, msg]
          }
          return prev
        })
      }
      setMessageText('')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (e) {
      console.warn('Failed to send message', e)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const onRefresh = useCallback(async () => {
    if (!conversationId) return
    setRefreshing(true)
    try {
      const data = await chatService.getMessages(conversationId, 1, 50)
      const msgs: Message[] = data.messages.map((m) => ({
        id: String(m.id),
        text: sanitize(m.content),
        timestamp: new Date(m.timestamp),
        isSent: userId ? m.sender_id === userId : false,
        hasAttachment: !!m.file_url,
        attachmentName: m.file_name,
        attachmentSize: formatFileSize(m.file_size),
        attachmentType: m.mime_type?.startsWith('image/') ? 'image' : 'document',
      }))
      setMessages(msgs)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (e) {
      console.warn('Failed to refresh messages', e)
    } finally {
      setRefreshing(false)
    }
  }, [conversationId, userId])

  return {
    // Data
    contactName,
    contactEmail,
    conversationId,
    messageText,
    messages,
    scrollViewRef,
    attachedFile,
    isUploading,
    refreshing,

    // Functions
    setMessageText,
    sendMessage,
    sendMessageWithFile,
    handleBack,
    formatMessageDate,
    formatDateHeader,
    handleFileSelect,
    handleRemoveFile,
    handleDownloadFile,
    formatFileSize,
    onRefresh,
  }
}
