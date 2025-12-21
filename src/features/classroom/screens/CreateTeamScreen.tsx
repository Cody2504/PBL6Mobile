import React from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCreateTeamScreen } from '../hooks/use-create-team-screen'
import { createStyles } from './CreateTeamScreen.styles'
import { Colors } from '@/libs/constants/theme'

export default function CreateTeamScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    // State
    teamName,
    description,
    isLoading,

    // Setters
    setTeamName,
    setDescription,

    // Handlers
    handleBack,
    handleDone,
  } = useCreateTeamScreen()

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#0078d4" />
        </Pressable>
        <Text style={styles.headerTitle}>Tạo lớp học</Text>
        <Pressable
          onPress={handleDone}
          style={[styles.doneButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0078d4" />
          ) : (
            <Text style={styles.doneText}>Xong</Text>
          )}
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Tên lớp học</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Cho phép chữ cái, số và khoảng trắng"
            value={teamName}
            onChangeText={setTeamName}
            maxLength={50}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Mô tả (không bắt buộc)</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Thông tin này sẽ giúp mọi người tìm kiếm lớp học của bạn"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
            editable={!isLoading}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Giáo viên là chủ sở hữu lớp học và học sinh tham gia với tư cách
            thành viên. Mỗi lớp học bao gồm một sổ ghi chú lớp.
          </Text>
          <Text style={styles.codeInfo}>
            Mã lớp học gồm 6 ký tự sẽ được tự động tạo để dễ dàng chia sẻ.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
