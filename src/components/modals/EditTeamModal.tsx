import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { classService } from '@/features/classroom'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface EditTeamModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: (updatedData: TeamData) => void
  teamData: TeamData
}

interface TeamData {
  class_id: string
  class_name: string
  description: string
  class_code: string
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  visible,
  onClose,
  onSuccess,
  teamData,
}) => {
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [classCode, setClassCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const teamNameInputRef = useRef<TextInput>(null)
  const descriptionInputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      console.log('EditTeamModal visible, teamData:', teamData)
      // Set initial values from teamData
      setTeamName(teamData.class_name)
      setDescription(teamData.description)
      setClassCode(teamData.class_code)

      // Animate modal sliding up
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Focus on input after animation
      setTimeout(() => {
        teamNameInputRef.current?.focus()
      }, 300)
    } else {
      // Animate modal sliding down
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, teamData])

  const handleClose = () => {
    Keyboard.dismiss()
    setIsSubmitting(false)
    onClose()
  }

  const handleSave = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Team name cannot be empty')
      return
    }

    try {
      setIsSubmitting(true)

      await classService.updateClass({
        class_id: teamData.class_id,
        class_name: teamName.trim(),
        description: description.trim(),
        class_code: classCode,
      })

      Alert.alert('Success', 'Team information updated successfully')

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess({
          class_id: teamData.class_id,
          class_name: teamName.trim(),
          description: description.trim(),
          class_code: classCode,
        })
      }

      handleClose()
    } catch (error) {
      console.error('Error updating team:', error)
      Alert.alert(
        'Error',
        'Failed to update team information. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleRegenerateClassCode = () => {
    Alert.alert(
      'Regenerate Class Code',
      'Are you sure you want to generate a new class code? This will invalidate the current code.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            let newCode = ''
            for (let i = 0; i < 6; i++) {
              newCode += characters.charAt(
                Math.floor(Math.random() * characters.length),
              )
            }
            setClassCode(newCode)
          },
        },
      ],
    )
  }

  const handleTeamNameSubmit = () => {
    descriptionInputRef.current?.focus()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        {/* Overlay */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Team Info</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting || !teamName.trim()}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#0078d4" />
              ) : (
                <Text
                  style={[
                    styles.saveText,
                    !teamName.trim() && styles.saveTextDisabled,
                  ]}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Content - Text Input Area */}
          <View style={styles.inputContainer}>
            {/* Team Name Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Team Name</Text>
              <TextInput
                ref={teamNameInputRef}
                style={styles.textInput}
                placeholder="Enter team name"
                placeholderTextColor="#999"
                value={teamName}
                onChangeText={setTeamName}
                returnKeyType="next"
                onSubmitEditing={handleTeamNameSubmit}
                blurOnSubmit={false}
                editable={!isSubmitting}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                ref={descriptionInputRef}
                style={[styles.textInput, styles.descriptionInput]}
                placeholder="Enter team description"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Class Code Section */}
            <View style={styles.inputSection}>
              <View style={styles.codeHeader}>
                <Text style={styles.inputLabel}>Class Code</Text>
                <TouchableOpacity
                  onPress={handleRegenerateClassCode}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.regenerateLink,
                      isSubmitting && styles.regenerateLinkDisabled,
                    ]}
                  >
                    Regenerate
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.codeDisplay}>
                <Text style={styles.codeDisplayText}>{classCode}</Text>
              </View>
              <Text style={styles.codeHelpText}>
                Share this code with students to join the team
              </Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: SCREEN_HEIGHT * 0.55,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  saveTextDisabled: {
    color: '#ccc',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 150,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  descriptionInput: {
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regenerateLink: {
    fontSize: 14,
    color: '#0078d4',
    fontWeight: '500',
  },
  regenerateLinkDisabled: {
    color: '#ccc',
  },
  codeDisplay: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  codeDisplayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 2,
  },
  codeHelpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 20,
  },
})

export default EditTeamModal
