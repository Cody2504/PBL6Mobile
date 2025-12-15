import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export type TabType = 'posts' | 'files' | 'other'

interface PostTabBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const PostTabBar: React.FC<PostTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={
          activeTab === 'posts'
            ? styles.activeTabContainer
            : styles.tabContainer
        }
        activeOpacity={1}
        onPress={() => onTabChange('posts')}
      >
        <Text
          style={activeTab === 'posts' ? styles.activeTabText : styles.tabText}
        >
          Bài đăng
        </Text>
        {activeTab === 'posts' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={
          activeTab === 'files'
            ? styles.activeTabContainer
            : styles.tabContainer
        }
        activeOpacity={1}
        onPress={() => onTabChange('files')}
      >
        <Text
          style={activeTab === 'files' ? styles.activeTabText : styles.tabText}
        >
          Tệp
        </Text>
        {activeTab === 'files' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={
          activeTab === 'other'
            ? styles.activeTabContainer
            : styles.tabContainer
        }
        activeOpacity={1}
        onPress={() => onTabChange('other')}
      >
        <Text
          style={activeTab === 'other' ? styles.activeTabText : styles.tabText}
        >
          Khác
        </Text>
        {activeTab === 'other' && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTabText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#0078d4',
  },
})

export default PostTabBar
