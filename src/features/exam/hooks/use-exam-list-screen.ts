import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { examService } from '../api'
import { Exam } from '../types'
import { isExamAccessible, isExamUpcoming, isExamEnded } from '../utils'
import { useAuth } from '@/global/context'

export type ExamFilter = 'all' | 'upcoming' | 'in-progress' | 'completed'

export function useExamListScreen() {
  const router = useRouter()
  const { user } = useAuth()

  // State
  const [exams, setExams] = useState<Exam[]>([])
  const [filteredExams, setFilteredExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<ExamFilter>('all')

  // Fetch exams
  const fetchExams = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError(null)

      const data = await examService.getStudentExams()
      setExams(data)
    } catch (err) {
      console.error('Error fetching exams:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách bài thi')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Filter exams based on active filter
  const filterExams = useCallback(() => {
    let filtered = exams

    switch (activeFilter) {
      case 'upcoming':
        // Exams that haven't started yet (and not submitted)
        filtered = exams.filter(exam =>
          isExamUpcoming(exam.start_time) &&
          exam.submission_status !== 'submitted' &&
          exam.submission_status !== 'graded'
        )
        break

      case 'in-progress':
        // Exams that are accessible and NOT submitted/graded
        filtered = exams.filter(exam =>
          isExamAccessible(exam.start_time, exam.end_time) &&
          exam.submission_status !== 'submitted' &&
          exam.submission_status !== 'graded'
        )
        break

      case 'completed':
        // Exams that have ended OR have been submitted/graded
        filtered = exams.filter(exam =>
          isExamEnded(exam.end_time) ||
          exam.submission_status === 'submitted' ||
          exam.submission_status === 'graded'
        )
        break

      case 'all':
      default:
        filtered = exams
        break
    }

    // Sort by start time (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime()
      const dateB = new Date(b.start_time).getTime()
      return dateB - dateA
    })

    setFilteredExams(filtered)
  }, [exams, activeFilter])

  // Initial fetch
  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  // Apply filter when exams or filter changes
  useEffect(() => {
    filterExams()
  }, [filterExams])

  // Handle refresh
  const onRefresh = useCallback(() => {
    fetchExams(true)
  }, [fetchExams])

  // Handle filter change
  const onFilterChange = useCallback((filter: ExamFilter) => {
    setActiveFilter(filter)
  }, [])

  // Navigate to exam detail
  const navigateToExamDetail = useCallback(
    (examId: number) => {
      router.push({
        pathname: '/(exam)/detail',
        params: { examId: examId.toString() },
      })
    },
    [router]
  )

  // Get count for each filter
  const getFilterCounts = useCallback(() => {
    return {
      all: exams.length,
      upcoming: exams.filter(exam =>
        isExamUpcoming(exam.start_time) &&
        exam.submission_status !== 'submitted' &&
        exam.submission_status !== 'graded'
      ).length,
      inProgress: exams.filter(exam =>
        isExamAccessible(exam.start_time, exam.end_time) &&
        exam.submission_status !== 'submitted' &&
        exam.submission_status !== 'graded'
      ).length,
      completed: exams.filter(exam =>
        isExamEnded(exam.end_time) ||
        exam.submission_status === 'submitted' ||
        exam.submission_status === 'graded'
      ).length,
    }
  }, [exams])

  return {
    // Data
    exams: filteredExams,
    allExams: exams,

    // User for avatar
    user,

    // State
    isLoading,
    isRefreshing,
    error,
    activeFilter,

    // Filter counts
    filterCounts: getFilterCounts(),

    // Actions
    onRefresh,
    onFilterChange,
    navigateToExamDetail,
    retry: () => fetchExams(),
  }
}
