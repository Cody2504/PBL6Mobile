import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ActivityItem {
  id: string;
  type: 'mention' | 'post' | 'added';
  userName: string;
  userAvatar?: string;
  action: string;
  groupName: string;
  groupPath: string;
  message?: string;
  timestamp: string;
  isUnread?: boolean;
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'unread' | 'mentions' | 'messages'>('unread');

  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'mention',
      userName: 'Dang Hoai Phuong',
      action: 'đã đề cập đến',
      groupName: 'Group_SOA_API',
      groupPath: 'Group_SOA_API > Chung',
      message: 'Good morning Group_SOA_API, Sáng nay...',
      timestamp: 'Chủ Nhật',
      isUnread: true,
    },
    {
      id: '2',
      type: 'added',
      userName: 'Microsoft',
      action: 'đã thêm bạn vào nhóm',
      groupName: 'Group_SOA_API',
      groupPath: 'Group_SOA_API > Chung',
      timestamp: '23 thg 10',
      isUnread: false,
    },
  ]);

  const filters = [
    { key: 'unread', label: 'Chưa đọc' },
    { key: 'mentions', label: '@Đề cập đến' },
    { key: 'messages', label: 'Tin nhắn trả lời' },
  ];

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#2563EB', '#DC2626', '#16A34A', '#EA580C', '#7C3AED', '#DB2777'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return (
          <View style={styles.iconBadge}>
            <Ionicons name="chatbox" size={16} color="#fff" />
          </View>
        );
      case 'added':
        return (
          <View style={[styles.iconBadge, { backgroundColor: '#5b5fc7' }]}>
            <Ionicons name="person-add" size={16} color="#fff" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VH</Text>
          </View>
          <Text style={styles.headerTitle}>Hoạt động</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <Pressable
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter.key as any)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Activities List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activities.map((activity) => {
          const avatarColor = getAvatarColor(activity.userName);
          const initials = getInitials(activity.userName);

          return (
            <Pressable key={activity.id} style={styles.activityCard}>
              <View style={styles.avatarContainer}>
                <View style={[styles.userAvatar, { backgroundColor: avatarColor }]}>
                  {activity.userAvatar ? (
                    <Image
                      source={{ uri: activity.userAvatar }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.userAvatarText}>{initials}</Text>
                  )}
                </View>
                {getActivityIcon(activity.type)}
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={2}>
                  <Text style={styles.userName}>{activity.userName}</Text>
                  <Text style={styles.actionText}> {activity.action} </Text>
                  <Text style={styles.groupName}>{activity.groupName}</Text>
                </Text>

                {activity.message && (
                  <Text style={styles.messagePreview} numberOfLines={1}>
                    {activity.message}
                  </Text>
                )}

                <Text style={styles.groupPath}>{activity.groupPath}</Text>
              </View>

              <View style={styles.activityRight}>
                <Text style={styles.timestamp}>{activity.timestamp}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4a261',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  activeFilterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  activityCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  actionText: {
    fontWeight: '400',
    color: '#000',
  },
  groupName: {
    fontWeight: '600',
    color: '#000',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  groupPath: {
    fontSize: 12,
    color: '#999',
  },
  activityRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});