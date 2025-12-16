import React from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNewConversationScreen } from '../hooks/use-new-conversation-screen'
import { createStyles } from './NewConversationScreen.styles'
import { Colors } from '@/libs/constants/theme'
import { User } from '@/features/profile'

export default function NewConversationScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()

  const {
    searchText,
    recentChats,
    recommendedPeople,
    searchResults,
    isLoading,
    handleSearchTextChange,
    handleClearSearch,
    handleBack,
    handleUserPress,
  } = useNewConversationScreen()

  const renderUserItem = (person: User, index?: number) => {
    const displayName = person.full_name || person.user_name || 'User'
    const avatarText = displayName.charAt(0).toUpperCase()
    const colors = ['#2563EB', '#DC2626', '#16A34A', '#EA580C', '#7C3AED', '#DB2777']
    const avatarColor = typeof index === 'number' ? colors[index % colors.length] : '#2563EB'

    return (
      <Pressable
        key={person.user_id}
        style={styles.userItem}
        onPress={() => handleUserPress(person)}
      >
        <View style={styles.userItemLeft}>
          <View style={[styles.userAvatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.userAvatarText}>{avatarText}</Text>
          </View>
          <View style={styles.userItemInfo}>
            <Text style={styles.userItemTitle}>{displayName}</Text>
            {person.email && (
              <Text style={styles.userItemSubtitle}>{person.email}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chatbox-outline" size={20} color={Colors[colorScheme].textTertiary} />
      </Pressable>
    )
  }

  const renderRecommendedPeople = () => {
    if (searchText.trim() || recommendedPeople.length === 0) return null

    return (
      <View style={styles.recommendedSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
          {recommendedPeople.map((person, index) => {
            const displayName = person.full_name || person.user_name || 'User'
            const avatarText = displayName.charAt(0).toUpperCase()
            const colors = ['#2563EB', '#DC2626', '#16A34A', '#EA580C', '#7C3AED', '#DB2777']
            const avatarColor = colors[index % colors.length]

            return (
              <Pressable
                key={person.user_id}
                style={styles.recommendedItem}
                onPress={() => handleUserPress(person)}
              >
                <View style={[styles.recommendedAvatar, { backgroundColor: avatarColor }]}>
                  <Text style={styles.recommendedAvatarText}>{avatarText}</Text>
                </View>
                <Text style={styles.recommendedName} numberOfLines={1}>
                  {displayName.split(' ')[0]}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const renderRecentChats = () => {
    if (searchText.trim() || recentChats.length === 0) return null

    return (
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Gần đây</Text>
        {recentChats.map((person, index) => renderUserItem(person, index))}
      </View>
    )
  }

  const renderSearchResults = () => {
    if (!searchText.trim()) return null

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={Colors[colorScheme].textTertiary} />
          <Text style={styles.emptyText}>No users found</Text>
          <Text style={styles.emptySubtext}>Try searching for someone else</Text>
        </View>
      )
    }

    return (
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.resultSection}>
          <Text style={styles.resultSectionTitle}>Mọi người</Text>
          {searchResults.map((person, index) => renderUserItem(person, index))}
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors[colorScheme].textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor={Colors[colorScheme].textTertiary}
            value={searchText}
            onChangeText={handleSearchTextChange}
            autoFocus
          />
          {searchText.length > 0 && (
            <Pressable onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={Colors[colorScheme].textTertiary} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={handleBack}>
          <Text style={styles.cancelButton}>Hủy</Text>
        </Pressable>
      </View>

      {/* Recommended People */}
      {renderRecommendedPeople()}

      {/* Content */}
      <View style={styles.content}>
        {renderRecentChats()}
        {renderSearchResults()}
      </View>
    </View>
  )
}
