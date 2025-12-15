import React, { useState } from 'react'
import { View, Text, Pressable, FlatList, TextInput, RefreshControl, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ChatConversationItem from '@/features/chat/components/ChatItem'
import { useChatListScreen, ConversationItemUI } from '../hooks/use-chat-list-screen'
import { createStyles } from './ChatListScreen.styles'
import { Colors } from '@/libs/constants/theme'

const ChatScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const [showSearch, setShowSearch] = useState(false)
  const {
    searchText,
    activeFilter,
    filteredConversations,
    filters,
    setSearchText,
    setActiveFilter,
    handleConversationPress,
  } = useChatListScreen()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // Reload will happen on next mount via useEffect
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleNewChat = () => {
    router.push('/(chat)/new-conversation')
  }

  const renderConversationItem = ({ item }: { item: ConversationItemUI }) => (
    <ChatConversationItem
      {...item}
      onPress={() => handleConversationPress(item)}
    />
  )

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
          <Pressable style={styles.iconButton} onPress={() => setShowSearch(!showSearch)}>
            <Ionicons name="search-outline" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors[colorScheme].textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor={Colors[colorScheme].inputPlaceholder}
            autoFocus
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={Colors[colorScheme].textSecondary} />
            </Pressable>
          )}
        </View>
      )}

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
              color={activeFilter === filter.key ? Colors[colorScheme].textInverse : Colors[colorScheme].textSecondary}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6264a7']}
            tintColor="#6264a7"
          />
        }
      />

      {/* See More */}
      <Pressable style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>Xem thêm</Text>
      </Pressable>

      {/* New Chat Button */}
      <Pressable style={styles.newChatButton} onPress={handleNewChat}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.newChatText}>Tin nhắn mới</Text>
      </Pressable>
    </View>
  )
}

export default ChatScreen
