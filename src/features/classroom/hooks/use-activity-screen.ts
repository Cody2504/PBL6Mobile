import { useState, useCallback } from 'react'
import * as Haptics from 'expo-haptics'

export interface ActivityItem {
    id: string
    type: 'mention' | 'post' | 'added'
    userName: string
    userAvatar?: string
    action: string
    groupName: string
    groupPath: string
    message?: string
    timestamp: string
    isUnread?: boolean
}

export type FilterType = 'unread' | 'mentions' | 'messages'

export interface Filter {
    key: FilterType
    label: string
}

export function useActivityScreen() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('unread')
    const [refreshing, setRefreshing] = useState(false)

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
    ])

    const filters: Filter[] = [
        { key: 'unread', label: 'Chưa đọc' },
        { key: 'mentions', label: '@Đề cập đến' },
        { key: 'messages', label: 'Tin nhắn trả lời' },
    ]

    const handleFilterChange = useCallback((filter: FilterType) => {
        setActiveFilter(filter)
    }, [])

    const getInitials = useCallback((name: string) => {
        const names = name.split(' ')
        return names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : name[0].toUpperCase()
    }, [])

    const getAvatarColor = useCallback((name: string) => {
        const colors = [
            '#2563EB',
            '#DC2626',
            '#16A34A',
            '#EA580C',
            '#7C3AED',
            '#DB2777',
        ]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        // Simulate refresh delay for mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setRefreshing(false)
    }, [])

    return {
        // State
        activeFilter,
        activities,
        filters,
        refreshing,

        // Handlers
        handleFilterChange,
        getInitials,
        getAvatarColor,
        onRefresh,
    }
}
