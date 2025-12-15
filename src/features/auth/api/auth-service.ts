import { apiClient } from '@/libs/http'
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types'

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
