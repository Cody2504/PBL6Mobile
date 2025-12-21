import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ClassroomCard from '@/features/classroom/components/ClassroomCard'
import TeamOptionsModal from '@/components/modals/TeamOptionsModal'
import JoinTeamModal from '@/components/modals/JoinTeamModal'
import { useTeamsScreen } from '../hooks/use-teams-screen'
import { createStyles } from './TeamsScreen.styles'
import { Colors, Palette } from '@/libs/constants/theme'

export default function TeamsScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  const {
    // State
    user,
    classrooms,
    isLoading,
    isRefreshing,
    showTeamOptions,
    showJoinModal,
    isCollapsed,

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
    handleCloseJoinModal,
    handleJoinSuccess,
    handleOptionSelect,
    navigateToChatbot,
    navigateToSearch,
    toggleCollapse,
  } = useTeamsScreen()

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.headerTitle}>Lớp học</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.aiButton} onPress={navigateToChatbot}>
            <Ionicons name="chatbox" size={18} color={Palette.brand[600]} />
            <Text style={styles.aiButtonText}>AI</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={navigateToSearch}>
            <Ionicons name="search-outline" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={handleGridPress}>
            <Ionicons name="grid-outline" size={24} color={Colors[colorScheme].icon} />
          </Pressable>
        </View>
      </View>

      {/* Section Header */}
      <Pressable style={styles.sectionHeader} onPress={toggleCollapse}>
        <Ionicons
          name={isCollapsed ? "chevron-forward" : "chevron-down"}
          size={20}
          color={Colors[colorScheme].textSecondary}
        />
        <Text style={styles.sectionTitle}>Lớp học ({classrooms.length})</Text>
      </Pressable>

      {/* Classrooms List */}
      {!isCollapsed && (
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
                    handleOptionSelect(option, classroom.id, classroom.name)
                  }
                />
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TeamOptionsModal
        visible={showTeamOptions}
        onClose={handleCloseTeamOptions}
        onCreateTeam={handleCreateTeam}
        onBrowseTeams={handleBrowseTeams}
        onJoinWithCode={handleJoinWithCode}
      />

      <JoinTeamModal
        visible={showJoinModal}
        onClose={handleCloseJoinModal}
        onJoin={handleJoinSuccess}
      />
    </SafeAreaView>
  )
}
