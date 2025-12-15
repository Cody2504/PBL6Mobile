import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTeamMembersScreen, Member } from '../hooks/use-team-members-screen'
import { createStyles } from './TeamMembersScreen.styles'
import { Colors } from '@/libs/constants/theme'

export default function TeamMembersScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const {
    // State
    user,
    classroomName,
    isLoading,
    isRefreshing,
    activeTab,
    displayedMembers,
    totalCount,

    // Handlers
    onRefresh,
    handleBack,
    handleTabChange,
    getInitials,
    getAvatarColor,
  } = useTeamMembersScreen()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Team members ({totalCount})</Text>
            <Text style={styles.headerSubtitle}>{classroomName}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'owners' && styles.activeTab]}
          onPress={() => handleTabChange('owners')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'owners' && styles.activeTabText,
            ]}
          >
            Chủ sở hữu
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => handleTabChange('members')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'members' && styles.activeTabText,
            ]}
          >
            Thành viên
          </Text>
        </Pressable>
      </View>

      {/* Members List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors[colorScheme].primary]}
          />
        }
      >
        {displayedMembers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors[colorScheme].iconSecondary} />
            <Text style={styles.emptyText}>
              {activeTab === 'owners' ? 'No owners found' : 'No members found'}
            </Text>
          </View>
        ) : (
          displayedMembers.map((member: Member) => {
            const isCurrentUser = member.user_id === user?.user_id || member.user_id.toString() === user?.user_id.toString()
            const avatarColor = getAvatarColor(member.user_name)
            const initials = getInitials(member.user_name)

            return (
              <Pressable key={member.user_id} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                    {member.avatar ? (
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text style={styles.avatarText}>{initials}</Text>
                    )}
                    {/* Online indicator */}
                    <View style={styles.onlineIndicator} />
                  </View>

                  <View style={styles.memberDetails}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.memberName}>{member.user_name}</Text>
                      {isCurrentUser && <Text style={styles.youLabel}>You</Text>}
                    </View>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                </View>

                <View style={styles.memberActions}>
                  {member.role === 'teacher' && (
                    <Text style={styles.roleLabel}>Chủ sở hữu</Text>
                  )}
                  <Pressable style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={Colors[colorScheme].icon} />
                  </Pressable>
                </View>
              </Pressable>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}
