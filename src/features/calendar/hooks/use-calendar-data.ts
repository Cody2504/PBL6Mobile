import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/global/context/AuthContext'
import { examService } from '../api'
import { CalendarEvent } from '../types'

export function useCalendarData() {
  const { isTeacher } = useAuth()
  const [exams, setExams] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExams = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Calculate date range for calendar (current month ± 1 month for better UX)
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0)

      const events = await examService.getExamsForCalendar(
        isTeacher(),
        startDate,
        endDate
      )

      console.log('📅 Calendar data loaded:', events.length, 'events')
      if (events.length > 0) {
        console.log('📅 First event:', JSON.stringify(events[0], null, 2))
      }
      setExams(events)
    } catch (err) {
      const errorMessage = 'Không thể tải lịch thi. Vui lòng thử lại.'
      setError(errorMessage)
      console.error('❌ Error fetching exams:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isTeacher])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  return {
    exams,
    isLoading,
    error,
    refetch: fetchExams,
  }
}
