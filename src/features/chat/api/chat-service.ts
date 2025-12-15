import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiClient, API_ORIGIN } from '@/libs/http'
import type {
  ConversationDto,
  ConversationsResponse,
  MessagesResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  UnreadByConversationItem,
  FileUpload,
  UploadChatFileResponse,
} from '../types'

export const chatService = {
  _sanitizeContent(content?: string | null): string {
    if (typeof content !== 'string') return ''
    return content.trim()
  },

  async listConversations(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ) {
    const res: ConversationsResponse = await apiClient.get(
      `/chats/users/${userId}/conversations?page=${page}&limit=${limit}`,
    )
    const conversations = res.data?.conversations ?? res.conversations ?? []
    return conversations
  },

  async getUnreadByConversation(
    userId: number,
  ): Promise<UnreadByConversationItem[]> {
    const res = await apiClient.get(
      `/chats/users/${userId}/unread-by-conversation`,
    )
    // Controller returns { success, data, message }
    return res?.data ?? []
  },

  async getMessages(
    conversationId: number,
    page: number = 1,
    limit: number = 50,
  ): Promise<MessagesResponse> {
    const res = await apiClient.get(
      `/chats/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    )
    const data = (res?.data ?? res) as MessagesResponse
    // Sort by message id ascending (oldest -> newest) and sanitize content
    const cleaned = {
      ...data,
      messages: (data.messages || [])
        .slice()
        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .map((m) => ({
          ...m,
          content: chatService._sanitizeContent(m.content),
        })),
    } as MessagesResponse
    return cleaned
  },

  async sendMessage(
    data: CreateMessageRequest,
  ): Promise<CreateMessageResponse> {
    const res = (await apiClient.post(
      '/chats/messages',
      data,
    )) as CreateMessageResponse
    if (res?.data) {
      res.data.content = chatService._sanitizeContent(res.data.content)
    }
    return res
  },

  async markAsRead(
    conversationId: number,
    userId: number,
    message_ids?: number[],
  ) {
    return apiClient.post(
      `/chats/conversations/${conversationId}/mark-as-read`,
      { user_id: userId, message_ids },
    )
  },

  /**
   * Upload file to chat server
   * Uses native fetch with FormData (same pattern as classService.uploadPostWithFiles)
   * because multipart/form-data requires special handling
   */
  async uploadFile(file: FileUpload): Promise<UploadChatFileResponse> {
    try {
      const formData = new FormData()
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any)
      console.log('Uploading file to chat server:', file.name)
      console.log(formData)
      const token = await AsyncStorage.getItem('accessToken')
      const response = await fetch(`${API_ORIGIN}/api/chats/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      return result.data || result
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  /**
   * Download file from chat server
   */
  async downloadFile(filename: string): Promise<string> {
    try {
      const actualFilename = filename.includes('/')
        ? filename.split('/').pop()
        : filename

      const token = await AsyncStorage.getItem('accessToken')
      const downloadUrl = `${API_ORIGIN}/api/chats/download/${actualFilename}`

      // For mobile, we return the authenticated URL for use with expo-file-system
      return downloadUrl
    } catch (error) {
      console.error('Error preparing file download:', error)
      throw error
    }
  },
}
