import { apiClient } from '@/libs/http'
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetUserByIdResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UserEmailsRequest,
  UserProfile,
  UsersListResponse,
  ApiUsersListResponse,
  User,
} from '../types'

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
