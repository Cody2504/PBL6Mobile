import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import PasswordModal from '../components/PasswordModal'
import { useExamDetailScreen } from '../hooks/use-exam-detail-screen'
import { getExamDuration } from '../utils'
import { createStyles } from './ExamDetailScreen.styles'

export default function ExamDetailScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const {
    exam,
    isLoading,
    error,
    isStarting,
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    handlePasswordSubmit,
    startExam,
    retry,
    getStartButtonText,
    isStartButtonDisabled,
  } = useExamDetailScreen()

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={styles.backIcon.color} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết bài thi</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loader.color} />
          <Text style={styles.loadingText}>Đang tải thông tin bài thi...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state
  if (error || !exam) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={styles.backIcon.color} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết bài thi</Text>
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={styles.errorIcon.color} />
          <Text style={styles.errorTitle}>Không thể tải bài thi</Text>
          <Text style={styles.errorMessage}>{error || 'Bài thi không tồn tại'}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.7}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Format dates
  const startDate = format(new Date(exam.start_time), 'dd/MM/yyyy', { locale: vi })
  const startTime = format(new Date(exam.start_time), 'HH:mm', { locale: vi })
  const endDate = format(new Date(exam.end_time), 'dd/MM/yyyy', { locale: vi })
  const endTime = format(new Date(exam.end_time), 'HH:mm', { locale: vi })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={styles.backIcon.color} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài thi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={32} color={styles.titleIcon.color} />
          </View>
          <Text style={styles.title}>{exam.title}</Text>
        </View>

        {/* Description */}
        {exam.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{exam.description}</Text>
          </View>
        )}

        {/* Exam Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin bài thi</Text>

          <View style={styles.infoGrid}>
            {/* Duration */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time" size={20} color={styles.infoIcon.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Thời gian làm bài</Text>
                <Text style={styles.infoValue}>{getExamDuration(exam)} phút</Text>
              </View>
            </View>

            {/* Total Points */}
            {exam.total_points && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="trophy" size={20} color={styles.infoIcon.color} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tổng điểm</Text>
                  <Text style={styles.infoValue}>{exam.total_points} điểm</Text>
                </View>
              </View>
            )}

            {/* Start Time */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color={styles.infoIcon.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Thời gian bắt đầu</Text>
                <Text style={styles.infoValue}>{startDate} - {startTime}</Text>
              </View>
            </View>

            {/* End Time */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={20} color={styles.infoIcon.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Thời gian kết thúc</Text>
                <Text style={styles.infoValue}>{endDate} - {endTime}</Text>
              </View>
            </View>

            {/* Password Required */}
            {exam.has_password && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="lock-closed" size={20} color={styles.infoIcon.color} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Bảo mật</Text>
                  <Text style={styles.infoValue}>Có mật khẩu</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng dẫn</Text>

          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet}>
                <Text style={styles.instructionBulletText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Bạn có {getExamDuration(exam)} phút để hoàn thành bài thi
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet}>
                <Text style={styles.instructionBulletText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Câu trả lời sẽ được tự động lưu khi bạn chuyển câu hỏi
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet}>
                <Text style={styles.instructionBulletText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Bạn có thể chuyển qua lại giữa các câu hỏi tùy ý
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet}>
                <Text style={styles.instructionBulletText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Bài thi sẽ tự động nộp khi hết thời gian
              </Text>
            </View>

            {exam.has_password && (
              <View style={styles.instructionItem}>
                <View style={styles.instructionBullet}>
                  <Text style={styles.instructionBulletText}>5</Text>
                </View>
                <Text style={styles.instructionText}>
                  Bạn cần nhập mật khẩu để bắt đầu làm bài
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Score (if graded) */}
        {exam.score != null && typeof exam.score === 'number' && (
          <View style={[styles.section, styles.scoreSection]}>
            <Text style={styles.sectionTitle}>Kết quả</Text>
            <View style={styles.scoreContainer}>
              <Ionicons name="star" size={48} color={styles.starIcon.color} />
              <Text style={styles.scoreText}>
                {Number(exam.score).toFixed(1)} / {exam.total_points}
              </Text>
              <Text style={styles.scoreLabel}>điểm</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer with Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, isStartButtonDisabled && styles.startButtonDisabled]}
          onPress={startExam}
          disabled={isStartButtonDisabled || isStarting}
          activeOpacity={0.7}
        >
          {isStarting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={isStartButtonDisabled ? 'lock-closed' : 'play'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.startButtonText}>{getStartButtonText()}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Password Modal */}
      {exam && (
        <PasswordModal
          visible={isPasswordModalVisible}
          onClose={() => setIsPasswordModalVisible(false)}
          onSubmit={handlePasswordSubmit}
          examTitle={exam.title}
        />
      )}
    </SafeAreaView>
  )
}
