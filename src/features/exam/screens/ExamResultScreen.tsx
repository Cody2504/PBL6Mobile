import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { createStyles } from './ExamResultScreen.styles'

export default function ExamResultScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const router = useRouter()
  const params = useLocalSearchParams<{ submissionId: string }>()

  const handleBackToExams = () => {
    router.replace('/(exam)/list')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color={styles.successIcon.color} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Nộp bài thành công!</Text>

        {/* Message */}
        <Text style={styles.message}>
          Bài thi của bạn đã được nộp thành công. Kết quả sẽ được thông báo sau khi giáo viên chấm
          điểm.
        </Text>

        {/* Submission info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={20} color={styles.infoIcon.color} />
            <Text style={styles.infoLabel}>Mã bài nộp:</Text>
            <Text style={styles.infoValue}>#{params.submissionId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={styles.infoIcon.color} />
            <Text style={styles.infoLabel}>Thời gian nộp:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.button_primary]}
            onPress={handleBackToExams}
          >
            <Ionicons name="list" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
