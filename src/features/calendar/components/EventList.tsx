import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { CalendarEvent } from '../types'
import { formatDateHeader } from '../utils'
import EventItem from './EventItem'
import EmptyState from './EmptyState'
import { styles } from './EventList.styles'

interface EventListProps {
  date: Date | null
  events: CalendarEvent[]
  onEventPress: (examId: number) => void
}

export default function EventList({ date, events, onEventPress }: EventListProps) {
  if (!date) {
    return (
      <View style={styles.container}>
        <EmptyState message="Chọn một ngày để xem lịch thi" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{formatDateHeader(date)}</Text>
        {events.length > 0 && (
          <Text style={styles.countText}>{events.length} lịch thi</Text>
        )}
      </View>

      {/* Event list */}
      {events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventItem
              event={item}
              onPress={() => onEventPress(item.examId)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState message="Không có lịch thi trong ngày này" />
      )}
    </View>
  )
}
