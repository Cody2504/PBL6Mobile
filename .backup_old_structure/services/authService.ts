import { apiClient } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
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
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  success: boolean
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface VerifyCodeResponse {
  message: string
  success: boolean
  is_valid: boolean
}

export interface ResetPasswordRequest {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

export interface RegisterRequest {
  email: string
  full_name: string
  password: string
  role?: string
}

export interface RegisterResponse {
  message: string
  success: boolean
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post('/users/login', data)
  },

  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return apiClient.post('/users/forgot-password', data)
  },

  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    return apiClient.post('/users/verify-code', data)
  },

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    return apiClient.post('/users/reset-password', data)
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post('/users/create', data)
  },
}
