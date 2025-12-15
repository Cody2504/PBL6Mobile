import { apiClient, API_ORIGIN } from '@/libs/http'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {
  CreateClassRequest,
  UpdateClassRequest,
  Class,
  ClassFullInfo,
  Student,
  Material,
  AddStudentsRequest,
  JoinClassRequest,
  UploadPostWithFilesRequest,
  UploadPostWithFilesResponse,
  AddPostRequest,
  AddPostResponse,
} from '../types'

export const classService = {
  async createClass(data: CreateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.post('/classes/create', data)
      return response.data
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  },

  async getAllClasses(): Promise<Class[]> {
    try {
      const response = await apiClient.get('/classes')
      return response.data
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  async getClassById(classId: string): Promise<ClassFullInfo> {
    try {
      const response = await apiClient.get(`/classes/${classId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching class by ID:', error)
      throw error
    }
  },

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
  },

  async deleteClass(id: string): Promise<void> {
    try {
      await apiClient.delete(`/classes/${id}`)
    } catch (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  },

  async addStudentsToClass(data: AddStudentsRequest): Promise<Student[]> {
    try {
      console.log(data)
      const response = await apiClient.post('/classes/add-students', data)
      return response.data
    } catch (error) {
      console.error('Error adding students to class:', error)
      throw error
    }
  },

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
  },

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
  },

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
  },

  /**
   * Upload post with files using multipart/form-data
   *
   * ARCHITECTURE NOTE: This method uses native `fetch` instead of `apiClient` because it requires
   * FormData with file uploads. The Content-Type header must be automatically set by the browser/
   * React Native with the correct multipart boundary, which apiClient doesn't currently support.
   */
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
      const API_BASE_URL = API_ORIGIN + '/api'

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
  },

  async addNewPost(data: AddPostRequest): Promise<AddPostResponse> {
    try {
      const response = await apiClient.post('/classes/add-new-post', data)
      return response.data
    } catch (error) {
      console.error('Error adding new post:', error)
      throw error
    }
  },

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
