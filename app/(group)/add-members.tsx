import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  FlatList, 
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { classService } from '../../services/classService';
import { profileService, User } from '../../services/profileService';

interface SelectedMember extends User {
  selected?: boolean;
}

export default function AddMembersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { classId, teamName } = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState<'Students' | 'Teachers'>('Students');
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<SelectedMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageNum: number = 1, search?: string) => {
    try {
      setIsLoading(true);
      const response = await profileService.getUsers(pageNum, 10, search);
      
      // Filter users based on active tab
      let filteredUsers = response.data;
      if (activeTab === 'Students') {
        filteredUsers = response.data.filter(user => user.role !== 'teacher' && user.role !== 'admin');
      } else if (activeTab === 'Teachers') {
        filteredUsers = response.data.filter(user => user.role === 'teacher');
      }

      // Transform users to include selected flag
      const transformedUsers = filteredUsers.map(user => ({
        ...user,
        selected: false,
      }));

      setUsers(transformedUsers);
      setPage(pageNum);
      setHasMore(response.pagination.page * response.pagination.limit < response.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      await fetchUsers(1, text);
    } else {
      await fetchUsers(1);
    }
  };

  const handleTabChange = (tab: 'Students' | 'Teachers') => {
    setActiveTab(tab);
    fetchUsers(1, searchText);
  };

  const handleSkip = () => {
    router.back();
  };

  const handleDone = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('Info', 'Please select at least one member to add');
      return;
    }

    if (!classId) {
      Alert.alert('Error', 'Class ID is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform selected members to UserInfo format
      const students = selectedMembers.map(member => ({
        id: typeof member.user_id === 'string' ? parseInt(member.user_id) : member.user_id,
        email: member.email,
        firstName: (member.user_name || member.full_name || '').split(' ')[0] || '',
        lastName: (member.user_name || member.full_name || '').split(' ').slice(1).join(' ') || '',
      }));

      // Call API to add students to class
      await classService.addStudentsToClass({
        class_id: parseInt(classId as string),
        students: students,
      });
      
      Alert.alert(
        'Success', 
        'New users have been added successfully',
        [{ 
          text: 'OK',
          onPress: () => router.back()
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add members. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSelection = (member: SelectedMember) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.user_id === member.user_id);
      if (isSelected) {
        return prev.filter(m => m.user_id !== member.user_id);
      } else {
        return [...prev, member];
      }
    });

    // Update the users list to reflect selection
    setUsers(prev =>
      prev.map(user =>
        user.user_id === member.user_id
          ? { ...user, selected: !user.selected }
          : user
      )
    );
  };

  const renderMember = ({ item }: { item: SelectedMember }) => {
    const isSelected = selectedMembers.some(m => m.user_id === item.user_id);
    const displayName = item.user_name || item.full_name || 'User';
    const avatarText = displayName.charAt(0).toUpperCase();

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
    );
  };

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
          <Text style={[styles.tabText, activeTab === 'Students' && styles.activeTabText]}>
            Students
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'Teachers' && styles.activeTab]}
          onPress={() => handleTabChange('Teachers')}
        >
          <Text style={[styles.tabText, activeTab === 'Teachers' && styles.activeTabText]}>
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
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} found</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>AVAILABLE {activeTab.toUpperCase()}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#0078d4',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  teamCode: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  doneButton: {
    padding: 8,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  doneText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0078d4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#0078d4',
    fontWeight: '600',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    padding: 8,
  },
  selectedCounter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  selectedCounterText: {
    fontSize: 14,
    color: '#0078d4',
    fontWeight: '600',
  },
});