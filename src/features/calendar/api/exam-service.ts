import { apiClient } from '@/libs/http/api-client'
import {
  Exam,
  CalendarEvent,
  GetExamsResponse,
  GetExamDetailResponse,
  CreateExamRequest,
  UpdateExamRequest,
  ExamFilterParams,
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
    duration: exam.total_time, // Backend uses total_time instead of duration
    totalPoints: exam.total_points,
  }
}

/**
 * Build query string from filter params
 */
function buildQueryString(params?: ExamFilterParams): string {
  if (!params) return ''

  const queryParams = new URLSearchParams()

  if (params.search) queryParams.append('search', params.search)
  if (params.status) queryParams.append('status', params.status)
  if (params.start_time) queryParams.append('start_time', params.start_time)
  if (params.end_time) queryParams.append('end_time', params.end_time)
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())

  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const examService = {
  /**
   * Fetch exams based on user role with optional filters
   * Teachers: GET /exams
   * Students: GET /students/exams
   */
  async getExams(
    isTeacher: boolean,
    filters?: ExamFilterParams
  ): Promise<{ events: CalendarEvent[]; pagination: GetExamsResponse['pagination'] }> {
    try {
      const endpoint = isTeacher ? '/exams' : '/students/exams'
      const queryString = buildQueryString(filters)
      const response = await apiClient.get<GetExamsResponse>(`${endpoint}${queryString}`)

      // Handle empty response
      if (!response) {
        console.warn('⚠️ No response from server')
        return {
          events: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
        }
      }

      // Handle nested response structure: 
      // - Teacher exams: { data: Exam[], pagination: {...} }
      // - Student exams: { data: { data: Exam[], pagination: {...} } }
      // The API may return either format, so handle both
      let examsData: Exam[] = []
      let paginationData = response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

      // Check for nested data structure (student exams endpoint returns { data: { data: [...] } })
      const responseData = response.data as any
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        // Nested structure: response.data is { data: Exam[], pagination: {...} }
        examsData = responseData.data || []
        if (responseData.pagination) {
          paginationData = responseData.pagination
        }
        console.log('📋 Parsed nested response structure, found', examsData.length, 'exams')
      } else if (Array.isArray(responseData)) {
        // Direct array structure: response.data is Exam[]
        examsData = responseData
        console.log('📋 Parsed direct array structure, found', examsData.length, 'exams')
      } else if (responseData === null || responseData === undefined) {
        console.warn('⚠️ No data in response')
        examsData = []
      } else {
        console.warn('⚠️ Unexpected data format:', typeof responseData)
        examsData = []
      }

      // Ensure examsData is an array
      if (!Array.isArray(examsData)) {
        console.warn('⚠️ examsData is not an array after parsing:', typeof examsData)
        return {
          events: [],
          pagination: paginationData
        }
      }

      // Transform Exam[] to CalendarEvent[]
      const events = examsData.map(exam => transformExamToEvent(exam, isTeacher))
      console.log('📋 Transformed', events.length, 'events for calendar')

      return {
        events,
        pagination: paginationData,
      }
    } catch (error) {
      console.error('❌ Error fetching exams:', error)
      // Return empty result instead of throwing
      return {
        events: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
    }
  },

  /**
   * Fetch all exams for calendar view (handles pagination automatically)
   * Fetches exams within a date range and returns all pages
   */
  async getExamsForCalendar(
    isTeacher: boolean,
    startDate?: Date,
    endDate?: Date
  ): Promise<CalendarEvent[]> {
    try {
      const filters: ExamFilterParams = {
        limit: 100, // Fetch more per page for calendar
        page: 1,
      }

      // Add date filters if provided
      if (startDate) {
        filters.start_time = startDate.toISOString()
      }
      if (endDate) {
        filters.end_time = endDate.toISOString()
      }

      const { events, pagination } = await this.getExams(isTeacher, filters)

      // If there are more pages, fetch them all
      if (pagination && pagination.totalPages > 1) {
        const remainingPages = []
        for (let page = 2; page <= pagination.totalPages; page++) {
          remainingPages.push(
            this.getExams(isTeacher, { ...filters, page })
          )
        }

        const results = await Promise.all(remainingPages)
        const allEvents = [
          ...events,
          ...results.flatMap(result => result.events),
        ]

        return allEvents
      }

      return events
    } catch (error) {
      console.error('❌ Error fetching exams for calendar:', error)
      // Return empty array instead of throwing
      return []
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

      if (!response || !response.data) {
        throw new Error('Failed to fetch exam details')
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

      if (!response || !response.data) {
        throw new Error('Failed to create exam')
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

      if (!response || !response.data) {
        throw new Error('Failed to update exam')
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
      await apiClient.delete(`/exams/${examId}`)
    } catch (error) {
      console.error('Error deleting exam:', error)
      throw error
    }
  },
}
