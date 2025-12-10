import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { classService, Post } from '../../services/classService';
import { profileService } from '../../services/profileService';
import { UserProfile } from '../../services/profileService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentComponent from '../../components/CommentComponent';


const PostDetailScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { postId, classId, autoFocusComment } = params;
  
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<TextInput>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [classData, setClassData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Post[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    loadCurrentUser();
    fetchPostData();
    if (autoFocusComment === 'true') {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 500);
    }
  }, [postId, autoFocusComment]);

  const loadCurrentUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setCurrentUserId(parseInt(userData.id));
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const fetchPostData = async () => {
    try {
      setIsLoading(true);

      // Fetch class data first to get the post
      const classResponse = await classService.getClassById(classId as string);

      // Fetch materials for the class
      let fetchedMaterials: any[] = [];
      try {
        const materialsResponse = await classService.getMaterials(classId as string);
        fetchedMaterials = materialsResponse.data || materialsResponse || [];
      } catch (materialError) {
        console.error('Error fetching materials:', materialError);
      }

      // Enrich posts with their materials
      const postsWithMaterials = classResponse.posts.map((p: Post) => ({
        ...p,
        materials: fetchedMaterials.filter((material: any) => material.post_id === p.id),
      }));

      const foundPost = postsWithMaterials.find((p: Post) => p.id === parseInt(postId as string));

      if (foundPost) {
        setPost(foundPost);
        setClassData({
          ...classResponse,
          posts: postsWithMaterials,
        });

        // Fetch user info for the post sender
        const userResponse = await profileService.getUserById(foundPost.sender_id);
        setUserInfo(userResponse.data);

        // Filter comments - posts where parent_id equals current post id
        const postComments = postsWithMaterials.filter(
          (p: Post) => p.parent_id === foundPost.id
        );
        setComments(postComments);
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    
    if (!currentUserId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    if (!post) {
      Alert.alert('Error', 'Post not found');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create comment using addNewPost with parent_id
      console.log(classId)
      console.log(currentUserId)
      console.log(commentText)
      console.log(post.id)
      await classService.addNewPost({
        class_id: parseInt(classId as string),
        sender_id: currentUserId,
        message: commentText.trim(),
        parent_id: post.id, // Set parent_id to current post id,
        title: '', // Comments may not need a title
      });

      // Clear input and refresh data
      setCommentText('');
      commentInputRef.current?.blur();
      
      // Refresh post data to get new comments
      await fetchPostData();
      
    } catch (error) {
      console.error('Error sending comment:', error);
      Alert.alert('Error', 'Failed to send comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return 'Just now';
      return `${diffInHours}h ago`;
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = () => {
    if (!userInfo) return 'Unknown User';
    return userInfo.full_name || userInfo.email || 'Unknown User';
  };

  const getAvatarText = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Unknown User') return '?';
    return displayName.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Post not found</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Đăng bởi {userInfo?.email || 'Unknown'}</Text>
          <Text style={styles.headerSubtitle}>{classData?.class_name || 'Unknown Class'}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="dots-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Post Content */}
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.postContent}>
            {/* User Info */}
            <View style={styles.userSection}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getAvatarText()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userInfo?.email || 'Unknown'}</Text>
                <Text style={styles.date}>{formatDate(post.created_at)}</Text>
              </View>
            </View>

            {/* Post Title */}
            <Text style={styles.postTitle}>
              {post.title.startsWith('[Bản mềm]') ? post.title : `${post.title}`}
            </Text>

            {/* Post Content */}
            <Text style={styles.postText}>{post.message}</Text>

            {/* Link - Currently not in API response, keeping placeholder */}
            {false && (
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>Link placeholder</Text>
              </TouchableOpacity>
            )}

            {/* Reaction Info */}
            <View style={styles.reactionInfo}>
              <View style={styles.reactionCount}>
                <Icon name="heart" size={16} color="#F44336" />
                <Text style={styles.reactionText}>0</Text>
              </View>
            </View>
          </View>
          
          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsSectionHeader}>
              <Text style={styles.commentsSectionTitle}>
                Comments ({comments.length})
              </Text>
            </View>
            
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Icon name="comment-outline" size={40} color="#d1d5db" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  onReply={(commentId) => {
                    commentInputRef.current?.focus();
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.commentInputContainer, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.commentInputWrapper}>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="plus" size={20} color="#6366f1" />
            </TouchableOpacity>
            
            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              placeholder="Trả lời"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Icon name="emoticon-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.micButton}>
              <Icon name="microphone" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {commentText.trim() && (
            <TouchableOpacity 
              style={[styles.sendButton, isSubmitting && styles.sendButtonDisabled]}
              onPress={handleSendComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#6366f1" />
              ) : (
                <Icon name="send" size={20} color="#6366f1" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Your original styles - keeping them exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  postContent: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#AD2D7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: '#E0E7FF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 14,
  },
  reactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8,
  },
  reactionCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    padding: 8,
  },
  commentsSection: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  commentsSectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  addButton: {
    marginRight: 8,
    padding: 2,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 4,
    color: '#333',
  },
  emojiButton: {
    marginLeft: 8,
    padding: 2,
  },
  cameraButton: {
    marginLeft: 8,
    padding: 2,
  },
  micButton: {
    marginLeft: 8,
    padding: 2,
  },
  sendButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default PostDetailScreen;