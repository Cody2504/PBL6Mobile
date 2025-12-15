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
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useChatbotConversationScreen } from '../hooks/use-chatbot-conversation-screen'
import { styles } from './ChatbotConversationScreen.styles'
import type { ChatbotMessage } from '../types'

const ChatbotScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const {
    // Refs
    scrollViewRef,

    // State
    messages,
    messageText,
    streamingMessage,
    isStreaming,
    isStarting,

    // Setters
    setMessageText,

    // Handlers
    sendMessage,
    clearChat,
    handleBack,
    formatMessageDate,
    scrollToEnd,
  } = useChatbotConversationScreen()

  const renderMessage = (message: ChatbotMessage) => {
    const isUser = message.role === 'user'

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser
            ? styles.userMessageContainer
            : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatarContainer}>
            <Ionicons name="chatbox" size={24} color="#6264a7" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.assistantMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.assistantMessageText,
            ]}
          >
            {message.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatMessageDate(message.timestamp)}
          </Text>
        </View>
      </View>
    )
  }

  const renderStreamingMessage = () => {
    if (!isStreaming || !streamingMessage) return null

    return (
      <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
        <View style={styles.botAvatarContainer}>
          <Ionicons name="chatbox" size={24} color="#6264a7" />
        </View>
        <View style={[styles.messageBubble, styles.assistantMessage]}>
          <Text style={styles.assistantMessageText}>{streamingMessage}</Text>
          <ActivityIndicator
            size="small"
            color="#6264a7"
            style={styles.streamingIndicator}
          />
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>

        <View style={styles.headerLeft}>
          <View style={styles.botHeaderAvatar}>
            <Ionicons name="chatbox" size={28} color="#6264a7" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Trợ lý AI</Text>
            <Text style={styles.headerSubtitle}>Hỗ trợ học tập</Text>
          </View>
        </View>

        <Pressable style={styles.clearButton} onPress={clearChat}>
          <Ionicons name="trash-outline" size={22} color="#666" />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
      >
        {isStarting && messages.length === 0 && !isStreaming && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={80} color="#e0e0e0" />
            <Text style={styles.emptyStateTitle}>Xin chào!</Text>
            <Text style={styles.emptyStateText}>
              Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về học tập,
              bài tập, hoặc lớp học.
            </Text>
          </View>
        )}

        {messages.map(renderMessage)}
        {renderStreamingMessage()}
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#999"
          multiline
          maxLength={2000}
          editable={!isStreaming}
        />

        <Pressable
          style={[
            styles.sendButton,
            (!messageText.trim() || isStreaming) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!messageText.trim() || isStreaming}
        >
          {isStreaming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChatbotScreen
