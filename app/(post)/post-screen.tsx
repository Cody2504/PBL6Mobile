import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { classService, Post, ClassFullInfo } from '../../services/classService';
import CreatePostModal from '../../components/modals/CreatePostModal';
import { useAuth } from '../../contexts/AuthContext';
import PostHeader from '../../components/post/PostHeader';
import PostTabBar, { TabType } from '../../components/post/PostTabBar';
import PostsTabContent from '../../components/post/PostsTabContent';
import FilesTabContent from '../../components/post/FilesTabContent';
import OtherTabContent from '../../components/post/OtherTabContent';

const PostsScreen: React.FC = () => {
  const router = useRouter(); 
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [classData, setClassData] = useState<ClassFullInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    fetchClassData();
  }, [params.classId]);

  const fetchClassData = async () => {
    try {
      setIsLoading(true);
      const response = await classService.getClassById(params.classId as string);
      setClassData(response);

      // Fetch materials for the class
      let fetchedMaterials: any[] = [];
      try {
        const materialsResponse = await classService.getMaterials(params.classId as string);
        fetchedMaterials = materialsResponse.data || materialsResponse || [];
        setMaterials(fetchedMaterials);
      } catch (materialError) {
        console.error('Error fetching materials:', materialError);
        setMaterials([]);
      }

      // Enrich posts with their materials
      const postsWithMaterials = response.posts.map((post: Post) => ({
        ...post,
        materials: fetchedMaterials.filter((material: any) => material.post_id === post.id),
      }));

      // Filter only main posts (posts with parent_id = null)
      const mainPosts = postsWithMaterials.filter((post: Post) => post.parent_id === null);
      setPosts(mainPosts);

      // Update classData with enriched posts
      setClassData({
        ...response,
        posts: postsWithMaterials,
      });
    } catch (error) {
      console.error('Error fetching class data:', error);
      Alert.alert('Error', 'Failed to load class data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePostPress = () => {
    setIsCreateModalVisible(true);
  };

  const handlePostSuccess = async () => {
    await fetchClassData();
  };

  const handleCommentPress = (postId: number) => {
    console.log(`Navigating to Post Detail for: ${postId}`);
    router.push({
      pathname: '/(post)/post-detail',
      params: {
        postId: postId,
        classId: classData?.class_id,
      },
    });
  };

  const handleBackPress = () => {
    router.push('/(tabs)/teams');
  };

  const handleHeaderPress = () => {
    if (classData) {
      router.push({
        pathname: '/(group)/team-detail',
        params: {
          classId: classData.class_id,
          className: classData.class_name,
          description: classData.description || '',
          classCode: classData.class_code,
          teacherId: classData.teacher_id,
        },
      });
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0078d4" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <PostHeader
          className={classData?.class_name || (params.classroomName as string) || ''}
          onBackPress={handleBackPress}
          onHeaderPress={handleHeaderPress}
        />
        <PostTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <PostsTabContent
          posts={posts}
          allPosts={classData?.posts || []}
          onCommentPress={handleCommentPress}
          bottomPadding={insets.bottom + 80}
        />
      )}
      {activeTab === 'files' && (
        <FilesTabContent
          materials={materials}
          bottomPadding={insets.bottom + 20}
        />
      )}
      {activeTab === 'other' && (
        <OtherTabContent bottomPadding={insets.bottom + 20} />
      )}

      {/* FAB - Only show on posts tab */}
      {activeTab === 'posts' && (
        <TouchableOpacity 
          style={[styles.fab, { bottom: insets.bottom + 16 }]}
          onPress={handleCreatePostPress}
        >
          <Icon name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handlePostSuccess}
        groupName={params.classroomName as string}
        classId={(() => {
          const classIdStr = Array.isArray(params.classId) ? params.classId[0] : params.classId;
          return typeof classIdStr === 'string' ? parseInt(classIdStr, 10) : classIdStr;
        })()}
        uploaderId={(() => {
          const userId = user?.id || 0;
          return typeof userId === 'string' ? parseInt(userId, 10) : userId;
        })()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0078d4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default PostsScreen;