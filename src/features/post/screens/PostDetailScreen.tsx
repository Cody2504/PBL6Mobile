import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CommentComponent from '@/components/CommentComponent'
import { usePostDetailScreen } from '../hooks/use-post-detail-screen'
import { createStyles } from './PostDetailScreen.styles'
import { Colors } from '@/libs/constants/theme'

const PostDetailScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    // Refs
    commentInputRef,

    // State
    commentText,
    post,
    userInfo,
    classData,
    isLoading,
    comments,
    isSubmitting,
    refreshing,

    // Setters
    setCommentText,

    // Handlers
    handleSendComment,
    handleBackPress,
    formatDate,
    getAvatarText,
    focusCommentInput,
    onRefresh,
  } = usePostDetailScreen()

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        </View>
      </View>
    )
  }

  if (!post) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Post not found</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Đăng bởi {userInfo?.email || 'Unknown'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {classData?.class_name || 'Unknown Class'}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="dots-horizontal" size={24} color={Colors[colorScheme].icon} />
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors[colorScheme].primary]}
              tintColor={Colors[colorScheme].primary}
            />
          }
        >
          <View style={styles.postContent}>
            {/* User Info */}
            <View style={styles.userSection}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getAvatarText()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userInfo?.email || 'Unknown'}
                </Text>
                <Text style={styles.date}>{formatDate(post.created_at)}</Text>
              </View>
            </View>

            {/* Post Title */}
            <Text style={styles.postTitle}>
              {post.title.startsWith('[Bản mềm]')
                ? post.title
                : `${post.title}`}
            </Text>

            {/* Post Content */}
            <Text style={styles.postText}>{post.message}</Text>

            {/* Materials Section */}
            {post.materials && post.materials.length > 0 && (
              <View style={styles.materialsSection}>
                <Text style={styles.materialsSectionTitle}>
                  Tệp đính kèm ({post.materials.length})
                </Text>
                {post.materials.map((material) => {
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

                  return (
                    <TouchableOpacity
                      key={material.material_id}
                      style={styles.materialItem}
                    >
                      <View style={styles.materialIconContainer}>
                        <Icon
                          name={getFileIcon(material.title)}
                          size={40}
                          color={Colors[colorScheme].primary}
                        />
                      </View>
                      <View style={styles.materialInfo}>
                        <Text style={styles.materialFileName} numberOfLines={1}>
                          {material.title}
                        </Text>
                        <Text style={styles.materialFileDetails}>
                          {formatFileSize(material.file_size)} • User{' '}
                          {material.uploaded_by}
                        </Text>
                        <Text style={styles.materialFileDate}>
                          {new Date(material.uploaded_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.materialMoreButton}>
                        <Icon
                          name="dots-vertical"
                          size={24}
                          color={Colors[colorScheme].iconSecondary}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
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
                <Icon name="comment-outline" size={40} color={Colors[colorScheme].textDisabled} />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>
                  Be the first to comment!
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  onReply={() => {
                    focusCommentInput()
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View
          style={[
            styles.commentInputContainer,
            { paddingBottom: insets.bottom + 12 },
          ]}
        >
          <View style={styles.commentInputWrapper}>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="plus" size={20} color={Colors[colorScheme].primary} />
            </TouchableOpacity>

            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              placeholder="Trả lời"
              placeholderTextColor={Colors[colorScheme].textTertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
          </View>

          {commentText.trim() && (
            <TouchableOpacity
              style={[
                styles.sendButton,
                isSubmitting && styles.sendButtonDisabled,
              ]}
              onPress={handleSendComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors[colorScheme].primary} />
              ) : (
                <Icon name="send" size={20} color={Colors[colorScheme].primary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default PostDetailScreen
