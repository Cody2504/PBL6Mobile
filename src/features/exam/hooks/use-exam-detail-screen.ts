import { useState, useEffect, useCallback } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { examService } from '../api'
import { Exam, SubmissionStatus } from '../types'
import { isExamAccessible } from '../utils'

export function useExamDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ examId: string }>()
  const examId = params.examId ? parseInt(params.examId, 10) : 0

  // State
  const [exam, setExam] = useState<Exam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [verifiedPassword, setVerifiedPassword] = useState<string | undefined>(undefined)

  // Fetch exam details
  const fetchExam = useCallback(async () => {
    if (!examId) {
      setError('ID bài thi không hợp lệ')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch all exams and find the specific one
      const exams = await examService.getStudentExams()
      console.log('Exams: ', exams)
      const foundExam = exams.find(e => e.exam_id === examId)

      if (!foundExam) {
        setError('Không tìm thấy bài thi')
        setExam(null)
      } else {
        setExam(foundExam)
      }
    } catch (err) {
      console.error('Error fetching exam:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin bài thi')
    } finally {
      setIsLoading(false)
    }
  }, [examId])

  // Initial fetch
  useEffect(() => {
    fetchExam()
  }, [fetchExam])

  // Check if password is required and verify
  const checkPasswordRequirement = useCallback(async () => {
    if (!exam) return false

    try {
      const result = await examService.verifyPassword(exam.exam_id, '')

      if (result.has_password) {
        // Show password modal
        setIsPasswordModalVisible(true)
        return true
      }

      return false
    } catch (err) {
      console.error('Error checking password:', err)
      return false
    }
  }, [exam])

  // Verify password
  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      if (!exam) return false

      try {
        const result = await examService.verifyPassword(exam.exam_id, password)

        // Check result.success for verification success (not result.has_password)
        if (result.success) {
          setVerifiedPassword(password)  // Store the verified password
          setIsPasswordModalVisible(false)
          return true
        }

        return false
      } catch (err) {
        console.error('Error verifying password:', err)
        throw err
      }
    },
    [exam]
  )

  // Start or resume exam
  const startExam = useCallback(async () => {
    if (!exam) return

    // Check if exam is accessible
    if (!isExamAccessible(exam.start_time, exam.end_time)) {
      setError('Bài thi không trong thời gian làm bài')
      return
    }

    try {
      setError(null)

      // Check if already has a submission in progress
      if (exam.submission_id && exam.submission_status === SubmissionStatus.IN_PROGRESS) {
        // Navigate to taking screen with existing submission
        router.push({
          pathname: '/(exam)/taking',
          params: {
            submissionId: exam.submission_id.toString(),
            examId: exam.exam_id.toString(),
          },
        })
        return
      }

      // Check password requirement
      const requiresPassword = await checkPasswordRequirement()

      if (requiresPassword) {
        // Just show the modal, don't call API yet
        // The modal's handlePasswordSubmit will handle the API call
        return
      }

      // No password required, start exam directly
      setIsStarting(true)
      await startExamAfterPasswordVerification()
    } catch (err) {
      console.error('Error starting exam:', err)
      setError(err instanceof Error ? err.message : 'Không thể bắt đầu bài thi')
    } finally {
      setIsStarting(false)
    }
  }, [exam, checkPasswordRequirement, router])

  // Start exam after password verification (or if no password required)
  const startExamAfterPasswordVerification = useCallback(async (password?: string) => {
    if (!exam) return

    // Guard against double calls
    if (isStarting) {
      console.log('⚠️ startExamAfterPasswordVerification already in progress, skipping...')
      return
    }

    try {
      setIsStarting(true)
      const finalPassword = password || verifiedPassword
      console.log('🚀 Navigating to exam taking screen with password:', finalPassword ? '***' : 'none')

      // Navigate to taking screen with password
      // The taking screen will call startExam with this password
      router.push({
        pathname: '/(exam)/taking',
        params: {
          examId: exam.exam_id.toString(),
          ...(finalPassword && finalPassword.trim() !== '' && { password: finalPassword }),
        },
      })
    } catch (err) {
      console.error('Error navigating to exam:', err)
      setError(err instanceof Error ? err.message : 'Không thể bắt đầu bài thi')
      throw err
    } finally {
      setIsStarting(false)
    }
  }, [exam, router, verifiedPassword, isStarting])

  // Handle password modal submit
  const handlePasswordSubmit = useCallback(
    async (password: string): Promise<boolean> => {
      console.log('Password submitted:', password)
      const isValid = await verifyPassword(password)

      if (isValid) {
        // Start exam after successful verification - pass the password directly
        await startExamAfterPasswordVerification(password)
      }

      return isValid
    },
    [verifyPassword, startExamAfterPasswordVerification]
  )

  // Get start button text
  const getStartButtonText = useCallback(() => {
    if (!exam) return 'Bắt đầu'

    if (exam.submission_status === SubmissionStatus.IN_PROGRESS) {
      return 'Tiếp tục làm bài'
    }

    if (exam.submission_status === SubmissionStatus.SUBMITTED) {
      return 'Đã nộp bài'
    }

    if (exam.submission_status === SubmissionStatus.GRADED) {
      return 'Xem kết quả'
    }

    return 'Bắt đầu làm bài'
  }, [exam])

  // Check if start button should be disabled
  const isStartButtonDisabled = useCallback(() => {
    if (!exam) return true

    // Disable if already submitted or graded
    if (
      exam.submission_status === SubmissionStatus.SUBMITTED ||
      exam.submission_status === SubmissionStatus.GRADED
    ) {
      return true
    }

    // Disable if not in time window
    if (!isExamAccessible(exam.start_time, exam.end_time)) {
      return true
    }

    return false
  }, [exam])

  return {
    // Data
    exam,
    examId,

    // State
    isLoading,
    error,
    isStarting,

    // Password modal
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    handlePasswordSubmit,

    // Actions
    startExam,
    retry: fetchExam,

    // Helpers
    getStartButtonText,
    isStartButtonDisabled: isStartButtonDisabled(),
  }
}
