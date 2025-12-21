import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { QuestionCard, AnswerOption, EssayInput, ExamTimer } from '../components'
import { useExamTakingScreen } from '../hooks'
import { useExamTimer } from '../hooks/use-exam-timer'
import { QuestionType } from '../types'
import { createStyles } from './ExamTakingScreen.styles'

export default function ExamTakingScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const {
    isLoading,
    question,
    currentOrder,
    totalQuestions,
    submissionId,
    remainingTime,
    currentAnswer,
    isSaving,
    canGoNext,
    canGoPrevious,
    goToNextQuestion,
    goToPreviousQuestion,
    handleAnswerChange,
    handleSubmitExam,
    autoSubmitExam,
  } = useExamTakingScreen()

  // Initialize timer
  const { formattedTime, isWarning, isCritical } = useExamTimer({
    initialTime: remainingTime,
    submissionId,
    onTimeUp: autoSubmitExam,
  })

  // Handle MCQ option selection
  const handleOptionSelect = (optionId: string) => {
    if (!question) return

    if (question.is_multiple_answer) {
      // Multiple answer - toggle selection
      try {
        const currentSelections = currentAnswer ? JSON.parse(currentAnswer) : []
        const newSelections = currentSelections.includes(optionId)
          ? currentSelections.filter((id: string) => id !== optionId)
          : [...currentSelections, optionId]

        handleAnswerChange(JSON.stringify(newSelections))
      } catch {
        // If parsing fails, start fresh
        handleAnswerChange(JSON.stringify([optionId]))
      }
    } else {
      // Single answer - replace selection
      handleAnswerChange(optionId)
    }
  }

  // Check if option is selected
  const isOptionSelected = (optionId: string): boolean => {
    if (!question) return false

    if (question.is_multiple_answer) {
      try {
        const selections = currentAnswer ? JSON.parse(currentAnswer) : []
        return selections.includes(optionId)
      } catch {
        return false
      }
    }

    return currentAnswer === optionId
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
          <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error or no question state
  if (!question) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={styles.errorIcon.color} />
          <Text style={styles.errorText}>Không thể tải câu hỏi</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Đang làm bài</Text>
            {isSaving && (
              <View style={styles.savingIndicator}>
                <ActivityIndicator size="small" color={styles.savingIndicatorColor.color} />
                <Text style={styles.savingText}>Đang lưu...</Text>
              </View>
            )}
          </View>
          {/* Timer */}
          <ExamTimer
            formattedTime={formattedTime}
            isWarning={isWarning}
            isCritical={isCritical}
          />
        </View>
      </View>

      {/* Question content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          question={question}
          currentOrder={currentOrder}
          totalQuestions={totalQuestions}
        >
          {/* Answer section */}
          {question.type === QuestionType.MULTIPLE_CHOICE && question.options ? (
            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <AnswerOption
                  key={option.id}
                  option={option}
                  isSelected={isOptionSelected(option.id)}
                  isMultipleAnswer={question.is_multiple_answer}
                  onSelect={() => handleOptionSelect(option.id)}
                />
              ))}
            </View>
          ) : (
            <EssayInput
              value={currentAnswer}
              onChangeText={handleAnswerChange}
            />
          )}
        </QuestionCard>
      </ScrollView>

      {/* Navigation footer */}
      <View style={styles.footer}>
        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButton_secondary,
              !canGoPrevious && styles.navButton_disabled,
            ]}
            onPress={goToPreviousQuestion}
            disabled={!canGoPrevious}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={canGoPrevious ? styles.navButtonIcon.color : styles.navButtonIcon_disabled.color}
            />
            <Text
              style={[
                styles.navButtonText,
                styles.navButtonText_secondary,
                !canGoPrevious && styles.navButtonText_disabled,
              ]}
            >
              Câu trước
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButton_secondary,
              !canGoNext && styles.navButton_disabled,
            ]}
            onPress={goToNextQuestion}
            disabled={!canGoNext}
          >
            <Text
              style={[
                styles.navButtonText,
                styles.navButtonText_secondary,
                !canGoNext && styles.navButtonText_disabled,
              ]}
            >
              Câu sau
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={canGoNext ? styles.navButtonIcon.color : styles.navButtonIcon_disabled.color}
            />
          </TouchableOpacity>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.submitButton, styles.submitButton_primary]}
          onPress={handleSubmitExam}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Nộp bài</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
