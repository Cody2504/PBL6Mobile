// API response types
export interface Exam {
  exam_id: number
  class_id: number
  title: string
  description?: string
  duration?: number
  start_time: string // ISO datetime
  end_time: string // ISO datetime
  status: ExamStatus
  created_by: number
  created_at: string
  total_points?: number
  password?: string
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

// API Response types
export interface GetExamsResponse {
  success: boolean
  message: string
  data: Exam[]
}

export interface GetExamDetailResponse {
  success: boolean
  message: string
  data: Exam
}

export interface CreateExamRequest {
  class_id: number
  title: string
  description?: string
  duration?: number
  start_time: string
  end_time: string
  total_points?: number
  password?: string
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {
  status?: ExamStatus
}
