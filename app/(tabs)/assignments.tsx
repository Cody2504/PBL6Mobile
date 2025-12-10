import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AssignmentCard from '../../components/assignment/AssignmentCard';

interface Assignment {
  id: string;
  title: string;
  dueDate: Date;
  submittedAt?: Date;
  status: 'upcoming' | 'overdue' | 'completed';
  points?: number;
  groupName: string;
}

const AssignmentScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'overdue' | 'completed'>('overdue');
  
  // Sample assignments data
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Hoàn thiện bài tập Ứng dụng Github Copilot &...',
      dueDate: new Date('2024-04-22T23:59:00'),
      status: 'overdue',
      points: 10,
      groupName: 'Group_QLDA 22NH12',
    },
    {
      id: '2',
      title: 'Nộp bổ sung',
      dueDate: new Date('2024-12-23T14:48:00'),
      status: 'overdue',
      groupName: 'Group_C302_F406_Toán UDCNTT_HK1_2...',
    },
    {
      id: '3',
      title: 'Nộp bài tập giữa kỳ',
      dueDate: new Date('2024-10-01T21:32:00'),
      submittedAt: new Date('2024-10-01T21:32:00'),
      status: 'completed',
      groupName: 'Group_KTPM_22.10_T4,1-2,F210',
    },
    {
      id: '4',
      title: 'Tài liệu kiểm thử V2 + TestReport',
      dueDate: new Date('2024-09-23T22:55:00'),
      submittedAt: new Date('2024-09-23T22:55:00'),
      status: 'completed',
      groupName: 'Group_KTPM_22.10_T4,1-2,F210',
    },
    {
      id: '5',
      title: 'BT MVC',
      dueDate: new Date('2024-09-18T11:28:00'),
      submittedAt: new Date('2024-09-18T11:28:00'),
      status: 'completed',
      groupName: 'Group_SOA_22NH11',
    },
    {
      id: '6',
      title: 'Báo cáo kiểm thử V1',
      dueDate: new Date('2024-09-19T10:00:00'),
      submittedAt: new Date('2024-09-19T09:45:00'),
      status: 'completed',
      groupName: 'Group_KTPM_22.10_T4,1-2,F210',
    },
  ]);

  const tabs = [
    { key: 'upcoming', label: 'Sắp tới' },
    { key: 'overdue', label: 'Quá hạn', hasNotification: true },
    { key: 'completed', label: 'Đã hoàn thành' },
  ];

  const filteredAssignments = assignments.filter(assignment => assignment.status === activeTab);

  const groupAssignmentsByDate = (assignments: Assignment[]) => {
    const grouped: { [key: string]: Assignment[] } = {};
    
    assignments.forEach(assignment => {
      let dateKey: string;
      const assignmentDate = assignment.status === 'completed' && assignment.submittedAt 
        ? assignment.submittedAt 
        : assignment.dueDate;
      
      if (activeTab === 'completed') {
        dateKey = assignmentDate.toLocaleDateString('vi-VN', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          weekday: 'long'
        });
      } else {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const assignmentDateOnly = new Date(assignmentDate.getFullYear(), assignmentDate.getMonth(), assignmentDate.getDate());
        
        const diffTime = assignmentDateOnly.getTime() - today.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < -365) {
          dateKey = `Đến hạn một năm trước`;
        } else if (diffDays < -30) {
          dateKey = `Đến hạn ${Math.abs(Math.floor(diffDays / 30))} tháng trước`;
        } else if (diffDays < -7) {
          dateKey = `Đến hạn ${Math.abs(Math.floor(diffDays / 7))} tuần trước`;
        } else if (diffDays < -1) {
          dateKey = `Đến hạn ${Math.abs(diffDays)} ngày trước`;
        } else if (diffDays === -1) {
          dateKey = `Đến hạn hôm qua`;
        } else if (diffDays === 0) {
          dateKey = `Đến hạn hôm nay`;
        } else if (diffDays === 1) {
          dateKey = `Đến hạn ngày mai`;
        } else if (diffDays < 7) {
          dateKey = `Đến hạn ${diffDays} ngày nữa`;
        } else {
          dateKey = assignmentDate.toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }) + ` Đến hạn ${Math.floor(diffDays / 7)} tuần nữa`;
        }
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(assignment);
    });
    
    return grouped;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyImageContainer}>
        <View style={styles.bookIcon}>
          <View style={styles.book}>
            <View style={styles.bookCover} />
            <View style={styles.bookPages} />
            <View style={styles.bookSpine} />
          </View>
          <View style={styles.starBadge}>
            <Ionicons name="star" size={12} color="#fff" />
          </View>
          <View style={styles.pencil}>
            <View style={styles.pencilBody} />
            <View style={styles.pencilTip} />
            <View style={styles.pencilEraser} />
          </View>
        </View>
      </View>
      
      <Text style={styles.emptyTitle}>
        Không có bài tập sắp tới nào vào lúc này.
      </Text>
      
      <Text style={styles.emptySubtitle}>
        Hãy thử dẫn hướng đến nhóm lớp cá nhân để kiểm tra thêm kết quả.
      </Text>
    </View>
  );

  const renderAssignmentList = () => {
    if (filteredAssignments.length === 0) {
      return renderEmptyState();
    }

    const groupedAssignments = groupAssignmentsByDate(filteredAssignments);

    return (
      <>
        {Object.entries(groupedAssignments).map(([dateKey, assignmentList]) => (
          <View key={dateKey} style={styles.dateSection}>
            <Text style={styles.dateHeader}>{dateKey}</Text>
            {assignmentList.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                {...assignment}
                onPress={() => {
                  // Handle assignment press
                  console.log('Assignment pressed:', assignment.id);
                }}
              />
            ))}
          </View>
        ))}
        
        {activeTab === 'overdue' && (
          <View style={styles.helpText}>
            <Text style={styles.helpTextContent}>
              Để xem các bài tập cũ hơn, hãy điều hướng đến một nhóm lớp cá nhân.
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VH</Text>
          </View>
          <Text style={styles.headerTitle}>Bài tập</Text>
        </View>
        <Pressable style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {tab.hasNotification && activeTab !== 'overdue' && (
              <View style={styles.notificationDot} />
            )}
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderAssignmentList()}
      </ScrollView>

      {/* Info button */}
      <View style={styles.infoButtonContainer}>
        <Pressable style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  menuButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6264a7',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d73527',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  dateSection: {
    marginTop: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  helpText: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  helpTextContent: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyImageContainer: {
    marginBottom: 32,
  },
  bookIcon: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  book: {
    width: 60,
    height: 70,
    position: 'relative',
  },
  bookCover: {
    width: 60,
    height: 70,
    backgroundColor: '#a8e6cf',
    borderRadius: 4,
    position: 'absolute',
  },
  bookPages: {
    width: 56,
    height: 66,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    left: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bookSpine: {
    width: 4,
    height: 70,
    backgroundColor: '#7bb3f2',
    position: 'absolute',
    left: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  starBadge: {
    position: 'absolute',
    top: 20,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6264a7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencil: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    transform: [{ rotate: '45deg' }],
  },
  pencilBody: {
    width: 30,
    height: 4,
    backgroundColor: '#ffd93d',
    borderRadius: 2,
  },
  pencilTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    borderRightWidth: 3,
    borderRightColor: 'transparent',
    borderTopWidth: 6,
    borderTopColor: '#8b4513',
    position: 'absolute',
    right: -3,
    top: -1,
  },
  pencilEraser: {
    width: 6,
    height: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 3,
    position: 'absolute',
    left: -3,
    top: -1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoButtonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
  },
  infoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AssignmentScreen;