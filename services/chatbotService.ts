import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ORIGIN } from './api';

export interface ChatbotMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface SendChatbotMessageParams {
  threadId: string;
  message: string;
  userId: number;
  userRole: 'teacher' | 'user' | 'admin';
  files?: any[];
}

export const chatbotService = {
  async sendMessage(
    params: SendChatbotMessageParams,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const { threadId, message, userId, userRole, files = [] } = params;

    const formData = new FormData();
    formData.append('threadID', threadId);
    formData.append('userMessage', message);
    formData.append('user_id', userId.toString());
    formData.append('user_role', userRole);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const token = await AsyncStorage.getItem('accessToken');
    const headers: any = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_ORIGIN}/api/chatbot/chat`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      if (onChunk) {
        onChunk(chunk);
      }
    }

    return fullResponse;
  },

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_ORIGIN}/api/chatbot/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
