import { useState, useEffect, useRef } from 'react'
import { examService } from '../api/exam-service'

interface UseExamTimerParams {
  initialTime: number // seconds
  submissionId: number | null
  onTimeUp: () => void
}

interface UseExamTimerReturn {
  timeLeft: number // seconds
  formattedTime: string // MM:SS format
  isWarning: boolean // true when < 5 minutes
  isCritical: boolean // true when < 1 minute
}

export function useExamTimer({
  initialTime,
  submissionId,
  onTimeUp,
}: UseExamTimerParams): UseExamTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const timeLeftRef = useRef(initialTime)
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Update ref whenever state changes
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  // Reset timer when initialTime changes (e.g., when loaded from API)
  useEffect(() => {
    if (initialTime > 0) {
      setTimeLeft(initialTime)
      timeLeftRef.current = initialTime
    }
  }, [initialTime])

  // Countdown timer (every second)
  useEffect(() => {
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1)

        // Auto-submit when time is up
        if (newTime === 0 && prev > 0) {
          onTimeUp()
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [onTimeUp])

  // Backend sync (every 5 seconds)
  useEffect(() => {
    if (!submissionId) return

    syncIntervalRef.current = setInterval(async () => {
      const currentTime = timeLeftRef.current
      if (currentTime > 0) {
        try {
          await examService.updateRemainingTime(submissionId, currentTime)
        } catch (error) {
          console.error('Failed to sync timer:', error)
          // Continue countdown even if sync fails
        }
      }
    }, 5000)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [submissionId])

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isWarning: timeLeft <= 300 && timeLeft > 60, // < 5 minutes
    isCritical: timeLeft <= 60, // < 1 minute
  }
}
