export type MessageType = 'text' | 'image' | 'file'

export interface ConversationDto {
  id: number
  sender_id: number
  receiver_id: number
  receiver_name?: string | null
  receiver_avatar?: string | null
  unread_count?: number
  last_message?: {
    id: number
    sender_id: number
    timestamp: string
    message_type: MessageType
    content?: string | null
  } | null
}

export interface ConversationsResponse {
  success?: boolean
  conversations?: ConversationDto[]
  data?: {
    conversations?: ConversationDto[]
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

export interface MessagesResponse {
  success: boolean
  messages: Array<{
    id: number
    sender_id: number
    conversation_id: number
    timestamp: string
    message_type: MessageType
    content?: string | null
    is_read?: boolean
    file_url?: string
    file_name?: string
    file_size?: number
    mime_type?: string
  }>
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CreateMessageRequest {
  sender_id: number
  conversation_id: number
  message_type?: MessageType
  content?: string
  file_url?: string
  file_name?: string
  file_size?: number
  mime_type?: string
}

export interface CreateMessageResponse {
  success: boolean
  message?: string
  data: {
    id: number
    sender_id: number
    conversation_id: number
    timestamp: string
    message_type: MessageType
    content?: string | null
    is_read?: boolean
    file_url?: string
    file_name?: string
    file_size?: number
    mime_type?: string
  }
}

export interface UnreadByConversationItem {
  conversation_id: number
  unread_count: number
}

// File upload types
export interface FileUpload {
  uri: string
  name: string
  size?: number
  mimeType?: string
}

export interface UploadChatFileResponse {
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
}
