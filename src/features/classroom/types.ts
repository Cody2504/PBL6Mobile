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

export interface UploadMaterialsRequest {
  classId: number
  files: FileUpload[]
  uploaderId: number
  title?: string
  postId?: number
}
