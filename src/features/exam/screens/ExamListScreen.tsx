import React from 'react'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import ExamCard from '../components/ExamCard'
import { useExamListScreen, ExamFilter } from '../hooks/use-exam-list-screen'
import { createStyles } from './ExamListScreen.styles'

export default function ExamListScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const {
    exams,
    isLoading,
    isRefreshing,
    error,
    activeFilter,
    filterCounts,
    user,
    onRefresh,
    onFilterChange,
    navigateToExamDetail,
    retry,
  } = useExamListScreen()

  // Get avatar text from user
  const getAvatarText = () => {
    if (!user) return 'U'
    return user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
  }

  // Filter tabs configuration
  const filters: Array<{ key: ExamFilter; label: string }> = [
    { key: 'all', label: `Tất cả (${filterCounts.all})` },
    { key: 'upcoming', label: `Sắp tới (${filterCounts.upcoming})` },
    { key: 'in-progress', label: `Đang diễn ra (${filterCounts.inProgress})` },
    { key: 'completed', label: `Đã hoàn thành (${filterCounts.completed})` },
  ]

  // Render filter tabs
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterTab,
            activeFilter === filter.key && styles.filterTabActive,
          ]}
          onPress={() => onFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === filter.key && styles.filterTabTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  // Render loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{getAvatarText()}</Text>
            </View>
            <Text style={styles.headerTitle}>Danh sách bài thi</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loader.color} />
          <Text style={styles.loadingText}>Đang tải bài thi...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Render error state
  if (error && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{getAvatarText()}</Text>
            </View>
            <Text style={styles.headerTitle}>Danh sách bài thi</Text>
          </View>
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={styles.errorIcon.color} />
          <Text style={styles.errorTitle}>Không thể tải bài thi</Text>
          <Text style={styles.errorMessage}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.7}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color={styles.emptyIcon.color} />
      <Text style={styles.emptyTitle}>
        {activeFilter === 'all' ? 'Chưa có bài thi nào' : `Không có bài thi ${getFilterLabel()}`}
      </Text>
      <Text style={styles.emptyMessage}>
        {activeFilter === 'all'
          ? 'Bạn chưa được giao bài thi nào'
          : 'Không tìm thấy bài thi trong danh mục này'}
      </Text>
    </View>
  )

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'upcoming':
        return 'sắp tới'
      case 'in-progress':
        return 'đang diễn ra'
      case 'completed':
        return 'đã hoàn thành'
      default:
        return ''
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{getAvatarText()}</Text>
          </View>
          <Text style={styles.headerTitle}>Danh sách bài thi</Text>
        </View>
      </View>

      {/* Filter tabs */}
      {renderFilters()}

      {/* Exam list */}
      <FlatList
        data={exams}
        keyExtractor={item => item.exam_id.toString()}
        renderItem={({ item }) => (
          <ExamCard exam={item} onPress={() => navigateToExamDetail(item.exam_id)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          exams.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={styles.loader.color}
            colors={[styles.loader.color]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}
