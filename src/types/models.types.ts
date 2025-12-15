/**
 * Domain Model Types
 * Centralized type definitions for all domain entities
 */

// ============================================================
// User Types
// ============================================================

export type UserRole = 'teacher' | 'user' | 'admin'
export type UserStatus = 'active' | 'inactive' | 'banned'

/**
 * User model for authenticated user data
 */
export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  avatar?: string | null
  role: string
  status: string
}

/**
 * User profile data from API
 */
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

// ============================================================
// Class/Team Types
// ============================================================

/**
 * Class/Team basic info
 */
export interface Class {
  class_id: number
  class_name: string
  class_code: string
  teacher_id: number
  description?: string
  created_at: string
  updated_at: string
}

/**
 * Class with full info including members
 */
export interface ClassFullInfo extends Class {
  teacher?: UserProfile
  students?: ClassStudent[]
  studentCount?: number
}

/**
 * Student in a class
 */
export interface ClassStudent {
  student_id: number
  user_id: number
  class_id: number
  joined_at: string
  user?: UserProfile
}

/**
 * Classroom display model (transformed for UI)
 */
export interface Classroom {
  id: number
  name: string
  code: string
  role: 'teacher' | 'student'
  teacherName?: string
  studentCount?: number
  avatarColor?: string
  avatarText?: string
}

// ============================================================
// Post Types
// ============================================================

export type PostType = 'announcement' | 'assignment' | 'material' | 'comment'

/**
 * Post/Announcement model
 */
export interface Post {
  id: number
  class_id: number
  parent_id: number | null
  title: string
  message: string
  sender_id: number
  created_at: string
  updated_at?: string
  materials?: Material[]
  type?: PostType
}

/**
 * Post with user info for display
 */
export interface PostWithUser extends Post {
  senderName?: string
  senderEmail?: string
  senderAvatar?: string | null
}

// ============================================================
// Material/File Types
// ============================================================

export type MaterialType =
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'spreadsheet'
  | 'presentation'
  | 'archive'
  | 'other'

/**
 * Material/Attachment model
 */
export interface Material {
  material_id: number
  post_id: number | null
  title: string
  file_url: string
  uploaded_by: number
  uploaded_at: string
  type?: string
  file_size?: number | null
}

// ============================================================
// Assignment Types
// ============================================================

export type AssignmentStatus = 'upcoming' | 'overdue' | 'completed'

/**
 * Assignment model
 */
export interface Assignment {
  id: number
  class_id: number
  title: string
  description?: string
  due_date: string
  points?: number
  created_at: string
  updated_at?: string
}

/**
 * Assignment with submission info
 */
export interface AssignmentWithSubmission extends Assignment {
  submitted_at?: string
  status: AssignmentStatus
  groupName?: string
}

// ============================================================
// Chat/Message Types
// ============================================================

export type MessageType = 'text' | 'image' | 'file'

/**
 * Chat message model
 */
export interface Message {
  id: number
  sender_id: number
  conversation_id: number
  content: string | null
  message_type: MessageType
  timestamp: string
  is_read: boolean
}

/**
 * Conversation summary
 */
export interface Conversation {
  id: number
  sender_id: number
  receiver_id: number
  receiver_name?: string | null
  receiver_avatar?: string | null
  unread_count?: number
  last_message?: {
    id: number
    sender_id: number
    timestamp: string
    message_type: MessageType
    content?: string | null
  } | null
}

// ============================================================
// Activity Types
// ============================================================

export type ActivityType =
  | 'post'
  | 'assignment'
  | 'comment'
  | 'material'
  | 'grade'

/**
 * Activity feed item
 */
export interface Activity {
  id: number
  type: ActivityType
  title: string
  description?: string
  class_id: number
  class_name?: string
  created_at: string
  sender_id?: number
  sender_name?: string
}

// ============================================================
// Notification Types
// ============================================================

export type NotificationType =
  | 'message'
  | 'assignment'
  | 'grade'
  | 'announcement'
  | 'system'

/**
 * Notification model
 */
export interface Notification {
  id: number
  type: NotificationType
  title: string
  body: string
  is_read: boolean
  created_at: string
  data?: Record<string, unknown>
}
