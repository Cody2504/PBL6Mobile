import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { Question, QuestionType } from '../types'
import { createStyles } from './QuestionCard.styles'

interface QuestionCardProps {
  question: Question
  currentOrder: number
  totalQuestions: number
  children?: React.ReactNode
}

export default function QuestionCard({
  question,
  currentOrder,
  totalQuestions,
  children,
}: QuestionCardProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'error'
      default:
        return 'info'
    }
  }

  const difficultyColor = getDifficultyColor()

  // Get question type icon and label
  const getQuestionTypeInfo = () => {
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      return {
        icon: question.is_multiple_answer ? 'checkmark-done-circle' : 'radio-button-on',
        label: question.is_multiple_answer ? 'Nhiều đáp án' : 'Một đáp án',
      }
    }
    return {
      icon: 'create' as const,
      label: 'Tự luận',
    }
  }

  const typeInfo = getQuestionTypeInfo()

  return (
    <View style={styles.card}>
      {/* Header - Question number and metadata */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>
              Câu {currentOrder}/{totalQuestions}
            </Text>
          </View>

          {/* Question type badge */}
          <View style={[styles.typeBadge, styles.typeBadge_info]}>
            <Ionicons name={typeInfo.icon} size={14} color={styles.typeBadgeIcon.color} />
            <Text style={styles.typeBadgeText}>{typeInfo.label}</Text>
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={16} color={styles.pointsIcon.color} />
          <Text style={styles.pointsText}>{question.points} điểm</Text>
        </View>
      </View>

      {/* Question content */}
      <View style={styles.contentContainer}>
        <Text style={styles.questionContent}>{question.content}</Text>
      </View>

      {/* Metadata row */}
      <View style={styles.metadata}>
        {/* Difficulty */}
        <View style={[styles.difficultyBadge, styles[`difficultyBadge_${difficultyColor}`]]}>
          <Text style={[styles.difficultyText, styles[`difficultyText_${difficultyColor}`]]}>
            {question.difficulty === 'easy' && 'Dễ'}
            {question.difficulty === 'medium' && 'Trung bình'}
            {question.difficulty === 'hard' && 'Khó'}
          </Text>
        </View>

        {/* Category */}
        {question.category && (
          <View style={styles.categoryBadge}>
            <Ionicons name="folder-outline" size={14} color={styles.categoryIcon.color} />
            <Text style={styles.categoryText}>{question.category.name}</Text>
          </View>
        )}
      </View>

      {/* Answer section (passed as children) */}
      {children && <View style={styles.answerSection}>{children}</View>}
    </View>
  )
}
