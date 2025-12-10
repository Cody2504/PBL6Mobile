import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { classService } from '../../services/classService';
import { useAuth } from '../../contexts/AuthContext';

interface Member {
  user_id: string;
  user_name: string;
  email: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

// Mock data
const MOCK_TEACHERS: Member[] = [
  {
    user_id: '1',
    user_name: 'Lê Thị Mỹ Hạnh',
    email: 'ltmhanh@dut.udn.vn',
    role: 'teacher',
  },
];

const MOCK_STUDENTS: Member[] = [
  {
    user_id: '2',
    user_name: 'Bùi Hữu Trọng',
    email: 'buihuutrong@dut.udn.vn',
    role: 'student',
  },
  {
    user_id: '3',
    user_name: 'Bùi Nguyễn Văn Giáp',
    email: 'buinguyenvangiap@dut.udn.vn',
    role: 'student',
  },
  {
    user_id: '4',
    user_name: 'Cao Minh Đức',
    email: 'caominhduc@dut.udn.vn',
    role: 'student',
  },
  {
    user_id: '5',
    user_name: 'Cao Ngọc Quý',
    email: 'caongocquy@dut.udn.vn',
    role: 'student',
  },
  {
    user_id: '6',
    user_name: 'Hà Văn Khánh Đạt',
    email: 'havankhanhdat@dut.udn.vn',
    role: 'student',
  },
];

export default function TeamMembersScreen() {
  const router = useRouter();
  const { classroomId, classroomName, userRole } = useLocalSearchParams<{
    classroomId: string;
    classroomName: string;
    userRole: string;
  }>();
  
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Member[]>(MOCK_TEACHERS);
  const [students, setStudents] = useState<Member[]>(MOCK_STUDENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'owners' | 'members'>('owners');

  const fetchClassMembers = async (showRefreshing = false) => {
    if (!classroomId) return;
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // TODO: Implement API call
      // const response = await classService.getClassMembers(parseInt(classroomId));
      // setTeachers(response.teachers);
      // setStudents(response.students);
      
      // Using mock data for now
      setTeachers(MOCK_TEACHERS);
      setStudents(MOCK_STUDENTS);
    } catch (error) {
      console.error('Error fetching class members:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClassMembers();
  }, [classroomId]);

  const onRefresh = () => {
    fetchClassMembers(true);
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#2563EB', '#DC2626', '#16A34A', '#EA580C', '#7C3AED', '#DB2777'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const displayedMembers = activeTab === 'owners' ? teachers : students;
  const totalCount = teachers.length + students.length;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0078d4" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Team members ({totalCount})</Text>
            <Text style={styles.headerSubtitle}>{classroomName}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'owners' && styles.activeTab]}
          onPress={() => setActiveTab('owners')}
        >
          <Text style={[styles.tabText, activeTab === 'owners' && styles.activeTabText]}>
            Chủ sở hữu
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
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
            colors={['#0078d4']}
          />
        }
      >
        {displayedMembers.map((member) => {
          const isCurrentUser = member.user_id === user?.id;
          const avatarColor = getAvatarColor(member.user_name);
          const initials = getInitials(member.user_name);

          return (
            <Pressable key={member.user_id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                  {member.avatar ? (
                    <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                  {/* Online indicator */}
                  <View style={styles.onlineIndicator} />
                </View>
                
                <View style={styles.memberDetails}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.memberName}>{member.user_name}</Text>
                    {isCurrentUser && (
                      <Text style={styles.youLabel}>You</Text>
                    )}
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
              </View>

              <View style={styles.memberActions}>
                {member.role === 'teacher' && (
                  <Text style={styles.roleLabel}>Chủ sở hữu</Text>
                )}
                <Pressable style={styles.menuButton}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0078d4',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#0078d4',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  memberDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  youLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 12,
    color: '#0078d4',
    fontWeight: '500',
    marginRight: 12,
  },
  menuButton: {
    padding: 8,
  },
});