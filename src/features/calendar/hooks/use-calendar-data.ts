import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useAuth } from '@/global/context/AuthContext'
import { examService } from '../api'
import { CalendarEvent, ExamStatus } from '../types'

// Mock data for testing
const MOCK_EXAMS: CalendarEvent[] = [
  // Today (Dec 14) - Teacher exam
  {
    id: '1',
    examId: 1,
    title: 'Kiểm tra giữa kỳ - Toán cao cấp',
    startTime: '2025-12-14T09:00:00',
    endTime: '2025-12-14T10:30:00',
    date: '2025-12-14',
    isTeacherExam: true,
    status: ExamStatus.PUBLISHED,
    classId: 1,
    duration: 90,
    totalPoints: 100,
  },
  // Today (Dec 14) - Student exam
  {
    id: '2',
    examId: 2,
    title: 'Bài thi cuối kỳ - Lập trình Web',
    startTime: '2025-12-14T14:00:00',
    endTime: '2025-12-14T16:00:00',
    date: '2025-12-14',
    isTeacherExam: false,
    status: ExamStatus.PUBLISHED,
    classId: 2,
    duration: 120,
    totalPoints: 100,
  },
  // Today (Dec 14) - Another student exam
  {
    id: '3',
    examId: 3,
    title: 'Kiểm tra 15 phút - Tiếng Anh',
    startTime: '2025-12-14T16:30:00',
    endTime: '2025-12-14T16:45:00',
    date: '2025-12-14',
    isTeacherExam: false,
    status: ExamStatus.PUBLISHED,
    classId: 3,
    duration: 15,
    totalPoints: 10,
  },
  // Tomorrow (Dec 15) - Teacher exam
  {
    id: '4',
    examId: 4,
    title: 'Bài kiểm tra - Cấu trúc dữ liệu',
    startTime: '2025-12-15T08:00:00',
    endTime: '2025-12-15T09:30:00',
    date: '2025-12-15',
    isTeacherExam: true,
    status: ExamStatus.PUBLISHED,
    classId: 4,
    duration: 90,
    totalPoints: 50,
  },
  // Tomorrow (Dec 15) - Student exam
  {
    id: '5',
    examId: 5,
    title: 'Thi giữa kỳ - Cơ sở dữ liệu',
    startTime: '2025-12-15T10:00:00',
    endTime: '2025-12-15T11:30:00',
    date: '2025-12-15',
    isTeacherExam: false,
    status: ExamStatus.PUBLISHED,
    classId: 5,
    duration: 90,
    totalPoints: 100,
  },
  // Tomorrow (Dec 15) - Teacher exam
  {
    id: '6',
    examId: 6,
    title: 'Kiểm tra thực hành - Mạng máy tính',
    startTime: '2025-12-15T13:00:00',
    endTime: '2025-12-15T15:00:00',
    date: '2025-12-15',
    isTeacherExam: true,
    status: ExamStatus.PUBLISHED,
    classId: 6,
    duration: 120,
    totalPoints: 100,
  },
]

// Set to true to use mock data, false to use API
const USE_MOCK_DATA = true

export function useCalendarData() {
  const { isTeacher } = useAuth()
  const [exams, setExams] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExams = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        // Use mock data
        setExams(MOCK_EXAMS)
      } else {
        // Use real API
        const data = await examService.getExams(isTeacher())
        setExams(data)
      }
    } catch (err) {
      const errorMessage = 'Không thể tải lịch thi. Vui lòng thử lại.'
      setError(errorMessage)
      console.error('Error fetching exams:', err)
      Alert.alert('Lỗi', errorMessage)
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
