import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Post } from '../services/classService';
import { profileService, UserProfile } from '../services/profileService';

interface CommentComponentProps {
  comment: Post;
  onReply?: (commentId: number) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, onReply }) => {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, [comment.sender_id]);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getUserById(comment.sender_id);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info for comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 1) return 'Just now';
        return `${diffInMinutes}m ago`;
      }
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getAvatarText = () => {
    if (!userInfo) return '?';
    if (userInfo.full_name) {
      return userInfo.full_name.charAt(0).toUpperCase();
    }
    if (userInfo.email) {
      return userInfo.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getDisplayName = () => {
    if (!userInfo) return 'Loading...';
    return userInfo.full_name || userInfo.email || 'Unknown User';
  };

  if (isLoading) {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.avatarPlaceholder}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
        <View style={styles.commentContent}>
          <Text style={styles.loadingText}>Loading comment...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.commentContainer}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{getAvatarText()}</Text>
      </View>
      
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.timestamp}>{formatDate(comment.created_at)}</Text>
        </View>
        
        {comment.title && comment.title.trim() !== '' && (
          <Text style={styles.commentTitle}>{comment.title}</Text>
        )}
        
        <Text style={styles.commentText}>{comment.message}</Text>
        
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onReply && onReply(comment.id)}
          >
            <Icon name="reply" size={14} color="#6b7280" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="thumb-up-outline" size={14} color="#6b7280" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default CommentComponent;
