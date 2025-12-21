import { useState, useEffect, useRef, useCallback } from 'react'
import { ScrollView } from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { chatbotService } from '../api'
import { useAuth } from '@/global/context'
import type { ChatbotMessage } from '../types'

export function useChatbotConversationScreen() {
    const { user } = useAuth()
    const scrollViewRef = useRef<ScrollView>(null)
    const threadIdRef = useRef<string>('')

    const [messages, setMessages] = useState<ChatbotMessage[]>([])
    const [messageText, setMessageText] = useState('')
    const [threadId, setThreadId] = useState<string>('')
    const [streamingMessage, setStreamingMessage] = useState<string>('')
    const [isStreaming, setIsStreaming] = useState(false)
    const [isStarting, setIsStarting] = useState(true)

    // Keep threadIdRef in sync for use in callbacks
    useEffect(() => {
        threadIdRef.current = threadId
    }, [threadId])

    // Initialize chatbot on mount
    useEffect(() => {
        initializeChatbot()
    }, [user?.user_id])

    const initializeChatbot = useCallback(async () => {
        try {
            let storedThreadId = await AsyncStorage.getItem('chatbot_thread_id')

            if (!storedThreadId) {
                storedThreadId = `thread_${user?.user_id || 'guest'}_${Date.now()}`
                await AsyncStorage.setItem('chatbot_thread_id', storedThreadId)
            }

            setThreadId(storedThreadId)
            threadIdRef.current = storedThreadId

            const storedMessages = await AsyncStorage.getItem(
                `chatbot_messages_${storedThreadId}`,
            )
            if (storedMessages) {
                try {
                    const parsed = JSON.parse(storedMessages)
                    setMessages(
                        parsed.map((msg: any) => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp),
                        })),
                    )
                    setIsStarting(false)
                } catch (e) {
                    console.error('Failed to parse stored messages', e)
                }
            }
        } catch (error) {
            console.error('Failed to initialize chatbot:', error)
        }
    }, [user?.user_id])

    const saveMessages = useCallback(async (msgs: ChatbotMessage[]) => {
        const currentThreadId = threadIdRef.current
        if (currentThreadId) {
            try {
                await AsyncStorage.setItem(
                    `chatbot_messages_${currentThreadId}`,
                    JSON.stringify(msgs),
                )
            } catch (error) {
                console.error('Failed to save messages:', error)
            }
        }
    }, [])

    const sendMessage = useCallback(async () => {
        if (!messageText.trim() || !user || isStreaming) return

        const userMessage: ChatbotMessage = {
            id: `user_${Date.now()}`,
            content: messageText.trim(),
            role: 'user',
            timestamp: new Date(),
        }

        const currentThreadId = threadIdRef.current
        const updatedMessages = [...messages, userMessage]

        setMessages(updatedMessages)
        setMessageText('')
        setIsStreaming(true)
        setStreamingMessage('')
        setIsStarting(false)

        const assistantMessageId = `assistant_${Date.now()}`

        try {
            // Map role: backend only accepts 'student' or 'teacher'
            const userRole = user.role === 'teacher' ? 'teacher' : 'student'

            const fullResponse = await chatbotService.sendMessage(
                {
                    threadId: currentThreadId,
                    message: userMessage.content,
                    userId: user.user_id,
                    userRole,
                },
                (chunk) => {
                    setStreamingMessage((prev) => prev + chunk)
                },
            )

            const assistantMessage: ChatbotMessage = {
                id: assistantMessageId,
                content: fullResponse,
                role: 'assistant',
                timestamp: new Date(),
            }

            const finalMessages = [...updatedMessages, assistantMessage]
            setMessages(finalMessages)
            await saveMessages(finalMessages)
            setStreamingMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
            const errorMessage: ChatbotMessage = {
                id: `error_${Date.now()}`,
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
                role: 'assistant',
                timestamp: new Date(),
            }
            const finalMessages = [...updatedMessages, errorMessage]
            setMessages(finalMessages)
            await saveMessages(finalMessages)
        } finally {
            setIsStreaming(false)
        }
    }, [messageText, user, isStreaming, messages, saveMessages])

    const clearChat = useCallback(async () => {
        try {
            const oldThreadId = threadIdRef.current
            const newThreadId = `thread_${user?.user_id || 'guest'}_${Date.now()}`

            // Update state and ref
            setThreadId(newThreadId)
            threadIdRef.current = newThreadId

            await AsyncStorage.setItem('chatbot_thread_id', newThreadId)

            // Remove old messages using the captured threadId
            if (oldThreadId) {
                await AsyncStorage.removeItem(`chatbot_messages_${oldThreadId}`)
            }

            setMessages([])
            setIsStarting(true)
        } catch (error) {
            console.error('Failed to clear chat:', error)
        }
    }, [user?.user_id])

    const handleBack = useCallback(() => {
        router.back()
    }, [])

    const formatMessageDate = useCallback((date: Date) => {
        const now = new Date()
        const messageDate = new Date(date)

        const isSameDay = messageDate.toDateString() === now.toDateString()

        if (isSameDay) {
            return messageDate.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            })
        } else {
            return messageDate.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            })
        }
    }, [])

    const scrollToEnd = useCallback(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
    }, [])

    return {
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
    }
}
