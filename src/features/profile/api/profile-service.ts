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

  async uploadAvatar(file: {
    uri: string
    name: string
    type: string
  }): Promise<UpdateProfileResponse> {
    const formData = new FormData()
    formData.append('avatar', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any)

    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
      const token = await AsyncStorage.getItem('accessToken')
      const API_BASE_URL = 'http://192.168.2.81:3000/api'

      const response = await fetch(`${API_BASE_URL}/users/profile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  },
}
