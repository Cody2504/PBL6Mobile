import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './EmptyState.styles'

interface EmptyStateProps {
  message?: string
}

export default function EmptyState({ message = 'Không có lịch thi' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}
