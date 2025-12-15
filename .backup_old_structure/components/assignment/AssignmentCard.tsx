import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AssignmentCardProps {
  id: string
  title: string
  dueDate: Date
  submittedAt?: Date
  status: 'upcoming' | 'overdue' | 'completed'
  points?: number
  groupName: string
  onPress?: () => void
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  dueDate,
  submittedAt,
  status,
  points,
  groupName,
  onPress,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffHours = Math.abs(diffTime) / (1000 * 60 * 60)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  }

  const formatSubmittedDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `Đã gửi vào lúc ${hours}:${minutes}`
  }

  const getStatusText = () => {
    if (status === 'completed' && submittedAt) {
      return formatSubmittedDate(submittedAt)
    } else if (status === 'overdue') {
      return `Đến hạn lúc ${formatDate(dueDate)}`
    } else {
      return `Đến hạn lúc ${formatDate(dueDate)}`
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'overdue':
        return '#d73527'
      case 'completed':
        return '#666'
      default:
        return '#d73527'
    }
  }

  const getInitials = (name: string) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = ['#6264a7', '#d73527', '#f4a261', '#2d89ef', '#00bcaa']
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(groupName) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(groupName)}</Text>
          </View>
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          <Text style={styles.groupName} numberOfLines={1}>
            {groupName}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {points !== undefined && (
            <Text style={styles.points}>{points} điểm</Text>
          )}
          {status === 'completed' && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark" size={16} color="#22c55e" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  leftSection: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  middleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
  },
  groupName: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e6f7e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AssignmentCard
