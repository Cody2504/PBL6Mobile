import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from 'react-native'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { profileService } from '@/features/profile'
import {
  Post,
  Material,
} from '@/features/classroom'
import { Colors, Typography, Spacing, BorderRadius, Palette } from '@/libs/constants/theme'
import { hs, vs, getFontSize } from '@/libs/utils'

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
  const colorScheme = useColorScheme() ?? 'light'
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

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    switch (ext) {
      case 'pdf':
        return 'file-pdf-box'
      case 'doc':
      case 'docx':
        return 'file-word-box'
      case 'xls':
      case 'xlsx':
        return 'file-excel-box'
      case 'ppt':
      case 'pptx':
        return 'file-powerpoint-box'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'file-image'
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'file-video'
      case 'zip':
      case 'rar':
        return 'folder-zip'
      default:
        return 'file-document'
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 KB'
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.round(kb)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const renderMediaPreview = () => {
    if (!post.materials || post.materials.length === 0) {
      return null
    }

    // Filter only images and videos
    const mediaFiles = post.materials.filter(
      (material: Material) =>
        material.type === 'image' || material.type === 'video',
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

  const renderDocumentAttachments = () => {
    if (!post.materials || post.materials.length === 0) {
      return null
    }

    // Filter documents: anything that's not explicitly image or video
    // This includes: document, audio, other, undefined, null
    const documentFiles = post.materials.filter(
      (material: Material) => {
        const type = material.type?.toLowerCase()
        return type !== 'image' && type !== 'video'
      },
    )

    if (documentFiles.length === 0) {
      return null
    }

    return (
      <View style={styles.attachmentsContainer}>
        {documentFiles.map((material: Material) => (
          <TouchableOpacity
            key={material.material_id}
            style={[styles.attachmentItem, { backgroundColor: Colors[colorScheme].backgroundSecondary }]}
          >
            <View style={styles.attachmentIconContainer}>
              <Icon
                name={getFileIcon(material.title)}
                size={32}
                color={Colors[colorScheme].primary}
              />
            </View>
            <View style={styles.attachmentInfo}>
              <Text style={[styles.attachmentFileName, { color: Colors[colorScheme].text }]} numberOfLines={1}>
                {material.title}
              </Text>
              <Text style={[styles.attachmentFileDetails, { color: Colors[colorScheme].textSecondary }]}>
                {formatFileSize(material.file_size)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const styles = createStyles(colorScheme)

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
          <Icon name="dots-vertical" size={20} color={Colors[colorScheme].iconSecondary} />
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

        {/* Document Attachments */}
        {renderDocumentAttachments()}
      </View>

      {/* --- FOOTER: Comment Count --- */}
      <View style={styles.footerInfo}>
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
          <Icon name="comment-outline" size={18} color={Colors[colorScheme].iconSecondary} />
          <Text style={styles.commentButtonText}>Trả lời</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors[theme].surface,
    marginHorizontal: hs(Spacing.md),
    marginTop: vs(Spacing.md),
    borderRadius: hs(BorderRadius.md),
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
    padding: hs(Spacing.lg),
    paddingBottom: vs(Spacing.xs),
  },
  avatarPlaceholder: {
    width: hs(40),
    height: hs(40),
    borderRadius: hs(20),
    backgroundColor: Palette.brand[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hs(Spacing.md),
  },
  avatarText: {
    color: Colors[theme].textInverse,
    fontWeight: Typography.h4.fontWeight,
    fontSize: getFontSize(Typography.bodyLarge.fontSize),
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: Typography.labelMedium.fontWeight,
    color: Colors[theme].text,
    marginBottom: vs(2),
    fontSize: getFontSize(Typography.bodyMedium.fontSize),
  },
  date: {
    fontSize: getFontSize(Typography.caption.fontSize),
    color: Colors[theme].textSecondary,
  },
  moreButton: {
    padding: hs(Spacing.xs),
  },
  contentContainer: {
    paddingHorizontal: hs(Spacing.lg),
    paddingVertical: vs(Spacing.md),
  },
  titleText: {
    fontSize: getFontSize(Typography.bodyLarge.fontSize),
    marginBottom: vs(Spacing.sm),
    color: Colors[theme].text,
  },
  boldText: {
    fontWeight: Typography.h4.fontWeight,
  },
  contentText: {
    fontSize: getFontSize(Typography.bodyMedium.fontSize),
    lineHeight: getFontSize(Typography.bodyMedium.lineHeight),
    color: Colors[theme].text,
    marginBottom: vs(Spacing.md),
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: hs(Spacing.lg),
    paddingVertical: vs(Spacing.xs),
  },
  commentCountText: {
    fontSize: getFontSize(Typography.caption.fontSize),
    color: Colors[theme].textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors[theme].border,
    marginHorizontal: hs(Spacing.lg),
    marginTop: vs(Spacing.xs),
    marginBottom: vs(2),
  },
  actionBar: {
    flexDirection: 'row',
    paddingVertical: vs(Spacing.sm),
    paddingHorizontal: hs(Spacing.lg),
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(Spacing.xs),
  },
  commentButtonText: {
    marginLeft: hs(Spacing.sm),
    color: Colors[theme].textSecondary,
    fontSize: getFontSize(Typography.caption.fontSize),
  },
  mediaPreviewContainer: {
    marginTop: vs(Spacing.md),
  },
  mediaItem: {
    position: 'relative',
    marginRight: hs(Spacing.sm),
    borderRadius: hs(BorderRadius.md),
    overflow: 'hidden',
  },
  mediaImage: {
    width: hs(200),
    height: vs(150),
    borderRadius: hs(BorderRadius.md),
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
  // Attachment styles
  attachmentsContainer: {
    marginTop: vs(Spacing.sm),
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hs(Spacing.sm),
    borderRadius: hs(BorderRadius.sm),
    marginBottom: vs(Spacing.xs),
  },
  attachmentIconContainer: {
    marginRight: hs(Spacing.sm),
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentFileName: {
    fontSize: getFontSize(Typography.bodyMedium.fontSize),
    fontWeight: Typography.labelMedium.fontWeight,
    marginBottom: vs(2),
  },
  attachmentFileDetails: {
    fontSize: getFontSize(Typography.caption.fontSize),
  },
})

export default PostItem
