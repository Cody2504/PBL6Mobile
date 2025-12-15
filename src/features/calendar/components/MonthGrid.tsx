import React from 'react'
import { View, Text } from 'react-native'
import { DayData } from '../types'
import { DAY_LABELS_VI } from '../utils'
import DayCell from './DayCell'
import { styles } from './MonthGrid.styles'

interface MonthGridProps {
  calendarDays: DayData[]
  onDayPress: (date: Date) => void
}

export default function MonthGrid({ calendarDays, onDayPress }: MonthGridProps) {
  return (
    <View style={styles.container}>
      {/* Day labels row */}
      <View style={styles.dayLabelsRow}>
        {DAY_LABELS_VI.map((label, index) => (
          <View key={index} style={styles.dayLabelContainer}>
            <Text style={styles.dayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.gridContainer}>
        {calendarDays.map((dayData, index) => (
          <DayCell
            key={`${dayData.dateString}-${index}`}
            dayData={dayData}
            onPress={onDayPress}
          />
        ))}
      </View>
    </View>
  )
}
