import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { createStyles } from './ExamTimer.styles'

interface ExamTimerProps {
  formattedTime: string
  isWarning: boolean
  isCritical: boolean
}

export default function ExamTimer({ formattedTime, isWarning, isCritical }: ExamTimerProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  // Determine style based on time status
  const getTimerStyle = () => {
    if (isCritical) return 'critical'
    if (isWarning) return 'warning'
    return 'normal'
  }

  const timerStyle = getTimerStyle()

  return (
    <View style={[styles.container, styles[`container_${timerStyle}`]]}>
      <Ionicons
        name="time"
        size={20}
        color={styles[`icon_${timerStyle}`].color}
      />
      <Text style={[styles.time, styles[`time_${timerStyle}`]]}>{formattedTime}</Text>
    </View>
  )
}
