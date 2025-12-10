import { apiClient, API_ORIGIN } from './api';

export type MessageType = 'text' | 'image' | 'file';

export interface ConversationDto {
  id: number;
  sender_id: number;
  receiver_id: number;
  receiver_name?: string | null;
  receiver_avatar?: string | null;
  unread_count?: number;
  last_message?: {
    id: number;
    sender_id: number;
    timestamp: string;
    message_type: MessageType;
    content?: string | null;
  } | null;
}

export interface ConversationsResponse {
  success?: boolean;
  conversations?: ConversationDto[];
  data?: {
    conversations?: ConversationDto[];
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface MessagesResponse {
  success: boolean;
  messages: Array<{
    id: number;
    sender_id: number;
    conversation_id: number;
    timestamp: string;
    message_type: MessageType;
    content?: string | null;
    is_read?: boolean;
  }>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateMessageRequest {
  sender_id: number;
  conversation_id: number;
  message_type?: MessageType;
  content?: string;
}

export interface CreateMessageResponse {
  success: boolean;
  message?: string;
  data: {
    id: number;
    sender_id: number;
    conversation_id: number;
    timestamp: string;
    message_type: MessageType;
    content?: string | null;
    is_read?: boolean;
  };
}

export interface UnreadByConversationItem {
  conversation_id: number;
  unread_count: number;
}

export const chatService = {
  _sanitizeContent(content?: string | null): string {
    if (typeof content !== 'string') return '';
    return content.trim();
  },

  async listConversations(userId: number, page: number = 1, limit: number = 20) {
    const res: ConversationsResponse = await apiClient.get(`/chats/users/${userId}/conversations?page=${page}&limit=${limit}`);
    const conversations = res.data?.conversations ?? res.conversations ?? [];
    return conversations;
  },

  async getUnreadByConversation(userId: number): Promise<UnreadByConversationItem[]> {
    const res = await apiClient.get(`/chats/users/${userId}/unread-by-conversation`);
    // Controller returns { success, data, message }
    return res?.data ?? [];
  },

  async getMessages(conversationId: number, page: number = 1, limit: number = 50): Promise<MessagesResponse> {
    const res = await apiClient.get(`/chats/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    const data = (res?.data ?? res) as MessagesResponse;
    // Sort by message id ascending (oldest -> newest) and sanitize content
    const cleaned = {
      ...data,
      messages: (data.messages || [])
        .slice()
        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .map((m) => ({ ...m, content: chatService._sanitizeContent(m.content) })),
    } as MessagesResponse;
    return cleaned;
  },

  async sendMessage(data: CreateMessageRequest): Promise<CreateMessageResponse> {
    const res = (await apiClient.post('/chats/messages', data)) as CreateMessageResponse;
    if (res?.data) {
      res.data.content = chatService._sanitizeContent(res.data.content);
    }
    return res;
  },

  async markAsRead(conversationId: number, userId: number, message_ids?: number[]) {
    return apiClient.post(`/chats/conversations/${conversationId}/mark-as-read`, { user_id: userId, message_ids });
  },
};
