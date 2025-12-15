import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useOtherScreen, AppItem } from '../hooks/use-other-screen'
import { createStyles } from './OtherScreen.styles'
import { Colors } from '@/libs/constants/theme'

const OtherScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    // Params
    params,

    // State
    className,

    // App Lists
    assistantApps,
    addedApps,
    otherApps,
    powerApps,

    // Handlers
    handleBackPress,
    handleGroupNamePress,
    handleAppPress,
    navigateToPostsTab,
    navigateToFilesTab,
  } = useOtherScreen()

  const renderAppItem = (app: AppItem, showMore: boolean = false) => (
    <TouchableOpacity
      key={app.id}
      style={styles.appItem}
      onPress={() => handleAppPress(app)}
    >
      <View
        style={[
          styles.appIconContainer,
          { backgroundColor: app.iconBackground },
        ]}
      >
        <Icon name={app.icon} size={24} color={app.iconColor} />
      </View>
      <Text style={styles.appName}>{app.name}</Text>
      {showMore && (
        <TouchableOpacity style={styles.appMoreButton}>
          <Icon name="dots-horizontal" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={navigateToFilesTab}
          >
            <Text style={styles.tabText}>Tệp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.activeTabContainer}>
            <Text style={styles.activeTabText}>Khác</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Assistant Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đã thêm trợ lý ảo và bot</Text>
          {assistantApps.map((app) => renderAppItem(app, false))}
        </View>

        {/* Added Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng đã thêm</Text>
          {addedApps.map((app) => renderAppItem(app, true))}
        </View>

        {/* Other Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng khác</Text>
          {otherApps.map((app) => renderAppItem(app, false))}
        </View>

        {/* Power Apps Section */}
        <View style={styles.section}>
          {powerApps.map((app) => renderAppItem(app, false))}
        </View>
      </ScrollView>
    </View>
  )
}

export default OtherScreen
