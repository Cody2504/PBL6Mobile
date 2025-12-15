import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFilesScreen, Material } from '../hooks/use-files-screen'
import { createStyles } from './FilesScreen.styles'
import { Colors } from '@/libs/constants/theme'

const FilesScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    // Params
    params,

    // State
    materials,
    isLoading,
    className,

    // Handlers
    handleBackPress,
    handleGroupNamePress,
    navigateToPostsTab,
    navigateToOtherTab,
    getFileIcon,
  } = useFilesScreen()

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <TouchableOpacity style={styles.materialItem}>
      <View style={styles.fileIconContainer}>
        <Icon name={getFileIcon(item.type)} size={40} color="#0078d4" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.fileDetails}>
          {item.size} • {item.uploadedBy}
        </Text>
        <Text style={styles.fileDate}>{item.uploadedAt}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="dots-vertical" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="lock" size={80} color="#0078d4" />
        <View style={styles.fileIcons}>
          <Icon
            name="file-document"
            size={40}
            color="#f4a261"
            style={styles.floatingIcon1}
          />
          <Icon
            name="image"
            size={35}
            color="#e76f51"
            style={styles.floatingIcon2}
          />
        </View>
      </View>
      <Text style={styles.emptyTitle}>
        Các tệp lớp học chỉ đọc sẽ nằm ở đây
      </Text>
      <Text style={styles.emptySubtitle}>
        Học viên có thể đọc những tệp này nhưng chỉ giáo viên có thể chỉnh sửa
      </Text>
    </View>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButtonContainer}
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGroupNamePress}
            style={styles.groupNameContainer}
          >
            <Text style={styles.groupName}>
              {className || params.classroomName}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="video" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={navigateToPostsTab}
          >
            <Text style={styles.tabText}>Bài đăng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.activeTabContainer}>
            <Text style={styles.activeTabText}>Tệp</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={navigateToOtherTab}
          >
            <Text style={styles.tabText}>Khác</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      ) : materials.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={materials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default FilesScreen
