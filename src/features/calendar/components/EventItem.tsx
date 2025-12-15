import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CalendarEvent } from '../types'
import { formatTime, getEventColor } from '../utils'
import { styles } from './EventItem.styles'

interface EventItemProps {
  event: CalendarEvent
  onPress: () => void
}

export default function EventItem({ event, onPress }: EventItemProps) {
  const color = getEventColor(event.isTeacherExam)
  const startTime = formatTime(event.startTime)
  const endTime = formatTime(event.endTime)

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

        <Text style={styles.type}>
          {event.isTeacherExam ? 'Bạn tạo' : 'Được giao'}
        </Text>
      </View>
    </Pressable>
  )
}
