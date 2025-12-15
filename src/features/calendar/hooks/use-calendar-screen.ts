import { useState, useMemo, useCallback } from 'react'
import { useCalendarData } from './use-calendar-data'
import {
  getCalendarDays,
  getEventsForDate,
  getPreviousMonth,
  getNextMonth,
} from '../utils'

export function useCalendarScreen() {
  const { exams, isLoading, error, refetch } = useCalendarData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Current month/year state
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  // Computed values
  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth, exams, selectedDate),
    [currentYear, currentMonth, exams, selectedDate]
  )

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    const dateString = selectedDate.toISOString().split('T')[0]
    return getEventsForDate(exams, dateString)
  }, [selectedDate, exams])

  // Handlers
  const handlePreviousMonth = useCallback(() => {
    const { year, month } = getPreviousMonth(currentYear, currentMonth)
    setCurrentYear(year)
    setCurrentMonth(month)
  }, [currentYear, currentMonth])

  const handleNextMonth = useCallback(() => {
    const { year, month } = getNextMonth(currentYear, currentMonth)
    setCurrentYear(year)
    setCurrentMonth(month)
  }, [currentYear, currentMonth])

  const handleDayPress = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  const handleEventPress = useCallback((examId: number) => {
    console.log('Navigate to exam:', examId)
    // TODO: Navigate to exam detail/taking screen
  }, [])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }, [refetch])

  const handleTodayPress = useCallback(() => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(today)
  }, [])

  return {
    // State
    currentYear,
    currentMonth,
    selectedDate,
    calendarDays,
    selectedDateEvents,
    isLoading,
    isRefreshing,
    error,

    // Handlers
    handlePreviousMonth,
    handleNextMonth,
    handleDayPress,
    handleEventPress,
    handleTodayPress,
    onRefresh,
  }
}
