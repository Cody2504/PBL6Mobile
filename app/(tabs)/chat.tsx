import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ChatConversationItem from '../../components/chat/ChatItem';
import { profileService } from '../../services/profileService';
import { chatService, ConversationDto } from '../../services/chatService';

interface ConversationItemUI {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
  hasNewMessage?: boolean;
  type: 'group' | 'individual';
  conversationId: number;
  receiverId: number;
}

const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'unread' | 'mentions'>('recent');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationItemUI[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const profile = await profileService.getProfile();
        const uid = profile?.data?.user_id;
        if (!uid) return;
        if (!mounted) return;
        setCurrentUserId(uid);

        const convs: ConversationDto[] = await chatService.listConversations(uid, 1, 50);
        const unreadList = await chatService.getUnreadByConversation(uid);
        const unreadMap = new Map(unreadList.map(i => [i.conversation_id, i.unread_count]));

        const formatTs = (iso?: string) => {
          if (!iso) return '';
          const d = new Date(iso);
          const now = new Date();
          const sameDay = d.toDateString() === now.toDateString();
          if (sameDay) {
            return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          }
          return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        };

        const items: ConversationItemUI[] = (convs || []).map((c) => {
          const otherId = c.sender_id === uid ? c.receiver_id : c.sender_id;
          const last = c.last_message;
          const hasNew = (unreadMap.get(c.id) || 0) > 0;
          return {
            id: String(c.id),
            conversationId: c.id,
            receiverId: otherId,
            name: c.receiver_name || `User #${otherId}`,
            lastMessage: last?.content || '',
            timestamp: formatTs(last?.timestamp),
            type: 'individual',
            hasNewMessage: hasNew,
          };
        });

        if (mounted) setConversations(items);
      } catch (e) {
        console.warn('Failed to load conversations', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filters = [
    { key: 'recent', label: 'Gần đây', icon: 'time-outline' },
    { key: 'unread', label: 'Chưa đọc', icon: 'radio-button-off-outline' },
    { key: 'mentions', label: 'Đề cập', icon: 'at' },
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchText.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleConversationPress = (conversation: ConversationItemUI) => {
    router.push({
      pathname: '/(chat)/conversation',
      params: {
        contactName: conversation.name,
        contactEmail: conversation.name,
        conversationId: conversation.conversationId,
        receiverId: conversation.receiverId,
        currentUserId: currentUserId || 0,
      },
    });
  };

  const renderConversationItem = ({ item }: { item: ConversationItemUI }) => (
    <ChatConversationItem
      {...item}
      onPress={() => handleConversationPress(item)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VH</Text>
          </View>
          <Text style={styles.headerTitle}>Trò chuyện</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <Pressable
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter.key as any)}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={activeFilter === filter.key ? '#fff' : '#666'}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Conversations Section */}
      <View style={styles.conversationsHeader}>
        <Pressable style={styles.conversationsTitle}>
          <Ionicons name="chevron-down" size={16} color="#000" />
          <Text style={styles.conversationsTitleText}>Cuộc trò chuyện</Text>
        </Pressable>
        <Pressable style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </Pressable>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />

      {/* See More */}
      <Pressable style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>Xem thêm</Text>
      </Pressable>

      {/* New Chat Button */}
      <Pressable style={styles.newChatButton}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.newChatText}>Tin nhắn mới</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4a261',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  microsoftTeamsIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  teamsSquare: {
    width: 8,
    height: 8,
    margin: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  activeFilterButton: {
    backgroundColor: '#5b5fc7',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  conversationsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationsTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  conversationsList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  seeMoreButton: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#5b5fc7',
    fontWeight: '500',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5b5fc7',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newChatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ChatScreen;