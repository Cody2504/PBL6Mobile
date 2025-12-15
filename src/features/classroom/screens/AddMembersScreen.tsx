import React from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAddMembersScreen, SelectedMember } from '../hooks/use-add-members-screen'
import { styles } from './AddMembersScreen.styles'

export default function AddMembersScreen() {
  const insets = useSafeAreaInsets()
  const {
    // Params
    teamName,

    // State
    activeTab,
    searchText,
    users,
    selectedMembers,
    isLoading,
    isSubmitting,

    // Handlers
    handleSearch,
    handleTabChange,
    handleSkip,
    handleDone,
    toggleMemberSelection,
  } = useAddMembersScreen()

  const renderMember = ({ item }: { item: SelectedMember }) => {
    const isSelected = selectedMembers.some((m) => m.user_id === item.user_id)
    const displayName = item.user_name || item.full_name || 'User'
    const avatarText = displayName.charAt(0).toUpperCase()

    return (
      <Pressable
        style={styles.memberItem}
        onPress={() => toggleMemberSelection(item)}
      >
        <View style={styles.memberInfo}>
          <View style={[styles.memberAvatar, { backgroundColor: '#2563EB' }]}>
            <Text style={styles.memberAvatarText}>{avatarText}</Text>
          </View>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{displayName}</Text>
            <Text style={styles.memberRole}>{item.email}</Text>
          </View>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => toggleMemberSelection(item)}
        >
          <Ionicons
            name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
            size={24}
            color={isSelected ? '#16a34a' : '#0078d4'}
          />
        </Pressable>
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleSkip}
          style={[styles.skipButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add Members</Text>
          <Text style={styles.teamCode}>{teamName}</Text>
        </View>
        <Pressable
          onPress={handleDone}
          style={[styles.doneButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting || selectedMembers.length === 0}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0078d4" size="small" />
          ) : (
            <Text style={styles.doneText}>Done</Text>
          )}
        </Pressable>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'Students' && styles.activeTab]}
          onPress={() => handleTabChange('Students')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Students' && styles.activeTabText,
            ]}
          >
            Students
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'Teachers' && styles.activeTab]}
          onPress={() => handleTabChange('Teachers')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Teachers' && styles.activeTabText,
            ]}
          >
            Teachers
          </Text>
        </Pressable>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <Text style={styles.searchLabel}>Add:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter a name or email"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Selected Members Counter */}
      {selectedMembers.length > 0 && (
        <View style={styles.selectedCounter}>
          <Text style={styles.selectedCounterText}>
            {selectedMembers.length} member(s) selected
          </Text>
        </View>
      )}

      {/* Users List */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0078d4" />
            <Text style={styles.loadingText}>Loading members...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} found
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              AVAILABLE {activeTab.toUpperCase()}
            </Text>
            <FlatList
              data={users}
              renderItem={renderMember}
              keyExtractor={(item) => item.user_id.toString()}
              style={styles.membersList}
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
              scrollEnabled={true}
            />
          </>
        )}
      </View>
    </View>
  )
}
