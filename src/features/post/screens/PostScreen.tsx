import React from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CreatePostModal from '@/components/modals/CreatePostModal'
import PostHeader from '@/features/post/components/PostHeader'
import PostTabBar from '@/features/post/components/PostTabBar'
import PostsTabContent from '@/features/post/components/PostsTabContent'
import FilesTabContent from '@/features/post/components/FilesTabContent'
import OtherTabContent from '@/features/post/components/OtherTabContent'
import { usePostScreen } from '../hooks/use-post-screen'
import { styles } from './PostScreen.styles'

const PostsScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const {
    // Params
    params,

    // State
    classData,
    isLoading,
    posts,
    isCreateModalVisible,
    activeTab,
    materials,
    refreshing,

    // Handlers
    handleCreatePostPress,
    handleCloseCreateModal,
    handlePostSuccess,
    handleCommentPress,
    handleBackPress,
    handleHeaderPress,
    handleTabChange,
    getClassId,
    getUploaderId,
    onRefresh,
  } = usePostScreen()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0078d4" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <PostHeader
          className={
            classData?.class_name || (params.classroomName as string) || ''
          }
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
          refreshing={refreshing}
          onRefresh={onRefresh}
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
        onClose={handleCloseCreateModal}
        onSuccess={handlePostSuccess}
        groupName={params.classroomName as string}
        classId={getClassId()}
        uploaderId={getUploaderId()}
      />
    </View>
  )
}

export default PostsScreen
