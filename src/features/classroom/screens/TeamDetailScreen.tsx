import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import EditTeamModal from '@/components/modals/EditTeamModal'
import { useTeamDetailScreen } from '../hooks/use-team-detail-screen'
import { styles } from './TeamDetailScreen.styles'

export default function TeamDetailScreen() {
  const insets = useSafeAreaInsets()
  const {
    // State
    teamData,
    isEditModalVisible,
    isTeamOwner,

    // Handlers
    handleBackPress,
    handleEditPress,
    handleCloseEditModal,
    handleEditSuccess,
    handleAddStudents,
    handleCopyEmail,
    handleCopyLink,
  } = useTeamDetailScreen()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{teamData.class_name}</Text>
        {/* Show edit button only if user is the team owner (teacher) */}
        {isTeamOwner && (
          <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
            <MaterialIcons name="edit" size={24} color="#5b5fc7" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={[styles.scrollView, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{teamData.description}</Text>
          <TouchableOpacity>
            <Text style={styles.learnMoreLink}>
              Tìm hiểu về kênh được tạo lần đầu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Team Name */}
        <View style={styles.teamNameSection}>
          <Text style={styles.teamNameLabel}>{teamData.class_name}</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{teamData.class_code}</Text>
          </View>
        </View>

        {/* Options Menu */}
        <View style={styles.optionsMenu}>
          {/* Add Students Option - Only for Teachers */}
          {isTeamOwner && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddStudents}
            >
              <MaterialIcons name="person-add" size={24} color="#5b5fc7" />
              <Text style={[styles.actionText, styles.actionTextMargin]}>
                Thêm học sinh
              </Text>
            </TouchableOpacity>
          )}

          {/* See new posts */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="post-add" size={24} color="#5b5fc7" />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Xem các bài đăng mới ở dưới cùng
              </Text>
              <Text style={styles.menuSubtitle}>
                Điều này áp dụng cho tất cả các kênh
              </Text>
            </View>
          </TouchableOpacity>

          {/* Copy email */}
          <TouchableOpacity style={styles.menuItem} onPress={handleCopyEmail}>
            <MaterialIcons name="mail" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>
              Sao chép địa chỉ email
            </Text>
          </TouchableOpacity>

          {/* Copy link to channel */}
          <TouchableOpacity style={styles.menuItem} onPress={handleCopyLink}>
            <MaterialIcons name="link" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>
              Sao chép liên kết vào kênh
            </Text>
          </TouchableOpacity>

          {/* Show visibility */}
          <View style={styles.menuItemWithToggle}>
            <View style={styles.visibilityContent}>
              <Ionicons name="eye" size={24} color="#5b5fc7" />
              <Text style={styles.visibilityText}>
                Hiển thị trong danh sách kênh
              </Text>
            </View>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleThumb} />
            </View>
          </View>

          {/* Show notifications */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color="#5b5fc7"
            />
            <Text style={[styles.actionText, styles.actionTextMargin]}>
              Hiển thị trong
            </Text>
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="search" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>
              Tìm trong kênh này
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Thông báo cho tôi về</Text>

          {/* All new posts toggle */}
          <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <MaterialIcons name="article" size={24} color="#5b5fc7" />
              <Text style={styles.notificationText}>Tất cả bài đăng mới</Text>
            </View>
            <View style={styles.toggleSwitchOff}>
              <View style={styles.toggleThumbOff} />
            </View>
          </View>

          {/* Channel replies toggle */}
          <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <MaterialIcons name="reply" size={24} color="#5b5fc7" />
              <Text style={styles.notificationText}>
                Bao gồm các phản hồi trong ch...
              </Text>
            </View>
            <View style={styles.toggleSwitchOff}>
              <View style={styles.toggleThumbOff} />
            </View>
          </View>

          <Text style={styles.settingsFooter}>
            Chuyển đến phần Cài đặt trong ứng dụng Teams trên máy tính để tinh
            chỉnh thông báo của bạn.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Team Modal */}
      <EditTeamModal
        visible={isEditModalVisible}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        teamData={{
          class_id: teamData.class_id,
          class_name: teamData.class_name,
          description: teamData.description,
          class_code: teamData.class_code,
        }}
      />
    </View>
  )
}
