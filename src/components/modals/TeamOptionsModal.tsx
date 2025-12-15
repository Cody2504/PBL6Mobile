import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Modal, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import JoinTeamModal from './JoinTeamModal'
import { useAuth } from '@/global/context'

interface TeamOptionsModalProps {
  visible: boolean
  onClose: () => void
  onCreateTeam: () => void
  onBrowseTeams: () => void
  onJoinWithCode: () => void
}

const TeamOptionsModal: React.FC<TeamOptionsModalProps> = ({
  visible,
  onClose,
  onCreateTeam,
  onBrowseTeams,
  onJoinWithCode,
}) => {
  const insets = useSafeAreaInsets()
  const { isTeacher } = useAuth()
  const [showJoinModal, setShowJoinModal] = useState(false)

  const handleJoinWithCode = () => {
    onClose()
    setShowJoinModal(true)
  }

  const handleJoinTeam = (code: string) => {
    setShowJoinModal(false)
    Alert.alert('Success', `Attempting to join team with code: ${code}`, [
      {
        text: 'OK',
        onPress: () => {
          onJoinWithCode()
        },
      },
    ])
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={[styles.modalContent, { paddingBottom: 0 }]}>
            <View style={styles.dragIndicator} />

            {/* Only show "Create a team" for teachers */}
            {isTeacher() && (
              <Pressable style={styles.option} onPress={onCreateTeam}>
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#0078d4"
                  />
                </View>
                <Text style={styles.optionText}>Tạo mới lớp học</Text>
              </Pressable>
            )}

            {/* Both teacher and student can join with code */}
            <Pressable style={styles.option} onPress={handleJoinWithCode}>
              <View style={styles.optionIcon}>
                <Ionicons name="qr-code-outline" size={24} color="#0078d4" />
              </View>
              <Text style={styles.optionText}>Tham gia lớp học bằng mã</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <JoinTeamModal
        visible={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinTeam}
      />
    </>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 10,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  optionIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
    flex: 1,
  },
})

export default TeamOptionsModal
