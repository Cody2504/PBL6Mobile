export type UserRole = 'admin' | 'teacher' | 'user'
export type UserStatus = 'active' | 'block'

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
      role: UserRole
      status: UserStatus
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
  isValid: boolean
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
