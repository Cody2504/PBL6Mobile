// API response types
export interface Exam {
  exam_id: number
  class_id: number
  title: string
  description?: string
  total_time?: number // Duration in minutes
  start_time: string // ISO datetime
  end_time: string // ISO datetime
  status: ExamStatus
  created_by: number
  created_at: string
  total_points?: number
  password?: string
  // Student-specific fields
  submissions?: {
    submission_id: number
    status: string
    score: number | null
    submitted_at: string | null
    remaining_time: number
    current_question_order: number
  }[]
  question_exams?: any[]
  _count?: {
    submissions: number
  }
}

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Transformed for calendar display
export interface CalendarEvent {
  id: string
  examId: number
  title: string
  startTime: string
  endTime: string
  date: string // YYYY-MM-DD
  isTeacherExam: boolean
  status: ExamStatus
  classId: number
  duration?: number
  totalPoints?: number
  submissionStatus?: 'in_progress' | 'submitted' | 'graded' // Student submission status
}

// Calendar UI types
export interface DayData {
  date: Date
  dateString: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: CalendarEvent[]
  eventCount: number
}

export interface MonthData {
  year: number
  month: number // 0-11
  firstDay: Date
  lastDay: Date
  daysInMonth: number
}

// Pagination metadata
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Response types - Backend returns { data, pagination } directly (not wrapped)
export interface GetExamsResponse {
  data: Exam[]
  pagination: PaginationMeta
}

export interface GetExamDetailResponse {
  data: Exam
}

// Query params for filtering exams
export interface ExamFilterParams {
  search?: string
  status?: ExamStatus
  start_time?: string // ISO datetime
  end_time?: string // ISO datetime
  page?: number
  limit?: number
}

export interface CreateExamRequest {
  class_id: number
  title: string
  description?: string
  total_time?: number // Backend expects total_time, not duration (in minutes)
  start_time: string
  end_time: string
  total_points?: number
  password?: string
  created_by?: number
  status?: ExamStatus
  questions?: {
    question_id: number
    order: number
    points: number
  }[]
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {
  status?: ExamStatus
}
