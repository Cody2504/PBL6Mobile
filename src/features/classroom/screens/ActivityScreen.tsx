import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useActivityScreen } from '../hooks/use-activity-screen'
import { styles } from './ActivityScreen.styles'

export default function ActivityScreen() {
  const insets = useSafeAreaInsets()
  const {
    // State
    activeFilter,
    activities,
    filters,
    refreshing,

    // Handlers
    handleFilterChange,
    getInitials,
    getAvatarColor,
    onRefresh,
  } = useActivityScreen()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return (
          <View style={styles.iconBadge}>
            <Ionicons name="chatbox" size={16} color="#fff" />
          </View>
        )
      case 'added':
        return (
          <View style={[styles.iconBadge, { backgroundColor: '#5b5fc7' }]}>
            <Ionicons name="person-add" size={16} color="#fff" />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VH</Text>
          </View>
          <Text style={styles.headerTitle}>Hoạt động</Text>
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
            onPress={() => handleFilterChange(filter.key)}
          >
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

      {/* Activities List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6264a7']}
            tintColor="#6264a7"
          />
        }
      >
        {activities.map((activity) => {
          const avatarColor = getAvatarColor(activity.userName)
          const initials = getInitials(activity.userName)

          return (
            <Pressable key={activity.id} style={styles.activityCard}>
              <View style={styles.avatarContainer}>
                <View
                  style={[styles.userAvatar, { backgroundColor: avatarColor }]}
                >
                  {activity.userAvatar ? (
                    <Image
                      source={{ uri: activity.userAvatar }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.userAvatarText}>{initials}</Text>
                  )}
                </View>
                {getActivityIcon(activity.type)}
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={2}>
                  <Text style={styles.userName}>{activity.userName}</Text>
                  <Text style={styles.actionText}> {activity.action} </Text>
                  <Text style={styles.groupName}>{activity.groupName}</Text>
                </Text>

                {activity.message && (
                  <Text style={styles.messagePreview} numberOfLines={1}>
                    {activity.message}
                  </Text>
                )}

                <Text style={styles.groupPath}>{activity.groupPath}</Text>
              </View>

              <View style={styles.activityRight}>
                <Text style={styles.timestamp}>{activity.timestamp}</Text>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
