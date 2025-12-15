export interface UserProfile {
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

export interface User {
  user_id: string | number
  user_name: string
  full_name: string
  email: string
  avatar?: string | null
  role?: string
  status?: string
}

export interface UsersListResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface ApiUsersListResponse {
  success: boolean
  message: string
  data: {
    users: UserProfile[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UpdateProfileRequest {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

export interface GetProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

export interface UserEmailsRequest {
  userEmails: string[]
}

export interface UserEmailsResponse {
  success: boolean
  message: string
  data: UserProfile[]
}

export interface GetUserByIdResponse {
  success: boolean
  message: string
  data: UserProfile
}
