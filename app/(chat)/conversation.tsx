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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { chatService } from '../../services/chatService';
import { getChatSocket } from '../../services/socket';
import { profileService } from '../../services/profileService';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentType?: 'document' | 'image';
}

const ConversationScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const contactName = (params.contactName as string) || 'User';
  const contactEmail = (params.contactEmail as string) || '';
  const conversationId = params.conversationId ? parseInt(params.conversationId as string) : undefined;
  const propUserId = params.currentUserId ? parseInt(params.currentUserId as string) : undefined;
  const otherUserId = params.receiverId ? parseInt(params.receiverId as string) : undefined;
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<number | null>(propUserId ?? null);
  const messageIdsRef = useRef<Set<string>>(new Set());

  const sanitize = (content?: string | null) => {
    if (typeof content !== 'string') return '';
    return content.trim();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!userId) {
          const profile = await profileService.getProfile();
          if (!mounted) return;
          setUserId(profile?.data?.user_id ?? null);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [propUserId]);

  useEffect(() => {
    let mounted = true;
    let sock: ReturnType<typeof getChatSocket> | null = null;
    (async () => {
      if (!conversationId) return;
      try {
        // Load messages
        const data = await chatService.getMessages(conversationId, 1, 50);
        console.log(data)
        if (!mounted) return;
        const msgs: Message[] = data.messages.map((m) => ({
            id: String(m.id),
          text: sanitize(m.content),
            timestamp: new Date(m.timestamp),
            isSent: userId ? m.sender_id === userId : false,
          }));
        setMessages(msgs);
        messageIdsRef.current = new Set(msgs.map(m => m.id));

        // Mark as read
        if (userId) {
          try { await chatService.markAsRead(conversationId, userId); } catch {}
        }

        // Connect socket
        if (userId) {
          sock = getChatSocket(userId);
          // Join conversation room
          sock.emit('conversation:join', { conversation_id: conversationId, user_id: userId });

          // Receive incoming messages (ignore own-sent to prevent duplicates)
          sock.on('message:received', (payload: any) => {
            if (payload?.conversation_id !== conversationId) return;
            if (payload?.sender_id === userId) return; // don't render own sends from socket
            const idStr = payload?.id ? String(payload.id) : `ts-${Date.now()}`;
            if (payload?.id && messageIdsRef.current.has(String(payload.id))) return;
            const msg: Message = {
              id: idStr,
              text: sanitize(payload?.content),
              timestamp: new Date(payload?.timestamp || new Date().toISOString()),
              isSent: false,
            };
            setMessages((prev) => {
              if (payload?.id) messageIdsRef.current.add(String(payload.id));
              return [...prev, msg];
            });
          });
        }
      } catch (e) {
        console.warn('Failed to init conversation', e);
      }
    })();

    return () => {
      mounted = false;
      try {
        if ((sock as any)?.off) {
          (sock as any).off('message:received');
        }
      } catch {}
    };
  }, [conversationId, userId]);

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    const isSameDay = messageDate.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString();
    
    if (isSameDay) {
      return messageDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (isYesterday) {
      return 'Hôm qua';
    } else {
      return messageDate.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    }
  };

  const formatDateHeader = (date: Date) => {
    return `ngày ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !userId || !conversationId) return;
    const payload = {
      sender_id: userId,
      conversation_id: conversationId,
      content: messageText.trim(),
      message_type: 'text' as const,
      client_id: `client-${Date.now()}`,
    };
    try {
      // Broadcast to others (we will not render this locally)
      getChatSocket(userId).emit('message:send', payload);
      // Persist via API and render only server response
      const res = await chatService.sendMessage({
        sender_id: userId,
        conversation_id: conversationId,
        content: messageText.trim(),
        message_type: 'text',
      });
      const saved = res?.data;
      if (saved) {
        const msg: Message = {
          id: String(saved.id),
          text: sanitize(saved.content),
          timestamp: new Date(saved.timestamp),
          isSent: true,
        };
        setMessages((prev) => {
          if (!messageIdsRef.current.has(msg.id)) {
            messageIdsRef.current.add(msg.id);
            return [...prev, msg];
          }
          return prev;
        });
      }
      setMessageText('');
    } catch (e) {
      console.warn('Failed to send message', e);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const showDateHeader = index === 0 || 
      messages[index - 1].timestamp.toDateString() !== message.timestamp.toDateString();

    // Check if this is the last message in a group of sent messages
    const isLastInSentGroup = message.isSent && (
      index === messages.length - 1 || 
      !messages[index + 1].isSent
    );

    return (
      <View key={message.id}>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(message.timestamp)}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          message.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer
        ]}>
          <View style={[
            styles.messageBubble,
            message.isSent ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text
              style={[
                styles.messageText,
                message.isSent ? styles.sentMessageText : styles.receivedMessageText
              ]}
              numberOfLines={undefined}
            >
              {message.text.trim()}
            </Text>
            
            {message.hasAttachment && (
              <View style={styles.attachmentContainer}>
                <View style={styles.attachmentPreview}>
                  <View style={styles.documentIcon}>
                    <Text style={styles.documentIconText}>W</Text>
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {message.attachmentName}
                    </Text>
                    <Text style={styles.attachmentSize}>
                      {message.attachmentSize}
                    </Text>
                  </View>
                  <Pressable style={styles.attachmentMenu}>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
        
        {/* Show status only under the last message in sent group */}
        {isLastInSentGroup && (
          <View style={styles.messageStatus}>
            <Ionicons name="checkmark-done" size={14} color="#6264a7" style={styles.statusIcon} />
            <Text style={styles.statusText}>
              Đã gửi {formatMessageDate(message.timestamp)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
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
        
        <View style={styles.headerActions}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <Pressable style={styles.attachButton}>
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
        
        <Pressable style={styles.emojiButton}>
          <Ionicons name="happy-outline" size={24} color="#666" />
        </Pressable>
        
        <Pressable style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color="#666" />
        </Pressable>
        
        <Pressable style={styles.micButton}>
          <Ionicons name="mic-outline" size={24} color="#666" />
        </Pressable>
        <Pressable style={{ padding: 8, marginLeft: 4 }} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#6264a7" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90c695',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff9500',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  lastSeen: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 2,
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sentMessage: {
    backgroundColor: '#6264a7',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  attachmentContainer: {
    marginTop: 8,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  documentIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#2b5797',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  attachmentMenu: {
    padding: 4,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
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
  },
  emojiButton: {
    padding: 8,
    marginLeft: 8,
  },
  cameraButton: {
    padding: 8,
    marginLeft: 4,
  },
  micButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ConversationScreen;