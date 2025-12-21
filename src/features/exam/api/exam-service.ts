import { apiClient } from '@/libs/http/api-client'
import type {
  Exam,
  SubmissionStatus,
  GetStudentExamsResponse,
  VerifyPasswordRequest,
  VerifyPasswordResponse,
  StartExamResponse,
  GetQuestionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  UpdateTimeRequest,
  UpdateTimeResponse,
  FinalSubmitResponse,
  ResumeExamResponse,
} from '../types'

/**
 * Transform exam data from API to include submission status as direct fields
 * API returns: { submissions: [{ status, score, submission_id, ... }] }
 * Frontend expects: { submission_status, submission_id, score, ... }
 */
function transformExamWithSubmission(exam: any): Exam {
  let submission_status: SubmissionStatus | undefined = undefined
  let submission_id: number | undefined = undefined
  let remaining_time: number | undefined = undefined
  let current_question_order: number | undefined = undefined
  let score: number | undefined = undefined

  // Extract submission info from submissions array
  if (exam.submissions && exam.submissions.length > 0) {
    const submission = exam.submissions[0]
    submission_id = submission.submission_id
    remaining_time = submission.remaining_time
    current_question_order = submission.current_question_order
    score = submission.score

    // Map status string to SubmissionStatus enum
    if (submission.status === 'in_progress') {
      submission_status = 'in_progress' as SubmissionStatus
    } else if (submission.status === 'submitted') {
      submission_status = 'submitted' as SubmissionStatus
    } else if (submission.status === 'graded') {
      submission_status = 'graded' as SubmissionStatus
    }
  }

  return {
    exam_id: exam.exam_id,
    class_id: exam.class_id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    total_time: exam.total_time,
    start_time: exam.start_time,
    end_time: exam.end_time,
    status: exam.status,
    total_points: exam.total_points,
    created_by: exam.created_by,
    created_at: exam.created_at,
    has_password: exam.has_password ?? !!exam.password,
    // Student-specific fields from submission
    submission_id,
    submission_status,
    remaining_time,
    current_question_order,
    score,
  }
}

/**
 * Exam API Service
 * Handles all exam-related API calls for student exam taking
 */
export const examService = {
  /**
   * Get all exams for the current student
   * GET /students/exams
   */
  async getStudentExams(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<GetStudentExamsResponse>('/students/exams')

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch exams')
      }

      // Handle nested response structure: 
      // API returns { data: { data: Exam[], pagination: {...} } }
      // response.data is { data: [...], pagination: {...} } after apiClient unwraps
      const responseData = response.data as any

      let examsData: any[] = []

      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        // Nested structure: response.data is { data: Exam[], pagination: {...} }
        console.log('📋 Parsed nested student exams response, found', responseData.data?.length || 0, 'exams')
        examsData = responseData.data || []
      } else if (Array.isArray(responseData)) {
        // Direct array structure
        console.log('📋 Parsed direct student exams response, found', responseData.length, 'exams')
        examsData = responseData
      }

      // Transform each exam to include submission status as direct fields
      const transformedExams = examsData.map(transformExamWithSubmission)
      console.log('📋 Transformed exams with submission status')

      return transformedExams
    } catch (error) {
      console.error('Error fetching student exams:', error)
      throw error
    }
  },

  /**
   * Verify exam password (also checks if exam requires password)
   * POST /exams/:examId/verify-password
   *
   * @param examId - The exam ID
   * @param password - Password to verify (optional, pass empty string to check if password required)
   * @returns true if password is correct or no password required, false otherwise
   */
  async verifyPassword(examId: number, password?: string): Promise<VerifyPasswordResponse['data']> {
    try {
      const response = await apiClient.post<VerifyPasswordResponse>(
        `/exams/${examId}/verify-password`,
        { password: password || '' }
      )

      console.log('Password response: ', response)

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify password')
      }

      return response.data
    } catch (error) {
      console.error('Error verifying password:', error)
      throw error
    }
  },

  /**
   * Start a new exam or get existing submission
   * POST /exams/:examId/start
   *
   * @param examId - The exam ID
   * @param password - Optional password for password-protected exam
   * @returns Submission info with first question
   */
  async startExam(examId: number, password?: string): Promise<StartExamResponse['data']> {
    try {
      // Only include password in body if it's provided and not empty
      const body = password && password.trim() !== '' ? { password } : {}

      console.log('🚀 Starting exam:', { examId, hasPassword: !!password, body })

      const response = await apiClient.post<StartExamResponse>(
        `/exams/${examId}/start`,
        body
      )

      console.log('📥 Server response:', { success: response.success, message: response.message })

      if (!response.success) {
        throw new Error(response.message || 'Failed to start exam')
      }

      console.log('✅ Exam started successfully, submission_id:', response.data?.submission_id)

      return response.data
    } catch (error) {
      console.error('❌ Error starting exam:', {
        examId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: error
      })
      throw error
    }
  },

  /**
   * Get a specific question by order number
   * GET /submissions/:submissionId/questions/:order
   *
   * @param submissionId - The submission ID
   * @param order - Question order number (1-based)
   * @returns Question data with existing answer if available
   */
  async getQuestionByOrder(
    submissionId: number,
    order: number
  ): Promise<GetQuestionResponse['data']> {
    try {
      const response = await apiClient.get<GetQuestionResponse>(
        `/submissions/${submissionId}/questions/${order}`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch question')
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching question ${order}:`, error)
      throw error
    }
  },

  /**
   * Submit or update an answer
   * POST /submissions/:submissionId/answers
   *
   * @param submissionId - The submission ID
   * @param data - Answer data (question_id and answer_content)
   * @returns Answer confirmation
   */
  async submitAnswer(
    submissionId: number,
    data: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse['data']> {
    try {
      const response = await apiClient.post<SubmitAnswerResponse>(
        `/submissions/${submissionId}/answers`,
        data
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit answer')
      }

      return response.data
    } catch (error) {
      console.error('Error submitting answer:', error)
      throw error
    }
  },

  /**
   * Update remaining time (for timer synchronization)
   * PATCH /submissions/:submissionId/time
   *
   * @param submissionId - The submission ID
   * @param remainingTime - Remaining time in seconds
   */
  async updateRemainingTime(
    submissionId: number,
    remainingTime: number
  ): Promise<void> {
    try {
      const response = await apiClient.patch<UpdateTimeResponse>(
        `/submissions/${submissionId}/time`,
        { remaining_time: remainingTime }
      )

      if (!response.success) {
        console.warn('Failed to update remaining time:', response.message)
      }
    } catch (error) {
      // Don't throw error for time sync failures - log and continue
      console.error('Error updating remaining time:', error)
    }
  },

  /**
   * Submit the exam (final submission)
   * POST /submissions/:submissionId/submit
   *
   * @param submissionId - The submission ID
   * @returns Submission confirmation with timestamp
   */
  async submitExam(submissionId: number): Promise<FinalSubmitResponse['data']> {
    try {
      const response = await apiClient.post<FinalSubmitResponse>(
        `/submissions/${submissionId}/submit`,
        {}
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit exam')
      }

      return response.data
    } catch (error) {
      console.error('Error submitting exam:', error)
      throw error
    }
  },

  /**
   * Resume an in-progress exam
   * GET /submissions/:submissionId/resume
   *
   * @param submissionId - The submission ID
   * @returns Current submission state with current question
   */
  async resumeExam(submissionId: number): Promise<ResumeExamResponse['data']> {
    try {
      const response = await apiClient.get<ResumeExamResponse>(
        `/submissions/${submissionId}/resume`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to resume exam')
      }

      return response.data
    } catch (error) {
      console.error('Error resuming exam:', error)
      throw error
    }
  },
}
