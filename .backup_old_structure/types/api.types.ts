/**
 * API Types
 * Centralized type definitions for API requests, responses, and errors
 */

// ============================================================
// API Error Class
// ============================================================

/**
 * Custom API Error class with additional context
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly endpoint: string
  public readonly timestamp: Date

  constructor(message: string, statusCode: number, endpoint: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.endpoint = endpoint
    this.timestamp = new Date()

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401
  }

  get isForbidden(): boolean {
    return this.statusCode === 403
  }

  get isNotFound(): boolean {
    return this.statusCode === 404
  }

  get isServerError(): boolean {
    return this.statusCode >= 500
  }

  get isNetworkError(): boolean {
    return this.statusCode === 0
  }
}

// ============================================================
// Response Wrappers
// ============================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================
// Request Options
// ============================================================

export interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  skipAuth?: boolean
}

// ============================================================
// Auth Types
// ============================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseData {
  success: boolean
  user: {
    user_id: number
    full_name: string
    email: string
    phone: string | null
    address: string | null
    dateOfBirth: string | null
    gender: string | null
    avatar: string | null
    role: string
    status: string
    created_at: string
    updated_at: string
  }
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: LoginResponseData
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface VerifyCodeResponse {
  success: boolean
  message: string
  is_valid: boolean
}

export interface ResetPasswordRequest {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface RegisterRequest {
  email: string
  full_name: string
  password: string
  role?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
}

// ============================================================
// Profile Types
// ============================================================

export interface UpdateProfileRequest {
  full_name?: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: string | null
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserProfileResponse {
  success: boolean
  message: string
  data: {
    user_id: number
    full_name: string
    email: string
    phone: string | null
    address: string | null
    dateOfBirth: string | null
    gender: string | null
    avatar: string | null
    role: string
    status: string
    created_at: string
    updated_at: string
  }
}

// ============================================================
// Class/Team Types
// ============================================================

export interface CreateClassRequest {
  class_name: string
  description?: string
}

export interface JoinClassRequest {
  class_code: string
}

export interface AddStudentsRequest {
  studentIds: number[]
}

// ============================================================
// Chat Types
// ============================================================

export interface SendMessageRequest {
  content: string
  messageType?: 'text' | 'image' | 'file'
}

export interface ConversationsResponse {
  success: boolean
  message: string
  data?: {
    conversations: ConversationDto[]
    page: number
    limit: number
    total: number
    totalPages: number
  }
  conversations?: ConversationDto[]
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

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
    message_type: string
    content?: string | null
  } | null
}

export interface MessagesResponse {
  success: boolean
  message: string
  data?: {
    messages: MessageDto[]
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  messages?: MessageDto[]
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  hasMore?: boolean
}

export interface MessageDto {
  id: number
  sender_id: number
  conversation_id: number
  content: string | null
  message_type: string
  timestamp: string
  is_read: boolean
}

// ============================================================
// Chatbot Types
// ============================================================

export interface SendChatbotMessageParams {
  message: string
  threadId?: string
}
