import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { classService } from '../../services/classService';
import { useAuth } from '../../contexts/AuthContext';
import EditTeamModal from '../../components/modals/EditTeamModal';

interface TeamDetail {
  class_id: string;
  class_name: string;
  description: string;
  class_code: string;
  teacher_id: string;
}

export default function TeamDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isTeacher } = useAuth();

  const [teamData, setTeamData] = useState<TeamDetail>({
    class_id: params.classId as string,
    class_name: params.className as string,
    description: params.description as string,
    class_code: params.classCode as string,
    teacher_id: params.teacherId as string,
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Check if current user is the teacher of this team
  const isTeamOwner = isTeacher() && user?.id === teamData.teacher_id;

  useEffect(() => {
    if (params.teamId) {
      setTeamData({
        class_id: params.classId as string,
        class_name: params.className as string ,
        description: params.description as string,
        class_code: params.classCode as string,
        teacher_id: params.teacherId as string,
      });
    }
  }, [params]);

  const handleEditPress = () => {
    console.log('Edit button pressed, opening modal');
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = (updatedData: { class_id: string; class_name: string; description: string; class_code: string }) => {
    setTeamData({
      ...teamData,
      ...updatedData,
    });
  };

  const handleAddStudents = () => {
    router.push({
      pathname: '/(group)/add-members',
      params: { 
        teamName: teamData.class_name,
        classId: teamData.class_id,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{teamData.class_name}</Text>
        {/* Show edit button only if user is the team owner (teacher) */}
        {isTeamOwner && (
          <TouchableOpacity onPress={handleEditPress}>
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
            <Text style={styles.learnMoreLink}>Tìm hiểu về kênh được tạo lần đầu</Text>
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
            <TouchableOpacity style={styles.menuItem} onPress={handleAddStudents}>
              <MaterialIcons name="person-add" size={24} color="#5b5fc7" />
              <Text style={[styles.actionText, styles.actionTextMargin]}>Thêm học sinh</Text>
            </TouchableOpacity>
          )}

          {/* See new posts */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="post-add" size={24} color="#5b5fc7" />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Xem các bài đăng mới ở dưới cùng</Text>
              <Text style={styles.menuSubtitle}>Điều này áp dụng cho tất cả các kênh</Text>
            </View>
          </TouchableOpacity>

          {/* Copy email */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="mail" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>Sao chép địa chỉ email</Text>
          </TouchableOpacity>

          {/* Copy link to channel */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="link" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>Sao chép liên kết vào kênh</Text>
          </TouchableOpacity>

          {/* Show visibility */}
          <View style={styles.menuItemWithToggle}>
            <View style={styles.visibilityContent}>
              <Ionicons name="eye" size={24} color="#5b5fc7" />
              <Text style={styles.visibilityText}>Hiển thị trong danh sách kênh</Text>
            </View>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleThumb} />
            </View>
          </View>

          {/* Show notifications */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="add-circle-outline" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>Hiển thị trong</Text>
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="search" size={24} color="#5b5fc7" />
            <Text style={[styles.actionText, styles.actionTextMargin]}>Tìm trong kênh này</Text>
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
              <Text style={styles.notificationText}>Bao gồm các phản hồi trong ch...</Text>
            </View>
            <View style={styles.toggleSwitchOff}>
              <View style={styles.toggleThumbOff} />
            </View>
          </View>

          <Text style={styles.settingsFooter}>
            Chuyển đến phần Cài đặt trong ứng dụng Teams trên máy tính để tinh chỉnh thông báo của bạn.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Team Modal */}
      <EditTeamModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        teamData={{
          class_id: teamData.class_id,
          class_name: teamData.class_name,
          description: teamData.description,
          class_code: teamData.class_code,
        }}
      />
    </View>
  );
}

// ...existing styles...
const styles = StyleSheet.create({
  // ...existing styles from before...
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreLink: {
    fontSize: 14,
    color: '#5b5fc7',
    fontWeight: '500',
  },
  teamNameSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  teamNameLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 14,
    color: '#999',
  },
  optionsMenu: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5b5fc7',
  },
  actionTextMargin: {
    marginLeft: 12,
  },
  menuItemWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  visibilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  visibilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5b5fc7',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  aboutSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginLeft: 12,
  },
  toggleSwitchOff: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  toggleThumbOff: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  settingsFooter: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginTop: 16,
  },
});