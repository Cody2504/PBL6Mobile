// Exam feature types

// Enums
export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  CANCELLED = 'cancelled',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  ESSAY = 'essay',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Core Models
export interface Exam {
  exam_id: number
  class_id: number
  title: string
  description?: string
  duration?: number // minutes (legacy, use total_time)
  total_time?: number // minutes (from API)
  start_time: string // ISO datetime
  end_time: string // ISO datetime
  status: ExamStatus
  total_points?: number
  created_by: number
  created_at: string
  has_password: boolean
  // Student-specific fields
  submission_id?: number
  submission_status?: SubmissionStatus
  remaining_time?: number // seconds
  current_question_order?: number
  score?: number
}

export interface QuestionOption {
  id: string // 'a', 'b', 'c', 'd'
  text: string
  is_correct?: boolean // Only for teachers
}

export interface Question {
  question_id: number
  content: string
  type: QuestionType
  difficulty: QuestionDifficulty
  points: number
  order: number
  is_multiple_answer: boolean
  options?: QuestionOption[] // For MCQ only
  category?: {
    category_id: number
    name: string
  }
  // Student's answer (if exists)
  current_answer?: string
}

export interface Submission {
  submission_id: number
  exam_id: number
  student_id: number
  status: SubmissionStatus
  score?: number
  remaining_time: number // seconds
  current_question_order: number
  submitted_at?: string
  graded_at?: string
  teacher_feedback?: string
}

// API Request/Response Types

// Verify Password
export interface VerifyPasswordRequest {
  password?: string
}

export interface VerifyPasswordResponse {
  success: boolean
  message: string
  data: {
    has_password: boolean
    success?: boolean  // API returns { has_password, success } when verifying password
    verified?: boolean // Alternative field name (for backwards compatibility)
  }
}

// Start Exam
export interface StartExamResponse {
  success: boolean
  message: string
  data: {
    submission_id: number
    exam_id: number
    exam_title: string
    student_id: number
    current_question_order: number
    remaining_time: number // seconds
    total_questions: number
    question: Question
  }
}

// Get Question by Order
export interface GetQuestionResponse {
  success: boolean
  message: string
  data: {
    submission_id: number
    current_question_order: number
    remaining_time: number
    total_questions: number
    question: Question
    existing_answer?: {
      answer_id: number
      answer_content: string
    }
  }
}

// Submit Answer
export interface SubmitAnswerRequest {
  question_id: number
  answer_content: string // MCQ: "a" or '["a","c"]', Essay: text
}

export interface SubmitAnswerResponse {
  success: boolean
  message: string
  data?: {
    answer_id: number
  }
}

// Update Time
export interface UpdateTimeRequest {
  remaining_time: number // seconds
}

export interface UpdateTimeResponse {
  success: boolean
  message: string
}

// Final Submit
export interface FinalSubmitResponse {
  success: boolean
  message: string
  data: {
    submission_id: number
    submitted_at: string
    status: SubmissionStatus
  }
}

// Resume Exam
export interface ResumeExamResponse {
  success: boolean
  message: string
  data: {
    submission_id: number
    exam_id: number
    remaining_time: number
    total_questions: number
    current_question_order: number
    question: Question
  }
}

// Get Student Exams List
export interface GetStudentExamsResponse {
  success: boolean
  message: string
  data: Exam[]
}

// UI-specific types
export interface ExamCardData {
  exam: Exam
  className?: string
  onPress: () => void
}

export interface AnswerState {
  questionId: number
  answer: string
  isSaved: boolean
  lastSavedAt?: Date
}

export interface ExamDraft {
  submissionId: number
  answers: Record<number, string> // questionId -> answer
  lastUpdated: Date
}
