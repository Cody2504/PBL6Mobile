import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import ClassroomCard from '../../components/classroom/ClassroomCard';
import TeamOptionsModal from '../../components/modals/TeamOptionsModal';
import { classService, Class } from '../../services/classService';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to generate avatar color and text
const generateAvatarData = (name: string, index: number) => {
  const colors = ['#2563EB', '#DC2626', '#16A34A', '#EA580C', '#7C3AED', '#DB2777'];
  
  return {
    avatarColor: colors[index % colors.length],
    avatarText: name.charAt(0).toUpperCase(),
  };
};

interface Classroom {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher_id: string;
  created_at: string;
  avatarColor: string;
  avatarText: string;
  role: 'student' | 'teacher';
}

export default function TeamsScreen() {
  const router = useRouter();
  const { user, isTeacher, isStudent } = useAuth();
  const [showTeamOptions, setShowTeamOptions] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchClasses = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      if (!user?.id) {
        console.error('User ID not found');
        return;
      }

      // Determine user role and fetch classes accordingly
      let role: 'teacher' | 'student' = 'student';
      if (isTeacher()) {
        role = 'teacher';
      }

      const response: Class[] = await classService.getClassesByUserRole(role, Number(user.id));
    
      // Transform classes to classrooms with avatar data
      const transformedClasses: Classroom[] = response.map((classEntity, index) => {
        const avatarData = generateAvatarData(classEntity.class_name, index);
        return {
          id: classEntity.class_id,
          name: classEntity.class_name,
          code: classEntity.class_code,
          description: classEntity.description ?? '',
          teacher_id: classEntity.teacher_id ?? '',
          created_at: classEntity.created_at ?? '',
          ...avatarData,
          role: isTeacher() ? 'teacher' : 'student',
        };
      });

      setClassrooms(transformedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const checkForNewClass = async () => {
    try {
      const newClassData = await AsyncStorage.getItem('new_class_data');
      if (newClassData) {
        await fetchClasses();
        await AsyncStorage.removeItem('new_class_data');
      } else {
        await fetchClasses();
      }
    } catch (error) {
      console.error('Error checking for new class:', error);
      await fetchClasses();
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkForNewClass();
    }, [user?.id])
  );

  const onRefresh = () => {
    fetchClasses(true);
  };

  const navigateToPosts = (classroom: Classroom) => {
    router.push({
      pathname: '/(post)/post-screen',
      params: {
        classId: classroom.id,
        // className: classroom.name,
        // classCode: classroom.code,
        // description: classroom.description,
        // teacherId: classroom.teacher_id,
        // avatarColor: classroom.avatarColor,
        // avatarText: classroom.avatarText,
      }
    });
  };

  const handleGridPress = () => {
    setShowTeamOptions(true);
  };

  const handleCreateTeam = () => {
    setShowTeamOptions(false);
    router.push('/(group)/create-team');
  };

  const handleBrowseTeams = () => {
    setShowTeamOptions(false);
  };

  const handleJoinWithCode = () => {
    setShowTeamOptions(false);
  };

  const handleOptionSelect = (option: string, classroomName: string) => {
    console.log(`Selected ${option} for ${classroomName}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0078d4" />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.headerTitle}>Lớp học</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={handleGridPress}>
            <Ionicons name="grid-outline" size={24} color="#000" />
          </Pressable>
          <Pressable
            style={styles.aiButton}
            onPress={() => router.push('/(chatbot)/conversation')}
          >
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
              {isTeacher() ? 'Create your first team to get started' : 'Join a team using a code'}
            </Text>
            {isTeacher() && (
              <Pressable style={styles.createButton} onPress={handleCreateTeam}>
                <Text style={styles.createButtonText}>Create Team</Text>
              </Pressable>
            )}
            {isStudent() && (
              <Pressable style={styles.createButton} onPress={handleJoinWithCode}>
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
                onOptionSelect={(option) => handleOptionSelect(option, classroom.name)}
              />
            </View>
          ))
        )}
      </ScrollView>

      <TeamOptionsModal
        visible={showTeamOptions}
        onClose={() => setShowTeamOptions(false)}
        onCreateTeam={handleCreateTeam}
        onBrowseTeams={handleBrowseTeams}
        onJoinWithCode={handleJoinWithCode}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4E4C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7355',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6264a7',
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  generalLabel: {
    paddingLeft: 80,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  generalText: {
    fontSize: 14,
    color: '#8E8E93',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#0078d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});