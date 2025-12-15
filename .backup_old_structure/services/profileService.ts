import { apiClient } from './api'

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

export const profileService = {
  async getProfile(): Promise<GetProfileResponse> {
    return apiClient.get('/users/profile')
  },

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    return apiClient.patch('/users/profile', data)
  },

  async getUserById(userId: number): Promise<GetUserByIdResponse> {
    return apiClient.get(`/users/${userId}`)
  },

  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return apiClient.put('/users/change-password', data)
  },

  async getUserProfilesMatchEmails(
    data: UserEmailsRequest,
  ): Promise<UserProfile> {
    return apiClient.post('/users/get-list-profile-match-email', data)
  },

  async updateUserProfile(
    userId: number,
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    return apiClient.patch(`/users/${userId}/profile`, data)
  },

  async getUsers(
    page: number = 1,
    limit: number = 10,
    text?: string,
  ): Promise<UsersListResponse> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (text) {
      params.append('text', text)
    }

    try {
      const response: ApiUsersListResponse = await apiClient.get(
        `/users/list?${params.toString()}`,
      )

      // Transform API response to match expected format
      const transformedUsers: User[] = response.data.users.map((user) => ({
        user_id: user.user_id.toString(),
        user_name: user.full_name,
        full_name: user.full_name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
      }))

      return {
        data: transformedUsers,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
        },
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },
}
