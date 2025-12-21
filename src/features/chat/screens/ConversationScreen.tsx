import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useConversationScreen } from '../hooks/use-conversation-screen'
import { createStyles } from './ConversationScreen.styles'
import { Colors } from '@/libs/constants/theme'

interface Message {
  id: string
  text: string
  timestamp: Date
  isSent: boolean
  hasAttachment?: boolean
  attachmentName?: string
  attachmentSize?: string
  attachmentType?: 'document' | 'image'
}

const ConversationScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    contactName,
    messageText,
    messages,
    scrollViewRef,
    attachedFile,
    isUploading,
    refreshing,
    setMessageText,
    sendMessage,
    sendMessageWithFile,
    handleBack,
    formatMessageDate,
    formatDateHeader,
    handleFileSelect,
    handleRemoveFile,
    handleDownloadFile,
    onRefresh,
  } = useConversationScreen()

  const renderMessage = (message: Message, index: number) => {
    const showDateHeader =
      index === 0 ||
      messages[index - 1].timestamp.toDateString() !==
      message.timestamp.toDateString()

    // Check if this is the last message in a group of sent messages
    const isLastInSentGroup =
      message.isSent &&
      (index === messages.length - 1 || !messages[index + 1].isSent)

    return (
      <View key={`msg-${message.id}-${index}`}>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(message.timestamp)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            message.isSent
              ? styles.sentMessageContainer
              : styles.receivedMessageContainer,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              message.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isSent
                  ? styles.sentMessageText
                  : styles.receivedMessageText,
              ]}
              numberOfLines={undefined}
            >
              {message.text.trim()}
            </Text>

            {message.hasAttachment && (
              <Pressable onPress={() => handleDownloadFile(message)}>
                <View style={styles.attachmentContainer}>
                  <View style={styles.attachmentPreview}>
                    <View style={styles.documentIcon}>
                      <Ionicons
                        name={
                          message.attachmentType === 'image'
                            ? 'image'
                            : 'document'
                        }
                        size={20}
                        color="#6264a7"
                      />
                    </View>
                    <View style={styles.attachmentInfo}>
                      <Text style={styles.attachmentName} numberOfLines={1}>
                        {message.attachmentName}
                      </Text>
                      <Text style={styles.attachmentSize}>
                        {message.attachmentSize}
                      </Text>
                    </View>
                    <Ionicons name="download" size={16} color="#666" />
                  </View>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Show status only under the last message in sent group */}
        {isLastInSentGroup && (
          <View style={styles.messageStatus}>
            <Ionicons
              name="checkmark-done"
              size={14}
              color="#6264a7"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>
              Đã gửi {formatMessageDate(message.timestamp)}
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>

        <View style={styles.contactInfo}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactAvatarText}>N</Text>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contactName}</Text>
            <Text style={styles.lastSeen}>Xem gần nhất: 10:44</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6264a7']}
            tintColor="#6264a7"
          />
        }
      >
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>

      {/* File Preview */}
      {attachedFile && (
        <View style={styles.filePreviewContainer}>
          <View style={styles.filePreview}>
            <Ionicons name="document-attach" size={20} color="#6264a7" />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {attachedFile.name}
              </Text>
              <Text style={styles.fileSize}>
                {attachedFile.size
                  ? `${(attachedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : ''}
              </Text>
            </View>
            <Pressable
              onPress={handleRemoveFile}
              style={styles.removeFileButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          </View>
          {isUploading && (
            <View style={styles.uploadProgress}>
              <ActivityIndicator size="small" color="#6264a7" />
              <Text style={styles.uploadText}>Đang tải lên...</Text>
            </View>
          )}
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <Pressable
          style={styles.attachButton}
          onPress={handleFileSelect}
          disabled={isUploading}
        >
          <Ionicons name="add-circle" size={24} color="#6264a7" />
        </Pressable>

        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Nhập tin nhắn"
          multiline
          maxLength={1000}
        />

        <Pressable
          style={styles.sendButton}
          onPress={attachedFile ? sendMessageWithFile : sendMessage}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size={22} color="#6264a7" />
          ) : (
            <Ionicons name="send" size={22} color="#6264a7" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ConversationScreen
