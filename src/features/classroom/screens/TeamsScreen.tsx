import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ClassroomCard from '@/features/classroom/components/ClassroomCard'
import TeamOptionsModal from '@/components/modals/TeamOptionsModal'
import { useTeamsScreen } from '../hooks/use-teams-screen'
import { styles } from './TeamsScreen.styles'

export default function TeamsScreen() {
  const {
    // State
    user,
    classrooms,
    isLoading,
    isRefreshing,
    showTeamOptions,

    // Auth helpers
    isTeacher,
    isStudent,

    // Handlers
    onRefresh,
    navigateToPosts,
    handleGridPress,
    handleCloseTeamOptions,
    handleCreateTeam,
    handleBrowseTeams,
    handleJoinWithCode,
    handleOptionSelect,
    navigateToChatbot,
  } = useTeamsScreen()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0078d4" />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.headerTitle}>Lớp học</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={handleGridPress}>
            <Ionicons name="grid-outline" size={24} color="#000" />
          </Pressable>
          <Pressable style={styles.aiButton} onPress={navigateToChatbot}>
            <Ionicons name="chatbox" size={18} color="#6264a7" />
            <Text style={styles.aiButtonText}>AI</Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#8E8E93" />
          <Text style={styles.searchPlaceholder}>Messages, Chats, Files</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="chevron-down" size={20} color="#666" />
        <Text style={styles.sectionTitle}>Lớp học ({classrooms.length})</Text>
      </View>

      {/* Classrooms List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#0078d4']}
          />
        }
      >
        {classrooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No teams yet</Text>
            <Text style={styles.emptySubtext}>
              {isTeacher()
                ? 'Create your first team to get started'
                : 'Join a team using a code'}
            </Text>
            {isTeacher() && (
              <Pressable style={styles.createButton} onPress={handleCreateTeam}>
                <Text style={styles.createButtonText}>Create Team</Text>
              </Pressable>
            )}
            {isStudent() && (
              <Pressable
                style={styles.createButton}
                onPress={handleJoinWithCode}
              >
                <Text style={styles.createButtonText}>Join a Team</Text>
              </Pressable>
            )}
          </View>
        ) : (
          classrooms.map((classroom) => (
            <View key={classroom.id}>
              <ClassroomCard
                classroom={classroom}
                onPress={() => navigateToPosts(classroom)}
                onOptionSelect={(option) =>
                  handleOptionSelect(option, classroom.name)
                }
              />
            </View>
          ))
        )}
      </ScrollView>

      <TeamOptionsModal
        visible={showTeamOptions}
        onClose={handleCloseTeamOptions}
        onCreateTeam={handleCreateTeam}
        onBrowseTeams={handleBrowseTeams}
        onJoinWithCode={handleJoinWithCode}
      />
    </View>
  )
}
