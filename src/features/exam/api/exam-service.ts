import { apiClient } from '@/libs/http/api-client'
import type {
  Exam,
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
      
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        // Nested structure: response.data is { data: Exam[], pagination: {...} }
        console.log('📋 Parsed nested student exams response, found', responseData.data?.length || 0, 'exams')
        return responseData.data || []
      } else if (Array.isArray(responseData)) {
        // Direct array structure
        console.log('📋 Parsed direct student exams response, found', responseData.length, 'exams')
        return responseData
      }

      return []
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
      const response = await apiClient.post<StartExamResponse>(
        `/exams/${examId}/start`,
        { password }  // Send password in request body (like Frontend does)
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to start exam')
      }

      console.log('Response.data: ', response.data)

      return response.data
    } catch (error) {
      console.error('Error starting exam:', error)
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
