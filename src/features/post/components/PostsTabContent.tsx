import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { Post } from '@/features/classroom'
import PostItem from './PostItem'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface PostsTabContentProps {
  posts: Post[]
  allPosts: Post[]
  onCommentPress: (postId: number) => void
  bottomPadding: number
  refreshing?: boolean
  onRefresh?: () => void
}

const PostsTabContent: React.FC<PostsTabContentProps> = ({
  posts,
  allPosts,
  onCommentPress,
  bottomPadding,
  refreshing = false,
  onRefresh,
}) => {
  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="file-document-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>Be the first to post</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostItem
          post={item}
          allPosts={allPosts}
          onCommentPress={onCommentPress}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: bottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6264a7']}
            tintColor="#6264a7"
          />
        ) : undefined
      }
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
})

export default PostsTabContent
