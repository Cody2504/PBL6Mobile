import { apiClient } from '@/libs/http/api-client'
import {
  Exam,
  CalendarEvent,
  GetExamsResponse,
  GetExamDetailResponse,
  CreateExamRequest,
  UpdateExamRequest,
} from '../types'

/**
 * Transform Exam to CalendarEvent
 */
function transformExamToEvent(
  exam: Exam,
  isTeacherExam: boolean
): CalendarEvent {
  return {
    id: exam.exam_id.toString(),
    examId: exam.exam_id,
    title: exam.title,
    startTime: exam.start_time,
    endTime: exam.end_time,
    date: exam.start_time.split('T')[0], // Extract YYYY-MM-DD
    isTeacherExam,
    status: exam.status,
    classId: exam.class_id,
    duration: exam.duration,
    totalPoints: exam.total_points,
  }
}

export const examService = {
  /**
   * Fetch exams based on user role
   * Teachers: GET /exams
   * Students: GET /students/exams
   */
  async getExams(isTeacher: boolean): Promise<CalendarEvent[]> {
    try {
      const endpoint = isTeacher ? '/exams' : '/students/exams'
      const response = await apiClient.get<GetExamsResponse>(endpoint)

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch exams')
      }

      // Transform Exam[] to CalendarEvent[]
      return response.data.map(exam => transformExamToEvent(exam, isTeacher))
    } catch (error) {
      console.error('Error fetching exams:', error)
      throw error
    }
  },

  /**
   * Get exam details by ID
   * GET /exams/{id}
   */
  async getExamById(examId: number): Promise<Exam> {
    try {
      const response = await apiClient.get<GetExamDetailResponse>(
        `/exams/${examId}`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch exam details')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching exam details:', error)
      throw error
    }
  },

  /**
   * Create new exam (teachers only)
   * POST /exams
   */
  async createExam(data: CreateExamRequest): Promise<Exam> {
    try {
      const response = await apiClient.post<GetExamDetailResponse>(
        '/exams',
        data
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to create exam')
      }

      return response.data
    } catch (error) {
      console.error('Error creating exam:', error)
      throw error
    }
  },

  /**
   * Update exam (teachers only)
   * PUT /exams/{id}
   */
  async updateExam(examId: number, data: UpdateExamRequest): Promise<Exam> {
    try {
      const response = await apiClient.put<GetExamDetailResponse>(
        `/exams/${examId}`,
        data
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to update exam')
      }

      return response.data
    } catch (error) {
      console.error('Error updating exam:', error)
      throw error
    }
  },

  /**
   * Delete exam (teachers only)
   * DELETE /exams/{id}
   */
  async deleteExam(examId: number): Promise<void> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/exams/${examId}`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete exam')
      }
    } catch (error) {
      console.error('Error deleting exam:', error)
      throw error
    }
  },
}
