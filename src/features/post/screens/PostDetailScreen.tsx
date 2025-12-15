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
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CommentComponent from '@/components/CommentComponent'
import { usePostDetailScreen } from '../hooks/use-post-detail-screen'
import { styles } from './PostDetailScreen.styles'

const PostDetailScreen: React.FC = () => {
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
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      </View>
    )
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
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6264a7']}
              tintColor="#6264a7"
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
              style={[
                styles.sendButton,
                isSubmitting && styles.sendButtonDisabled,
              ]}
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
  )
}

export default PostDetailScreen
