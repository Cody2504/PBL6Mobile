import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { examService } from '../api/exam-service'
import { Question, QuestionType } from '../types'

interface UseExamTakingScreenReturn {
  // State
  isLoading: boolean
  question: Question | null
  currentOrder: number
  totalQuestions: number
  submissionId: number | null
  remainingTime: number
  currentAnswer: string
  isSaving: boolean
  error: string | null

  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
  goToNextQuestion: () => Promise<void>
  goToPreviousQuestion: () => Promise<void>
  goToQuestion: (order: number) => Promise<void>

  // Answer handling
  handleAnswerChange: (answer: string) => void
  saveCurrentAnswer: () => Promise<void>

  // Submit
  handleSubmitExam: () => void
  autoSubmitExam: () => Promise<void>
}

export function useExamTakingScreen(): UseExamTakingScreenReturn {
  const router = useRouter()
  const params = useLocalSearchParams<{
    submissionId?: string
    examId: string
    password?: string
    isResume?: string
  }>()

  // Core state
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<Question | null>(null)
  const [currentOrder, setCurrentOrder] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [submissionId, setSubmissionId] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track if answer was modified to avoid unnecessary saves
  const answerModifiedRef = useRef(false)
  const lastSavedAnswerRef = useRef('')
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Parse params
  const examId = params.examId ? parseInt(params.examId) : null
  const initialSubmissionId = params.submissionId ? parseInt(params.submissionId) : null
  const password = params.password
  const isResume = params.isResume === 'true'

  // Initialize exam
  useEffect(() => {
    if (!examId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin bài thi')
      router.back()
      return
    }

    initializeExam()
  }, [examId])

  const initializeExam = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let data

      if (initialSubmissionId) {
        // Resume existing submission
        console.log('📖 Resuming exam with submission_id:', initialSubmissionId)
        data = await examService.resumeExam(initialSubmissionId)
      } else if (examId) {
        // Start new exam with password from params
        console.log('🚀 Starting exam:', { examId, hasPassword: !!password })
        data = await examService.startExam(examId, password)
      } else {
        throw new Error('Invalid exam initialization parameters')
      }

      // Set submission data
      setSubmissionId(data.submission_id)
      setCurrentOrder(data.current_question_order)
      setTotalQuestions(data.total_questions)
      setRemainingTime(data.remaining_time || 0)
      setQuestion(data.question)

      // Set current answer if exists
      if (data.question.current_answer) {
        setCurrentAnswer(data.question.current_answer)
        lastSavedAnswerRef.current = data.question.current_answer
      } else {
        setCurrentAnswer('')
        lastSavedAnswerRef.current = ''
      }

      answerModifiedRef.current = false

      // Load draft from AsyncStorage
      await loadDraftFromStorage(data.submission_id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải bài thi'
      setError(message)
      Alert.alert('Lỗi', message, [
        { text: 'Quay lại', onPress: () => router.back() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Load question by order
  const loadQuestion = useCallback(
    async (order: number) => {
      if (!submissionId) return

      try {
        setIsLoading(true)
        setError(null)

        const data = await examService.getQuestionByOrder(submissionId, order)

        setQuestion(data.question)
        setCurrentOrder(data.current_question_order)
        setTotalQuestions(data.total_questions)

        // Set existing answer if any
        if (data.existing_answer) {
          setCurrentAnswer(data.existing_answer.answer_content)
          lastSavedAnswerRef.current = data.existing_answer.answer_content
        } else {
          setCurrentAnswer('')
          lastSavedAnswerRef.current = ''
        }

        answerModifiedRef.current = false
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải câu hỏi'
        setError(message)
        Alert.alert('Lỗi', message)
      } finally {
        setIsLoading(false)
      }
    },
    [submissionId]
  )

  // AsyncStorage draft management
  const getDraftKey = (subId: number) => `exam_draft_${subId}`

  const saveDraftToStorage = async (subId: number, answer: string, questionId: number) => {
    try {
      const key = getDraftKey(subId)
      const existingDraft = await AsyncStorage.getItem(key)
      const draft = existingDraft ? JSON.parse(existingDraft) : {}

      draft[questionId] = answer
      draft.lastUpdated = new Date().toISOString()

      await AsyncStorage.setItem(key, JSON.stringify(draft))
    } catch (error) {
      console.error('Error saving draft to storage:', error)
    }
  }

  const loadDraftFromStorage = async (subId: number) => {
    try {
      const key = getDraftKey(subId)
      const draftStr = await AsyncStorage.getItem(key)
      if (draftStr) {
        const draft = JSON.parse(draftStr)
        console.log('Loaded draft from storage:', draft)
        // Draft will be applied when questions are loaded
      }
    } catch (error) {
      console.error('Error loading draft from storage:', error)
    }
  }

  const clearDraftFromStorage = async (subId: number) => {
    try {
      const key = getDraftKey(subId)
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Error clearing draft from storage:', error)
    }
  }

  // Handle answer change with auto-save
  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer)
    answerModifiedRef.current = true

    // Clear existing auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Determine debounce time based on question type
    const debounceTime = question?.type === QuestionType.ESSAY ? 500 : 100

    // Set new auto-save timer
    autoSaveTimerRef.current = setTimeout(() => {
      saveCurrentAnswer()
    }, debounceTime)

    // Save draft to AsyncStorage immediately
    if (submissionId && question) {
      saveDraftToStorage(submissionId, answer, question.question_id)
    }
  }

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  // Save current answer
  const saveCurrentAnswer = useCallback(async () => {
    if (!submissionId || !question) return
    if (!answerModifiedRef.current) return
    if (currentAnswer === lastSavedAnswerRef.current) return

    try {
      setIsSaving(true)

      await examService.submitAnswer(submissionId, {
        question_id: question.question_id,
        answer_content: currentAnswer,
      })

      lastSavedAnswerRef.current = currentAnswer
      answerModifiedRef.current = false
    } catch (err) {
      console.error('Error saving answer:', err)
      // Don't show alert for save errors - just log it
    } finally {
      setIsSaving(false)
    }
  }, [submissionId, question, currentAnswer])

  // Navigation functions
  const canGoNext = currentOrder < totalQuestions
  const canGoPrevious = currentOrder > 1

  const goToNextQuestion = async () => {
    if (!canGoNext) return

    // Save current answer before navigating
    await saveCurrentAnswer()

    // Load next question
    await loadQuestion(currentOrder + 1)
  }

  const goToPreviousQuestion = async () => {
    if (!canGoPrevious) return

    // Save current answer before navigating
    await saveCurrentAnswer()

    // Load previous question
    await loadQuestion(currentOrder - 1)
  }

  const goToQuestion = async (order: number) => {
    if (order < 1 || order > totalQuestions) return
    if (order === currentOrder) return

    // Save current answer before navigating
    await saveCurrentAnswer()

    // Load target question
    await loadQuestion(order)
  }

  // Auto-submit exam (when timer expires)
  const autoSubmitExam = async () => {
    try {
      // Save current answer first
      await saveCurrentAnswer()

      if (!submissionId) return

      // Submit exam
      await examService.submitExam(submissionId)

      // Clear draft
      await clearDraftFromStorage(submissionId)

      // Show notification and navigate to exam tab
      Alert.alert(
        'Hết thời gian',
        'Bài thi đã được nộp tự động.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to exam tab with bottom tabs visible
              router.replace('/(tabs)/exam')
            },
          },
        ]
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể nộp bài'
      Alert.alert('Lỗi', message)
    }
  }

  // Manual submit exam
  const handleSubmitExam = () => {
    Alert.alert(
      'Nộp bài thi',
      'Bạn có chắc chắn muốn nộp bài? Sau khi nộp bạn sẽ không thể thay đổi câu trả lời.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nộp bài',
          style: 'destructive',
          onPress: async () => {
            try {
              // Save current answer first
              await saveCurrentAnswer()

              if (!submissionId) return

              // Submit exam
              await examService.submitExam(submissionId)

              // Clear draft
              await clearDraftFromStorage(submissionId)

              // Show success and navigate to exam tab
              Alert.alert(
                'Thành công',
                'Bài thi đã được nộp thành công!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to exam tab with bottom tabs visible
                      router.replace('/(tabs)/exam')
                    },
                  },
                ]
              )
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Không thể nộp bài'
              Alert.alert('Lỗi', message)
            }
          },
        },
      ]
    )
  }

  return {
    // State
    isLoading,
    question,
    currentOrder,
    totalQuestions,
    submissionId,
    remainingTime,
    currentAnswer,
    isSaving,
    error,

    // Navigation
    canGoNext,
    canGoPrevious,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,

    // Answer handling
    handleAnswerChange,
    saveCurrentAnswer,

    // Submit
    handleSubmitExam,
    autoSubmitExam,
  }
}
