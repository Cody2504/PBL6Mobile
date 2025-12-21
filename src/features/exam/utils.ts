import { Exam, ExamStatus, SubmissionStatus } from './types'

/**
 * Get exam duration in minutes
 * Handles both total_time (from API) and legacy duration fields
 * @param exam - Exam object
 * @returns Duration in minutes
 */
export function getExamDuration(exam: Exam): number {
  return exam.total_time ?? exam.duration ?? 0
}

/**
 * Format seconds to MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return '00:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get human-readable exam status text
 * @param status - Exam status enum value
 * @returns Localized status text
 */
export function getExamStatusText(status: ExamStatus): string {
  switch (status) {
    case ExamStatus.DRAFT:
      return 'Nháp'
    case ExamStatus.PUBLISHED:
      return 'Đã công bố'
    case ExamStatus.IN_PROGRESS:
      return 'Đang diễn ra'
    case ExamStatus.COMPLETED:
      return 'Đã kết thúc'
    case ExamStatus.CANCELLED:
      return 'Đã hủy'
    default:
      return status
  }
}

/**
 * Get human-readable submission status text
 * @param status - Submission status enum value
 * @returns Localized status text
 */
export function getSubmissionStatusText(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.IN_PROGRESS:
      return 'Đang làm'
    case SubmissionStatus.SUBMITTED:
      return 'Đã nộp'
    case SubmissionStatus.GRADED:
      return 'Đã chấm'
    case SubmissionStatus.CANCELLED:
      return 'Đã hủy'
    default:
      return status
  }
}

/**
 * Check if exam is currently accessible (within time window)
 * @param startTime - Exam start time (ISO string)
 * @param endTime - Exam end time (ISO string)
 * @returns true if current time is within exam window
 */
export function isExamAccessible(startTime: string, endTime: string): boolean {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  return now >= start && now <= end
}

/**
 * Check if exam is upcoming
 * @param startTime - Exam start time (ISO string)
 * @returns true if exam hasn't started yet
 */
export function isExamUpcoming(startTime: string): boolean {
  const now = new Date()
  const start = new Date(startTime)

  return now < start
}

/**
 * Check if exam has ended
 * @param endTime - Exam end time (ISO string)
 * @returns true if exam has ended
 */
export function isExamEnded(endTime: string): boolean {
  const now = new Date()
  const end = new Date(endTime)

  return now > end
}

/**
 * Format answer content for API submission
 * @param answer - Answer string (option id for MCQ, text for essay)
 * @param isMultipleChoice - Whether this is a multiple choice question
 * @param selectedOptions - Array of selected option ids (for multiple answer MCQ)
 * @returns Formatted answer string for API
 */
export function formatAnswerForSubmission(
  answer: string,
  isMultipleChoice: boolean,
  selectedOptions?: string[]
): string {
  if (isMultipleChoice && selectedOptions && selectedOptions.length > 1) {
    // Multiple answer MCQ: JSON array
    return JSON.stringify(selectedOptions)
  }

  // Single choice MCQ or essay: plain string
  return answer
}

/**
 * Parse answer content from API
 * @param answerContent - Answer content from API
 * @param isMultipleChoice - Whether this is a multiple choice question
 * @returns Parsed answer (string or array of strings)
 */
export function parseAnswerFromAPI(
  answerContent: string,
  isMultipleChoice: boolean
): string | string[] {
  if (isMultipleChoice && answerContent.startsWith('[')) {
    try {
      // Multiple answer MCQ: parse JSON array
      return JSON.parse(answerContent)
    } catch {
      return answerContent
    }
  }

  // Single choice MCQ or essay: return as-is
  return answerContent
}

/**
 * Get color for exam status badge
 * @param status - Exam status
 * @returns Color name from theme
 */
export function getExamStatusColor(status: ExamStatus): string {
  switch (status) {
    case ExamStatus.DRAFT:
      return 'textTertiary'
    case ExamStatus.PUBLISHED:
      return 'info'
    case ExamStatus.IN_PROGRESS:
      return 'success'
    case ExamStatus.COMPLETED:
      return 'textSecondary'
    case ExamStatus.CANCELLED:
      return 'error'
    default:
      return 'textSecondary'
  }
}

/**
 * Get color for submission status badge
 * @param status - Submission status
 * @returns Color name from theme
 */
export function getSubmissionStatusColor(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.IN_PROGRESS:
      return 'warning'
    case SubmissionStatus.SUBMITTED:
      return 'info'
    case SubmissionStatus.GRADED:
      return 'success'
    case SubmissionStatus.CANCELLED:
      return 'error'
    default:
      return 'textSecondary'
  }
}
