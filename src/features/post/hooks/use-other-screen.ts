import { useState, useEffect, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { classService } from '@/features/classroom'

export interface AppItem {
    id: string
    name: string
    icon: string
    iconColor: string
    iconBackground: string
    category: 'assistant' | 'added' | 'other'
}

export function useOtherScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [className, setClassName] = useState<string>('')

    const assistantApps: AppItem[] = [
        {
            id: '1',
            name: 'Thêm trợ lý ảo và bot',
            icon: 'robot',
            iconColor: '#666',
            iconBackground: '#f0f0f0',
            category: 'assistant',
        },
    ]

    const addedApps: AppItem[] = [
        {
            id: '2',
            name: 'Forms',
            icon: 'form-select',
            iconColor: '#fff',
            iconBackground: '#20b2aa',
            category: 'added',
        },
    ]

    const otherApps: AppItem[] = [
        {
            id: '3',
            name: 'Thêm ứng dụng',
            icon: 'apps',
            iconColor: '#666',
            iconBackground: '#f0f0f0',
            category: 'other',
        },
    ]

    const powerApps: AppItem[] = [
        {
            id: '4',
            name: 'Power Apps',
            icon: 'lightning-bolt',
            iconColor: '#fff',
            iconBackground: '#742774',
            category: 'other',
        },
    ]

    useEffect(() => {
        fetchClassName()
    }, [params.classId])

    const fetchClassName = useCallback(async () => {
        try {
            const classResponse = await classService.getClassById(
                params.classId as string,
            )
            setClassName(classResponse.class_name)
        } catch (error) {
            console.error('Error fetching class data:', error)
        }
    }, [params.classId])

    const handleBackPress = useCallback(() => {
        router.back()
    }, [router])

    const handleGroupNamePress = useCallback(() => {
        router.push({
            pathname: '/(group)/team-detail',
            params: {
                classId: params.classId,
                className: params.classroomName,
            },
        })
    }, [router, params.classId, params.classroomName])

    const handleAppPress = useCallback((app: AppItem) => {
        console.log('App pressed:', app.name)
        // TODO: Implement app navigation/action
    }, [])

    const navigateToPostsTab = useCallback(() => {
        router.push({
            pathname: '/(post)/post-screen',
            params: {
                classId: params.classId,
                classroomName: params.classroomName,
            },
        })
    }, [router, params.classId, params.classroomName])

    const navigateToFilesTab = useCallback(() => {
        router.push({
            pathname: '/(post)/files-screen',
            params: {
                classId: params.classId,
                classroomName: params.classroomName,
            },
        })
    }, [router, params.classId, params.classroomName])

    return {
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
    }
}
