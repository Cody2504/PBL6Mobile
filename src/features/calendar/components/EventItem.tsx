import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CalendarEvent } from '../types'
import { formatTime, getEventColor } from '../utils'
import { styles } from './EventItem.styles'

interface EventItemProps {
  event: CalendarEvent
  onPress: () => void
}

// Get submission status label and color
function getSubmissionStatusInfo(status?: string): { label: string; color: string; bgColor: string } | null {
  switch (status) {
    case 'in_progress':
      return { label: 'Đang làm', color: '#f57c00', bgColor: '#fff3e0' }
    case 'submitted':
      return { label: 'Đã nộp', color: '#1976d2', bgColor: '#e3f2fd' }
    case 'graded':
      return { label: 'Đã chấm', color: '#388e3c', bgColor: '#e8f5e9' }
    default:
      return null
  }
}

export default function EventItem({ event, onPress }: EventItemProps) {
  const color = getEventColor(event.isTeacherExam)
  const startTime = formatTime(event.startTime)
  const endTime = formatTime(event.endTime)
  const statusInfo = getSubmissionStatusInfo(event.submissionStatus)

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderLeftColor: color },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="calendar-outline" size={24} color={color} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          {event.totalPoints !== undefined && (
            <Text style={styles.points}>{event.totalPoints}đ</Text>
          )}
        </View>

        <Text style={styles.time}>
          {startTime} - {endTime}
        </Text>

        <View style={statusStyles.statusRow}>
          <Text style={styles.type}>
            {event.isTeacherExam ? 'Bạn tạo' : 'Được giao'}
          </Text>

          {/* Submission status badge */}
          {statusInfo && (
            <View style={[statusStyles.badge, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[statusStyles.badgeText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

// Additional styles for status badge
const statusStyles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
})
