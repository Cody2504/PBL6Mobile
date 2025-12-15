import { CalendarEvent, DayData, MonthData } from '../types'

// Vietnamese day labels
export const DAY_LABELS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Vietnamese month names
const MONTH_NAMES_VI = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

/**
 * Get month metadata
 */
export function getMonthData(year: number, month: number): MonthData {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  return {
    year,
    month,
    firstDay,
    lastDay,
    daysInMonth,
  }
}

/**
 * Get all days to display in calendar grid (including prev/next month)
 * Returns 35 or 42 days (5-6 weeks)
 */
export function getCalendarDays(
  year: number,
  month: number,
  events: CalendarEvent[],
  selectedDate: Date | null
): DayData[] {
  const monthData = getMonthData(year, month)
  const firstDayOfWeek = monthData.firstDay.getDay() // 0-6

  // Group events by date
  const eventsByDate = groupEventsByDate(events)

  // Calculate total cells needed
  const totalCells = firstDayOfWeek + monthData.daysInMonth
  const weeksNeeded = Math.ceil(totalCells / 7)
  const totalDays = weeksNeeded * 7

  const days: DayData[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start from the first day of the week containing the 1st of the month
  let currentDate = new Date(monthData.firstDay)
  currentDate.setDate(currentDate.getDate() - firstDayOfWeek)

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(currentDate)
    const dateString = formatDateToString(date)
    const dayEvents = eventsByDate[dateString] || []

    const isCurrentMonth = date.getMonth() === month
    const isToday = isSameDay(date, today)
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false

    days.push({
      date: new Date(date),
      dateString,
      isCurrentMonth,
      isToday,
      isSelected,
      events: dayEvents,
      eventCount: dayEvents.length,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

/**
 * Get events for specific date
 */
export function getEventsForDate(
  events: CalendarEvent[],
  dateString: string
): CalendarEvent[] {
  return events
    .filter(event => event.date === dateString)
    .sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })
}

/**
 * Group events by date (YYYY-MM-DD)
 */
export function groupEventsByDate(
  events: CalendarEvent[]
): Record<string, CalendarEvent[]> {
  const grouped: Record<string, CalendarEvent[]> = {}

  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = []
    }
    grouped[event.date].push(event)
  })

  // Sort events within each date by start time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })
  })

  return grouped
}

/**
 * Format month/year for header display
 * Returns: "Tháng 1 2025"
 */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES_VI[month]} ${year}`
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 }
  }
  return { year, month: month - 1 }
}

/**
 * Navigate to next month
 */
export function getNextMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 }
  }
  return { year, month: month + 1 }
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format time from ISO string to HH:MM
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Format date for event list header
 * Returns: "Ngày 15 tháng 1"
 */
export function formatDateHeader(date: Date): string {
  return `Ngày ${date.getDate()} ${MONTH_NAMES_VI[date.getMonth()].toLowerCase()}`
}

/**
 * Get color for event based on type
 */
export function getEventColor(isTeacherExam: boolean): string {
  return isTeacherExam ? '#f4a261' : '#d73527'
}
