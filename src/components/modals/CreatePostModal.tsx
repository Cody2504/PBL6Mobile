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
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as DocumentPicker from 'expo-document-picker'
import { classService, FileUpload } from '@/features/classroom'
import { formatFileSize } from '@/libs/utils'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface CreatePostModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
  groupName: string
  classId: number
  uploaderId: number
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSuccess,
  groupName,
  classId,
  uploaderId,
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<FileUpload[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const titleInputRef = useRef<TextInput>(null)
  const contentInputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
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
        titleInputRef.current?.focus()
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
  }, [visible])

  const handleClose = () => {
    Keyboard.dismiss()
    setTitle('')
    setContent('')
    setSelectedFiles([])
    setIsSubmitting(false)
    onClose()
  }

  const handleSubmit = async () => {
    if (!title.trim() && !content.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      console.log('=== Post Submission Debug ===')
      console.log('Class ID:', classId)
      console.log('Uploader ID:', uploaderId)
      console.log('Title:', title.trim())
      console.log('Message:', content.trim())
      console.log('Files count:', selectedFiles.length)
      console.log(
        'Files:',
        selectedFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.mimeType,
        })),
      )

      await classService.uploadPostWithFiles(classId, {
        uploader_id: uploaderId,
        class_id: classId,
        title: title.trim(),
        message: content.trim(),
        files: selectedFiles,
      })

      Alert.alert('Success', 'Post created successfully')

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      handleClose()
    } catch (error) {
      console.error('Error creating post:', error)
      Alert.alert('Error', 'Failed to create post. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleTitleSubmit = () => {
    contentInputRef.current?.focus()
  }

  const MAX_FILES = 10
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

  const handlePickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // All file types
        multiple: true, // Allow multiple selection
        copyToCacheDirectory: true, // Required for upload
      })

      if (result.canceled) {
        return
      }

      // Handle result - expo-document-picker returns assets array
      const newFiles: FileUpload[] = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size || 0,
        mimeType: asset.mimeType || 'application/octet-stream',
      }))

      // Check file count limit
      if (selectedFiles.length + newFiles.length > MAX_FILES) {
        Alert.alert(
          'Limit Exceeded',
          `You can only attach up to ${MAX_FILES} files`,
        )
        return
      }

      // Check file size limit
      const oversizedFile = newFiles.find((f) => (f.size || 0) > MAX_FILE_SIZE)
      if (oversizedFile) {
        Alert.alert(
          'File Too Large',
          `${oversizedFile.name} exceeds 50 MB limit`,
        )
        return
      }

      setSelectedFiles((prev) => [...prev, ...newFiles])
    } catch (error) {
      console.error('Error picking files:', error)
      Alert.alert('Error', 'Failed to select files')
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
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
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bài đăng mới</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || (!title.trim() && !content.trim())}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#0078d4" />
              ) : (
                <Icon
                  name="send"
                  size={24}
                  color={title.trim() || content.trim() ? '#0078d4' : '#ccc'}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Group Name */}
          <View style={styles.groupInfoContainer}>
            <Text style={styles.groupNameText}>{groupName}</Text>
          </View>

          {/* Text Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="Thêm chủ đề"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              onSubmitEditing={handleTitleSubmit}
              blurOnSubmit={false}
            />
            <TextInput
              ref={contentInputRef}
              style={styles.contentInput}
              placeholder="Bắt đầu một cuộc hội thoại mới. Hãy nhập @ để đề cập đến một người nào đó."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <View style={styles.selectedFilesContainer}>
              <Text style={styles.selectedFilesHeader}>
                Attached Files ({selectedFiles.length})
              </Text>
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileChip}>
                  <Icon name="file-document" size={20} color="#0078d4" />
                  <View style={styles.fileChipInfo}>
                    <Text style={styles.fileChipName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileChipSize}>
                      {formatFileSize(file.size || 0)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                    <Icon name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.addFileButton}
              onPress={handlePickFiles}
              disabled={isSubmitting}
            >
              <Icon name="plus-circle" size={32} color="#0078d4" />
            </TouchableOpacity>
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
    maxHeight: SCREEN_HEIGHT * 0.75,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  groupInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  groupNameText: {
    fontSize: 13,
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 200,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    paddingVertical: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  addFileButton: {
    padding: 4,
  },
  selectedFilesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    maxHeight: 200,
  },
  selectedFilesHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileChipInfo: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  fileChipName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  fileChipSize: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
})

export default CreatePostModal
