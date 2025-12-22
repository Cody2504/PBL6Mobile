import { Platform } from 'react-native'
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
  UploadMaterialsRequest,
  FileUpload,
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

          // Handle URI format for Android
          // On Android, content:// URIs need to be passed as-is to FormData
          // but we need to ensure the uri format is correct
          let fileUri = file.uri

          // On Android, ensure the URI is in the correct format
          if (Platform.OS === 'android') {
            // If it's a content:// URI, use it directly
            // If it's a file:// URI, use it directly
            // Only add file:// prefix if it's a bare path
            if (!fileUri.startsWith('content://') && !fileUri.startsWith('file://')) {
              fileUri = 'file://' + fileUri
            }
          }

          // React Native FormData expects file objects with uri, name, and type
          const fileToUpload: any = {
            uri: fileUri,
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
      const uploadUrl = `${API_BASE_URL}/classes/${classId}/upload-post-with-files`

      console.log('Uploading to:', uploadUrl)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            // Don't set Content-Type - FormData will set it automatically with boundary
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Upload error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        console.log('Upload successful:', result)
        return result
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Upload timed out. Please check your connection and try again.')
        }
        throw fetchError
      }
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
  },

  async getClassMembers(classId: string): Promise<Student[]> {
    try {
      console.log('🌐 API Call: GET /classes/' + classId + '/students')
      const response = await apiClient.get(`/classes/${classId}/students`)
      console.log('🌐 API Response Data:', JSON.stringify(response.data, null, 2))

      // Extract students array from response
      const studentsData = response.data?.students || []
      console.log('📋 Extracted students:', studentsData)

      // Fetch full user details for each student
      const studentsWithDetails = await Promise.all(
        studentsData.map(async (student: any) => {
          try {
            const userResponse = await apiClient.get(`/users/${student.student_id}`)
            const userData = userResponse.data
            console.log('👤 User data for student_id', student.student_id, ':', userData)

            return {
              user_id: student.student_id,
              user_name: userData.full_name || userData.user_name || 'Unknown User',
              email: userData.email || '',
              avatar: userData.avatar,
              enrolled_at: student.enrolled_at,
            }
          } catch (error) {
            console.error(`Failed to fetch user details for student_id ${student.student_id}:`, error)
            // Return minimal data if user fetch fails
            return {
              user_id: student.student_id,
              user_name: `Student ${student.student_id}`,
              email: '',
              enrolled_at: student.enrolled_at,
            }
          }
        })
      )

      console.log('✅ Final students with details:', studentsWithDetails)
      return studentsWithDetails
    } catch (error) {
      console.error('❌ Error fetching class members:', error)
      throw error
    }
  },

  /**
   * Upload materials/files for a post
   * Uses the same approach as the web frontend (/materials/upload endpoint)
   */
  async uploadMaterials(data: UploadMaterialsRequest): Promise<any> {
    try {
      const formData = new FormData()

      // Append files - React Native style
      for (const file of data.files) {
        console.log('Appending file for upload:', file.name, 'URI:', file.uri)

        // Handle URI format for Android
        let fileUri = file.uri
        if (Platform.OS === 'android') {
          if (!fileUri.startsWith('content://') && !fileUri.startsWith('file://')) {
            fileUri = 'file://' + fileUri
          }
        }

        const fileToUpload: any = {
          uri: fileUri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        }

        formData.append('files', fileToUpload)
      }

      // Append metadata - matching web frontend format
      formData.append('classId', data.classId.toString())
      formData.append('uploaderId', data.uploaderId.toString())
      // Note: Do NOT send 'title' field - the backend should use each file's name
      // Sending a title here overrides all filenames with one value
      if (data.postId) {
        formData.append('postId', data.postId.toString())
      }

      console.log('Uploading materials with FormData:', {
        classId: data.classId,
        uploaderId: data.uploaderId,
        postId: data.postId,
        fileCount: data.files.length,
        fileNames: data.files.map(f => f.name),
      })

      const token = await AsyncStorage.getItem('accessToken')
      const API_BASE_URL = API_ORIGIN + '/api'
      const uploadUrl = `${API_BASE_URL}/materials/upload`

      console.log('Uploading to:', uploadUrl)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            // Don't set Content-Type - FormData will set it automatically with boundary
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Materials upload error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        console.log('Materials upload successful:', result)
        return result
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Upload timed out. Please check your connection and try again.')
        }
        throw fetchError
      }
    } catch (error) {
      console.error('Error uploading materials:', error)
      throw error
    }
  },
}
