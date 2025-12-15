import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatMonthYear } from '../utils'
import { styles } from './CalendarHeader.styles'

interface CalendarHeaderProps {
  year: number
  month: number
  onPreviousMonth: () => void
  onNextMonth: () => void
  onTodayPress: () => void
}

export default function CalendarHeader({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
  onTodayPress,
}: CalendarHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Pressable
          onPress={onPreviousMonth}
          style={styles.navButton}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#6264a7" />
        </Pressable>

        <Text style={styles.monthYear}>{formatMonthYear(year, month)}</Text>

        <Pressable
          onPress={onNextMonth}
          style={styles.navButton}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={24} color="#6264a7" />
        </Pressable>
      </View>

      <Pressable onPress={onTodayPress} style={styles.todayButton} hitSlop={8}>
        <Text style={styles.todayText}>Hôm nay</Text>
      </Pressable>
    </View>
  )
}
