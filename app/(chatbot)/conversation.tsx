import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { chatbotService, ChatbotMessage } from '../../services/chatbotService';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatbotScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    initializeChatbot();
  }, []);

  const initializeChatbot = async () => {
    let storedThreadId = await AsyncStorage.getItem('chatbot_thread_id');

    if (!storedThreadId) {
      storedThreadId = `thread_${user?.id || 'guest'}_${Date.now()}`;
      await AsyncStorage.setItem('chatbot_thread_id', storedThreadId);
    }

    setThreadId(storedThreadId);

    const storedMessages = await AsyncStorage.getItem(`chatbot_messages_${storedThreadId}`);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse stored messages', e);
      }
    }
  };

  const saveMessages = async (msgs: ChatbotMessage[]) => {
    if (threadId) {
      await AsyncStorage.setItem(`chatbot_messages_${threadId}`, JSON.stringify(msgs));
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user || isStreaming) return;

    const userMessage: ChatbotMessage = {
      id: `user_${Date.now()}`,
      content: messageText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessageText('');
    setIsStreaming(true);
    setStreamingMessage('');

    const assistantMessageId = `assistant_${Date.now()}`;

    try {
      const fullResponse = await chatbotService.sendMessage(
        {
          threadId: threadId,
          message: userMessage.content,
          userId: parseInt(user.id),
          userRole: user.role as 'teacher' | 'user' | 'admin',
        },
        (chunk) => {
          setStreamingMessage((prev) => prev + chunk);
        }
      );

      const assistantMessage: ChatbotMessage = {
        id: assistantMessageId,
        content: fullResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
      setStreamingMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatbotMessage = {
        id: `error_${Date.now()}`,
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        role: 'assistant',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = async () => {
    const newThreadId = `thread_${user?.id || 'guest'}_${Date.now()}`;
    setThreadId(newThreadId);
    await AsyncStorage.setItem('chatbot_thread_id', newThreadId);
    await AsyncStorage.removeItem(`chatbot_messages_${threadId}`);
    setMessages([]);
  };

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    const isSameDay = messageDate.toDateString() === now.toDateString();

    if (isSameDay) {
      return messageDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    }
  };

  const renderMessage = (message: ChatbotMessage) => {
    const isUser = message.role === 'user';

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.botAvatarContainer}>
            <Ionicons name="chatbox" size={24} color="#6264a7" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.assistantMessage
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {message.content}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.assistantTimestamp
          ]}>
            {formatMessageDate(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderStreamingMessage = () => {
    if (!isStreaming || !streamingMessage) return null;

    return (
      <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
        <View style={styles.botAvatarContainer}>
          <Ionicons name="chatbox" size={24} color="#6264a7" />
        </View>
        <View style={[styles.messageBubble, styles.assistantMessage]}>
          <Text style={styles.assistantMessageText}>
            {streamingMessage}
          </Text>
          <ActivityIndicator size="small" color="#6264a7" style={styles.streamingIndicator} />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
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
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && !isStreaming && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={80} color="#e0e0e0" />
            <Text style={styles.emptyStateTitle}>Xin chào!</Text>
            <Text style={styles.emptyStateText}>
              Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về học tập, bài tập, hoặc lớp học.
            </Text>
          </View>
        )}

        {messages.map(renderMessage)}
        {renderStreamingMessage()}
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
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
          style={[styles.sendButton, (!messageText.trim() || isStreaming) && styles.sendButtonDisabled]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  botHeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  botAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
  },
  userMessage: {
    backgroundColor: '#6264a7',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: '#999',
  },
  streamingIndicator: {
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6264a7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatbotScreen;
