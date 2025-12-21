import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { createStyles } from './PasswordModal.styles'

interface PasswordModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (password: string) => Promise<boolean>
  examTitle: string
}

export default function PasswordModal({
  visible,
  onClose,
  onSubmit,
  examTitle,
}: PasswordModalProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const [password, setPassword] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      return
    }

    setError(null)
    setIsVerifying(true)

    try {
      const isValid = await onSubmit(password)

      if (!isValid) {
        setError('Mật khẩu không đúng')
        setPassword('')
      }
    } catch (err) {
      setError('Không thể xác thực mật khẩu. Vui lòng thử lại.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError(null)
    setShowPassword(false)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={32} color={styles.icon.color} />
            </View>

            <Text style={styles.title}>Bài thi có mật khẩu</Text>
            <Text style={styles.examTitle} numberOfLines={2}>
              {examTitle}
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.label}>Nhập mật khẩu để bắt đầu</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={password}
                onChangeText={text => {
                  setPassword(text)
                  setError(null)
                }}
                placeholder="Mật khẩu"
                placeholderTextColor={styles.placeholder.color}
                secureTextEntry={!showPassword}
                autoFocus
                editable={!isVerifying}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isVerifying}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={styles.eyeIcon.color}
                />
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={styles.errorIcon.color} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isVerifying}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isVerifying && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isVerifying || !password.trim()}
              activeOpacity={0.7}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Xác nhận</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
