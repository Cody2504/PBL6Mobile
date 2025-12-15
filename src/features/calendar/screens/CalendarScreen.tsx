import React from 'react'
import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useCalendarScreen } from '../hooks'
import {
  CalendarHeader,
  MonthGrid,
  EventList,
} from '../components'
import { styles } from './CalendarScreen.styles'

export default function CalendarScreen() {
  const insets = useSafeAreaInsets()
  const {
    currentYear,
    currentMonth,
    selectedDate,
    calendarDays,
    selectedDateEvents,
    isLoading,
    handlePreviousMonth,
    handleNextMonth,
    handleDayPress,
    handleEventPress,
    handleTodayPress,
  } = useCalendarScreen()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VH</Text>
          </View>
          <Text style={styles.headerTitle}>Lịch thi</Text>
        </View>
        <Pressable
          onPress={handleTodayPress}
          style={styles.todayIconButton}
          hitSlop={8}
        >
          <Ionicons name="today-outline" size={24} color="#6264a7" />
        </Pressable>
      </View>

      {/* Calendar Header */}
      <CalendarHeader
        year={currentYear}
        month={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onTodayPress={handleTodayPress}
      />

      {/* Calendar Grid */}
      <MonthGrid calendarDays={calendarDays} onDayPress={handleDayPress} />

      {/* Event List */}
      <EventList
        date={selectedDate}
        events={selectedDateEvents}
        onEventPress={handleEventPress}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6264a7" />
        </View>
      )}
    </View>
  )
}
