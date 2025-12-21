import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { classService } from '@/features/classroom'
import { useAuth, useToast } from '@/global/context'

interface JoinTeamModalProps {
  visible: boolean
  onClose: () => void
  onJoin: (code: string) => void
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  visible,
  onClose,
  onJoin,
}) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { showSuccess, showError, showWarning } = useToast()

  const handleJoin = async () => {
    if (code.trim() === '') {
      showWarning('Vui lòng nhập mã lớp học')
      return
    }

    if (!user?.user_id) {
      showError('Người dùng chưa xác thực')
      return
    }

    setLoading(true)

    try {
      const userId = user.user_id

      await classService.joinClassWithCode(code.trim(), {
        user_id: userId,
      })

      showSuccess('Tham gia lớp học thành công!')
      setCode('')
      onClose()
      onJoin(code.trim()) // Notify parent component
    } catch (error: any) {
      console.error('Error joining class:', error)
      const errorMessage =
        error.message ||
        'Tham gia lớp thất bại. Vui lòng kiểm tra mã và thử lại.'
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setCode('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tham gia lớp học bằng mã</Text>

          <TextInput
            style={styles.codeInput}
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholderTextColor="#999"
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.cancelButton, loading && styles.buttonDisabled]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </Pressable>

            <Pressable
              style={[styles.joinButton, loading && styles.buttonDisabled]}
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0078d4" />
              ) : (
                <Text style={styles.joinButtonText}>Tham gia</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 40,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  joinButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
})

export default JoinTeamModal
