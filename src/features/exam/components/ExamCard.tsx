import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { Exam, SubmissionStatus } from '../types'
import { getExamDuration, getSubmissionStatusText, isExamAccessible, isExamUpcoming } from '../utils'
import { createStyles } from './ExamCard.styles'

interface ExamCardProps {
  exam: Exam
  onPress: () => void
}

export default function ExamCard({ exam, onPress }: ExamCardProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  // Determine exam accessibility
  const isAccessible = isExamAccessible(exam.start_time, exam.end_time)
  const isUpcoming = isExamUpcoming(exam.start_time)

  // Format dates
  const startDate = format(new Date(exam.start_time), 'dd/MM/yyyy HH:mm', { locale: vi })
  const endDate = format(new Date(exam.end_time), 'dd/MM/yyyy HH:mm', { locale: vi })

  // Get action button text and icon
  const getActionButton = () => {
    if (exam.submission_status === SubmissionStatus.GRADED) {
      return { text: 'Xem kết quả', icon: 'checkmark-circle' as const, color: 'success' }
    }

    if (exam.submission_status === SubmissionStatus.SUBMITTED) {
      return { text: 'Đã nộp bài', icon: 'checkmark-done' as const, color: 'info' }
    }

    if (exam.submission_status === SubmissionStatus.IN_PROGRESS) {
      return { text: 'Tiếp tục', icon: 'play-circle' as const, color: 'warning' }
    }

    if (!isAccessible) {
      if (isUpcoming) {
        return { text: 'Chưa bắt đầu', icon: 'time' as const, color: 'disabled' }
      }
      return { text: 'Đã kết thúc', icon: 'close-circle' as const, color: 'disabled' }
    }

    return { text: 'Bắt đầu', icon: 'play' as const, color: 'primary' }
  }

  const actionButton = getActionButton()

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="document-text"
            size={20}
            color={styles.icon.color}
            style={styles.titleIcon}
          />
          <Text style={styles.title} numberOfLines={2}>
            {exam.title}
          </Text>
        </View>

        {/* Submission status badge */}
        {exam.submission_status && (
          <View style={[styles.badge, styles[`badge_${actionButton.color}`]]}>
            <Text style={[styles.badgeText, styles[`badgeText_${actionButton.color}`]]}>
              {getSubmissionStatusText(exam.submission_status)}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {exam.description && (
        <Text style={styles.description} numberOfLines={2}>
          {exam.description}
        </Text>
      )}

      {/* Metadata */}
      <View style={styles.metadata}>
        {/* Duration */}
        <View style={styles.metadataItem}>
          <Ionicons name="time-outline" size={16} color={styles.metadataIcon.color} />
          <Text style={styles.metadataText}>{getExamDuration(exam)} phút</Text>
        </View>

        {/* Total points */}
        {exam.total_points && (
          <View style={styles.metadataItem}>
            <Ionicons name="trophy-outline" size={16} color={styles.metadataIcon.color} />
            <Text style={styles.metadataText}>{exam.total_points} điểm</Text>
          </View>
        )}

        {/* Score (if graded) */}
        {exam.submission_status === SubmissionStatus.GRADED && exam.score != null && typeof exam.score === 'number' && (
          <View style={styles.metadataItem}>
            <Ionicons name="star" size={16} color={styles.metadataIcon.color} />
            <Text style={styles.scoreText}>{Number(exam.score).toFixed(1)}/{exam.total_points}</Text>
          </View>
        )}
      </View>

      {/* Time window */}
      <View style={styles.timeWindow}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Bắt đầu:</Text>
          <Text style={styles.timeValue}>{startDate}</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Kết thúc:</Text>
          <Text style={styles.timeValue}>{endDate}</Text>
        </View>
      </View>

      {/* Action button */}
      <View style={styles.footer}>
        <View style={[styles.actionButton, styles[`actionButton_${actionButton.color}`]]}>
          <Ionicons
            name={actionButton.icon}
            size={18}
            color={styles[`actionButtonIcon_${actionButton.color}`].color}
          />
          <Text style={[styles.actionButtonText, styles[`actionButtonText_${actionButton.color}`]]}>
            {actionButton.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
