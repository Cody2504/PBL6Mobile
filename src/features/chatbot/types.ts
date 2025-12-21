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
  userRole: 'student' | 'teacher'  // Backend only accepts these values
  files?: any[]
}
