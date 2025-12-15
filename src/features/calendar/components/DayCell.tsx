import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { DayData } from '../types'
import { getEventColor } from '../utils'
import { styles } from './DayCell.styles'

interface DayCellProps {
  dayData: DayData
  onPress: (date: Date) => void
}

export default React.memo(function DayCell({ dayData, onPress }: DayCellProps) {
  const {
    date,
    isCurrentMonth,
    isToday,
    isSelected,
    events,
    eventCount,
  } = dayData

  const handlePress = () => {
    onPress(date)
  }

  // Get unique event types for dot indicators
  const hasTeacherExam = events.some(e => e.isTeacherExam)
  const hasStudentExam = events.some(e => !e.isTeacherExam)

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        isToday && styles.todayContainer,
        isSelected && styles.selectedContainer,
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          !isCurrentMonth && styles.otherMonthText,
          isToday && !isSelected && styles.todayText,
          isSelected && styles.selectedText,
        ]}
      >
        {date.getDate()}
      </Text>

      {/* Event indicators */}
      {eventCount > 0 && (
        <View style={styles.eventIndicators}>
          {eventCount <= 2 ? (
            // Show individual dots
            <View style={styles.dotsContainer}>
              {hasTeacherExam && (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: getEventColor(true) },
                  ]}
                />
              )}
              {hasStudentExam && (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: getEventColor(false) },
                  ]}
                />
              )}
            </View>
          ) : (
            // Show count badge
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{eventCount}+</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
})
