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
import { useSearchScreen, SearchCategory, SearchResult } from '../hooks/use-search-screen'
import { createStyles } from './SearchScreen.styles'
import { Colors } from '@/libs/constants/theme'

const CATEGORIES: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'people', label: 'Mọi người' },
  { id: 'messages', label: 'Tin nhắn' },
  { id: 'files', label: 'Tệp' },
]

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()

  const {
    searchText,
    activeCategory,
    recentSearches,
    recommendedPeople,
    searchResults,
    isLoading,
    handleSearchTextChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleRecentSearchPress,
    handleClearSearch,
    removeRecentSearch,
    handleBack,
    handleResultPress,
  } = useSearchScreen()

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

            const personResult = {
              id: `user-${person.user_id}`,
              type: 'person' as const,
              title: displayName,
              subtitle: person.email,
            }

            return (
              <Pressable
                key={person.user_id}
                style={styles.recommendedItem}
                onPress={() => handleResultPress(personResult)}
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

  const renderRecentSearches = () => {
    if (searchText.trim() || recentSearches.length === 0) return null

    return (
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Gần đây</Text>
        {recentSearches.map((search, index) => (
          <View key={index} style={styles.recentItem}>
            <Ionicons name="time-outline" size={20} color={Colors[colorScheme].textTertiary} />
            <Pressable
              style={styles.recentItemText}
              onPress={() => handleRecentSearchPress(search)}
            >
              <Text style={styles.recentText}>{search}</Text>
            </Pressable>
            <Pressable onPress={() => removeRecentSearch(search)}>
              <Ionicons name="close" size={20} color={Colors[colorScheme].textTertiary} />
            </Pressable>
          </View>
        ))}
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
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try searching for something else</Text>
        </View>
      )
    }

    // Group results by type
    const peopleResults = searchResults.filter(r => r.type === 'person')
    const messageResults = searchResults.filter(r => r.type === 'message')
    const fileResults = searchResults.filter(r => r.type === 'file')

    return (
      <ScrollView style={styles.resultsContainer}>
        {/* People Section */}
        {peopleResults.length > 0 && (activeCategory === 'all' || activeCategory === 'people') && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>Mọi người</Text>
              <Text style={styles.resultSectionLink}>Xem thêm</Text>
            </View>
            {peopleResults.slice(0, 3).map((result) => (
              <Pressable
                key={result.id}
                style={styles.resultItem}
                onPress={() => handleResultPress(result)}
              >
                <View style={styles.resultItemLeft}>
                  <View style={[styles.resultAvatar, { backgroundColor: '#2563EB' }]}>
                    <Text style={styles.resultAvatarText}>
                      {result.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.resultItemInfo}>
                    <Text style={styles.resultItemTitle}>{result.title}</Text>
                    {result.subtitle && (
                      <Text style={styles.resultItemSubtitle}>{result.subtitle}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chatbox-outline" size={20} color={Colors[colorScheme].textTertiary} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Messages Section */}
        {messageResults.length > 0 && (activeCategory === 'all' || activeCategory === 'messages') && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>Tin nhắn</Text>
              <Text style={styles.resultSectionLink}>Xem thêm</Text>
            </View>
            {messageResults.map((result) => (
              <Pressable
                key={result.id}
                style={styles.resultItem}
                onPress={() => handleResultPress(result)}
              >
                <View style={styles.resultItemLeft}>
                  <View style={[styles.resultIcon, { backgroundColor: '#E5E7EB' }]}>
                    <Ionicons name="chatbubble" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.resultItemInfo}>
                    <Text style={styles.resultItemTitle}>{result.title}</Text>
                    {result.subtitle && (
                      <Text style={styles.resultItemSubtitle}>{result.subtitle}</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Files Section */}
        {fileResults.length > 0 && (activeCategory === 'all' || activeCategory === 'files') && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>Tệp</Text>
              <Text style={styles.resultSectionLink}>Xem thêm</Text>
            </View>
            {fileResults.map((result) => (
              <Pressable
                key={result.id}
                style={styles.resultItem}
                onPress={() => handleResultPress(result)}
              >
                <View style={styles.resultItemLeft}>
                  <View style={[styles.resultIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Ionicons name="document" size={20} color="#2563EB" />
                  </View>
                  <View style={styles.resultItemInfo}>
                    <Text style={styles.resultItemTitle}>{result.title}</Text>
                    {result.subtitle && (
                      <Text style={styles.resultItemSubtitle}>{result.subtitle}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="share-outline" size={20} color={Colors[colorScheme].textTertiary} />
              </Pressable>
            ))}
          </View>
        )}
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
            onSubmitEditing={handleSearchSubmit}
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

      {/* Category Tabs */}
      {searchText.trim() ? (
        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.categoryTabActive,
                ]}
                onPress={() => handleCategoryChange(category.id)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    activeCategory === category.id && styles.categoryTabTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Content */}
      <View style={styles.content}>
        {renderRecentSearches()}
        {renderSearchResults()}
      </View>
    </View>
  )
}
