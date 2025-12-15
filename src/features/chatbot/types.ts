export interface ChatbotMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface SendChatbotMessageParams {
  threadId: string
  message: string
  userId: number
  userRole: 'teacher' | 'user' | 'admin'
  files?: any[]
}
