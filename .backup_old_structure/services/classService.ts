import { apiClient } from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface CreateClassRequest {
  class_name: string
  class_code: string
  description?: string
  teacher_id: number
}

export interface UpdateClassRequest {
  class_id: string
  class_name: string
  class_code: string
  description?: string
}

export interface Class {
  class_id: string
  class_name: string
  class_code: string
  description?: string
  teacher_id?: string
  created_at?: string
}

export interface ClassFullInfo {
  class_id: string
  class_name: string
  class_code: string
  description?: string
  teacher_id?: string
  created_at?: string
  posts: Post[]
}

export interface Student {
  user_id: string | number
  user_name: string
  email: string
}

export interface Post {
  id: number
  class_id: number
  parent_id: number | null
  title: string
  message: string
  sender_id: number
  created_at: string
  materials?: Material[]
}

export interface Material {
  material_id: number
  post_id: number | null
  title: string
  file_url: string
  uploaded_by: number
  uploaded_at: string
  type: 'document' | 'image' | 'video' | 'audio' | 'other'
  file_size: number | null
}

export interface UserInfo {
  id: number
  email: string
  firstName?: string
  lastName?: string
  user_id?: string | number
  user_name?: string
}

export interface AddStudentsRequest {
  class_id: number
  students: UserInfo[]
}

export interface JoinClassRequest {
  user_id: number
}

export interface RemoveStudentRequest {
  class_id: number
  user_id: number
}

export interface FileUpload {
  uri: string
  name: string
  size?: number
  mimeType?: string
}

export interface UploadPostWithFilesRequest {
  uploader_id: number
  class_id: number
  title: string
  message: string
  files?: FileUpload[]
}

export interface UploadPostWithFilesResponse {
  success: boolean
  message: string
  data: Post
}

export interface AddPostRequest {
  class_id: number
  sender_id: number
  message: string
  title?: string
  parent_id?: number
}

export interface AddPostResponse {
  message: string
  data: Post
}

class ClassService {
  async createClass(data: CreateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.post('/classes/create', data)
      return response.data
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  }

  async getAllClasses(): Promise<Class[]> {
    try {
      const response = await apiClient.get('/classes')
      return response.data
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  }

  async getClassById(classId: string): Promise<ClassFullInfo> {
    try {
      const response = await apiClient.get(`/classes/${classId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching class by ID:', error)
      throw error
    }
  }

  async updateClass(data: UpdateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.put(`/classes/${data.class_id}`, {
        class_name: data.class_name,
        description: data.description,
        class_code: data.class_code,
      })
      return response.data
    } catch (error) {
      console.error('Error updating class:', error)
      throw error
    }
  }

  async deleteClass(id: string): Promise<void> {
    try {
      await apiClient.delete(`/classes/${id}`)
    } catch (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  }

  async addStudentsToClass(data: AddStudentsRequest): Promise<Student[]> {
    try {
      console.log(data)
      const response = await apiClient.post('/classes/add-students', data)
      return response.data
    } catch (error) {
      console.error('Error adding students to class:', error)
      throw error
    }
  }

  async joinClassWithCode(
    classCode: string,
    data: JoinClassRequest,
  ): Promise<void> {
    try {
      const response = await apiClient.post(
        `/classes/${classCode}/joinclass`,
        data,
      )
      return response.data
    } catch (error) {
      console.error('Error joining class with code:', error)
      throw error
    }
  }

  async removeStudentFromClass(classId: number, userId: number): Promise<void> {
    try {
      const response = await apiClient.delete(
        `/classes/${classId}/students/${userId}`,
      )
      return response.data
    } catch (error) {
      console.error('Error removing student from class:', error)
      throw error
    }
  }

  async getClassesByUserRole(
    role: 'teacher' | 'student',
    userId: number,
  ): Promise<Class[]> {
    try {
      const response = await apiClient.get(`/classes/of/${role}/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching classes for ${role}:`, error)
      throw error
    }
  }

  async uploadPostWithFiles(
    classId: number,
    data: UploadPostWithFilesRequest,
  ): Promise<UploadPostWithFilesResponse> {
    try {
      const formData = new FormData()

      formData.append('uploader_id', data.uploader_id.toString())
      formData.append('title', data.title)
      formData.append('message', data.message)

      // Append files if they exist
      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          console.log('Appending file:', file.name, 'URI:', file.uri)

          // React Native FormData expects file objects with uri, name, and type
          const fileToUpload: any = {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream',
          }

          formData.append('files', fileToUpload)
        }
      }

      console.log('FormData prepared with', data.files?.length || 0, 'files')
      console.log(formData)
      // Use fetch directly for multipart/form-data
      const token = await AsyncStorage.getItem('accessToken')
      const API_BASE_URL = 'http://192.168.2.81:3000/api'

      const response = await fetch(
        `${API_BASE_URL}/classes/${classId}/upload-post-with-files`,
        {
          method: 'POST',
          headers: {
            // Don't set Content-Type - FormData will set it automatically with boundary
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      return result
    } catch (error) {
      console.error('Error uploading post with files:', error)
      throw error
    }
  }

  async addNewPost(data: AddPostRequest): Promise<AddPostResponse> {
    try {
      const response = await apiClient.post('/classes/add-new-post', data)
      return response.data
    } catch (error) {
      console.error('Error adding new post:', error)
      throw error
    }
  }

  async getMaterials(classId: string): Promise<Material[]> {
    try {
      const response = await apiClient.get(
        `/classes/${classId}/get-all-materials`,
      )
      return response.data
    } catch (error) {
      console.error('Error fetching materials:', error)
      throw error
    }
  }
}

export const classService = new ClassService()
