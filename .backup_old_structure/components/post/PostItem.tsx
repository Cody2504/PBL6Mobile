import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import ReactionSelector from './ReactionSelector'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { profileService } from '../../services/profileService'
import {
  classService,
  Post,
  ClassFullInfo,
  Material,
} from '../../services/classService'
import { API_ORIGIN } from '../../services/api'

interface PostItemProps {
  post: Post
  allPosts?: Post[]
  onCommentPress: (postId: number) => void
  isDetailScreen?: boolean
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  allPosts = [],
  onCommentPress,
  isDetailScreen = false,
}) => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Calculate comment count for this post
  const commentCount = allPosts.filter(
    (p: Post) => p.parent_id === post.id,
  ).length

  useEffect(() => {
    fetchUserInfo()
  }, [post.sender_id])

  const fetchUserInfo = async () => {
    try {
      setIsLoadingUser(true)
      const response = await profileService.getUserById(post.sender_id)
      setUserInfo(response.data)
    } catch (error) {
      console.error('Error fetching user info:', error)
      // Set default user info if fetch fails
      setUserInfo({
        email: 'unknown@example.com',
        full_name: 'Unknown User',
      })
    } finally {
      setIsLoadingUser(false)
    }
  }

  const handlePostPress = () => {
    if (!isDetailScreen) {
      router.push({
        pathname: `/(post)/post-detail`,
        params: {
          postId: post.id,
          classId: post.class_id,
        },
      })
    }
  }

  const handleCommentPressInternal = () => {
    if (isDetailScreen) {
      onCommentPress(post.id)
    } else {
      router.push({
        pathname: `/(post)/post-detail`,
        params: {
          postId: post.id,
          classId: post.class_id,
        },
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 24) {
      if (diffInHours < 1) return 'Just now'
      return `${diffInHours}h ago`
    }

    return date.toLocaleDateString()
  }

  const getUserDisplayName = () => {
    if (isLoadingUser) return 'Loading...'
    if (!userInfo) return 'Unknown User'
    return userInfo.full_name || userInfo.email || 'Unknown User'
  }

  const getUserEmail = () => {
    if (isLoadingUser) return 'Loading...'
    if (!userInfo) return 'unknown@example.com'
    return userInfo.email || 'unknown@example.com'
  }

  const getAvatarText = () => {
    const displayName = getUserDisplayName()
    if (displayName === 'Loading...' || displayName === 'Unknown User')
      return '?'
    return displayName.charAt(0).toUpperCase()
  }

  const getFullFileUrl = (fileUrl: string) => {
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl
    }
    // Remove all leading '../' or './' from relative paths
    let cleanPath = fileUrl
    while (cleanPath.startsWith('../') || cleanPath.startsWith('./')) {
      cleanPath = cleanPath.replace(/^\.\.\//, '').replace(/^\.\//, '')
    }
    // Route through API Gateway to classes-service
    const fullUrl = `${cleanPath}`
    console.log('Original URL:', fileUrl, '-> Full URL:', fullUrl)
    return fullUrl
  }

  const renderMediaPreview = () => {
    if (!post.materials || post.materials.length === 0) {
      console.log('No materials for post', post.id)
      return null
    }

    // Filter only images and videos
    const mediaFiles = post.materials.filter(
      (material: Material) =>
        material.type === 'image' || material.type === 'video',
    )

    console.log(
      'Post',
      post.id,
      'has',
      mediaFiles.length,
      'media files:',
      mediaFiles,
    )

    if (mediaFiles.length === 0) {
      return null
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mediaPreviewContainer}
      >
        {mediaFiles.map((material: Material) => {
          const imageUri = getFullFileUrl(material.file_url)
          return (
            <View key={material.material_id} style={styles.mediaItem}>
              <Image
                source={{ uri: imageUri }}
                style={styles.mediaImage}
                resizeMode="cover"
                onError={(error) => {
                  console.error(
                    'Image load error for',
                    imageUri,
                    ':',
                    error.nativeEvent.error,
                  )
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUri)
                }}
              />
              {material.type === 'video' && (
                <View style={styles.videoOverlay}>
                  <Icon name="play-circle" size={40} color="#fff" />
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    )
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handlePostPress}
      activeOpacity={isDetailScreen ? 1 : 0.95}
    >
      {/* --- HEADER (User Info) --- */}
      <View style={styles.header}>
        {/* Avatar Area */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{getAvatarText()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getUserEmail()}</Text>
          <Text style={styles.date}>{formatDate(post.created_at)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="dots-vertical" size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {/* --- CONTENT --- */}
      <View style={styles.contentContainer}>
        {/* Title is BOLD */}
        <Text style={styles.titleText}>
          <Text style={styles.boldText}>
            {post.title.startsWith('[Bản mềm]') ? post.title : `${post.title}`}
          </Text>
        </Text>

        {/* Content */}
        <Text style={styles.contentText}>{post.message}</Text>

        {/* Media Preview (Images/Videos) */}
        {renderMediaPreview()}
      </View>

      {/* --- FOOTER: Reaction Count & Comment Count --- */}
      <View style={styles.footerInfo}>
        {/* Comment Count - Right side */}
        <Text style={styles.commentCountText}>{commentCount} trả lời</Text>
      </View>

      {/* Separator line before Action Bar */}
      <View style={styles.separator} />

      {/* --- ACTION BAR (Comment Button Only) --- */}
      <View style={styles.actionBar}>
        {/* Comment Button - Aligned to left */}
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleCommentPressInternal}
        >
          <Icon name="comment-outline" size={18} color="#777" />
          <Text style={styles.commentButtonText}>Trả lời</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

// Your original styles - keeping them exactly the same
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 5,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#AD2D7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  moreButton: {
    padding: 5,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#E0E7FF',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  reactionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  reactionIcon: {
    marginRight: 4,
  },
  reactionCountText: {
    fontSize: 13,
    color: '#777',
  },
  commentCountText: {
    fontSize: 13,
    color: '#777',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 2,
  },
  actionBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  commentButtonText: {
    marginLeft: 6,
    color: '#777',
    fontSize: 13,
  },
  mediaPreviewContainer: {
    marginTop: 10,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
})

export default PostItem
