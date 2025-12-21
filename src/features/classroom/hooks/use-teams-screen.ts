import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { classService, Class } from '@/features/classroom'
import { useAuth, useTeamsCache, useToast } from '@/global/context'

// Helper function to generate avatar color and text
const generateAvatarData = (name: string, index: number) => {
    const colors = [
        '#2563EB',
        '#DC2626',
        '#16A34A',
        '#EA580C',
        '#7C3AED',
        '#DB2777',
    ]

    return {
        avatarColor: colors[index % colors.length],
        avatarText: name.charAt(0).toUpperCase(),
    }
}

export interface Classroom {
    id: string
    name: string
    code: string
    description: string
    teacher_id: string
    created_at: string
    avatarColor: string
    avatarText: string
    role: 'student' | 'teacher'
    memberCount?: number
    members?: Array<{ user_id: string | number; user_name: string; email: string }>
}

export function useTeamsScreen() {
    const router = useRouter()
    const { user, isTeacher, isStudent } = useAuth()
    const { cachedTeams, setCachedTeams, isCacheValid, invalidateCache } = useTeamsCache()
    const { showSuccess, showError } = useToast()
    const [showTeamOptions, setShowTeamOptions] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [classrooms, setClassrooms] = useState<Classroom[]>(cachedTeams)
    const [isLoading, setIsLoading] = useState(!isCacheValid)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchClasses = useCallback(async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setIsRefreshing(true)
            } else {
                setIsLoading(true)
            }

            if (!user?.user_id) {
                console.error('User ID not found')
                return
            }

            // Determine user role and fetch classes accordingly
            let role: 'teacher' | 'student' = 'student'
            if (isTeacher()) {
                role = 'teacher'
            }

            const response: Class[] = await classService.getClassesByUserRole(
                role,
                Number(user.user_id),
            )

            // Transform classes to classrooms with avatar data and fetch members
            const transformedClassesPromises = response.map(
                async (classEntity, index) => {
                    const avatarData = generateAvatarData(classEntity.class_name, index)

                    // Fetch members for this class
                    let members: Array<{ user_id: string | number; user_name: string; email: string }> = []
                    let memberCount = 0
                    try {
                        members = await classService.getClassMembers(classEntity.class_id)
                        memberCount = members.length
                    } catch (error) {
                        console.error(`Error fetching members for class ${classEntity.class_id}:`, error)
                    }

                    return {
                        id: classEntity.class_id,
                        name: classEntity.class_name,
                        code: classEntity.class_code,
                        description: classEntity.description ?? '',
                        teacher_id: classEntity.teacher_id ?? '',
                        created_at: classEntity.created_at ?? '',
                        ...avatarData,
                        role: isTeacher() ? ('teacher' as const) : ('student' as const),
                        memberCount,
                        members,
                    }
                },
            )

            const transformedClasses: Classroom[] = await Promise.all(transformedClassesPromises)
            setClassrooms(transformedClasses)
            setCachedTeams(transformedClasses) // Update cache
        } catch (error) {
            console.error('Error fetching classes:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [user?.user_id, isTeacher, setCachedTeams])

    const checkForNewClass = useCallback(async () => {
        try {
            const newClassData = await AsyncStorage.getItem('new_class_data')
            if (newClassData) {
                // New class added, invalidate cache and fetch
                invalidateCache()
                await fetchClasses()
                await AsyncStorage.removeItem('new_class_data')
            } else if (!isCacheValid) {
                // Cache invalid, fetch data
                await fetchClasses()
            } else {
                // Cache valid, use cached data
                setClassrooms(cachedTeams)
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error checking for new class:', error)
            if (!isCacheValid) {
                await fetchClasses()
            }
        }
    }, [fetchClasses, isCacheValid, cachedTeams, invalidateCache])

    useFocusEffect(
        useCallback(() => {
            checkForNewClass()
        }, [checkForNewClass]),
    )

    const onRefresh = useCallback(() => {
        fetchClasses(true)
    }, [fetchClasses])

    const navigateToPosts = useCallback((classroom: Classroom) => {
        router.push({
            pathname: '/(post)/post-screen',
            params: {
                classId: classroom.id,
            },
        })
    }, [router])

    const handleGridPress = useCallback(() => {
        setShowTeamOptions(true)
    }, [])

    const handleCloseTeamOptions = useCallback(() => {
        setShowTeamOptions(false)
    }, [])

    const handleCreateTeam = useCallback(() => {
        setShowTeamOptions(false)
        router.push('/(group)/create-team')
    }, [router])

    const handleBrowseTeams = useCallback(() => {
        setShowTeamOptions(false)
    }, [])

    const handleJoinWithCode = useCallback(() => {
        setShowTeamOptions(false)
        setShowJoinModal(true)
    }, [])

    const handleCloseJoinModal = useCallback(() => {
        setShowJoinModal(false)
    }, [])

    const handleJoinSuccess = useCallback(() => {
        // Refresh the class list after successful join
        invalidateCache()
        fetchClasses()
    }, [invalidateCache, fetchClasses])

    const handleOptionSelect = useCallback((option: 'members' | 'hide' | 'delete', classroomId: string, classroomName: string) => {
        console.log(`Selected ${option} for ${classroomName} (id: ${classroomId})`)

        if (option === 'delete') {
            Alert.alert(
                'Xóa lớp học',
                `Bạn có chắc chắn muốn xóa lớp "${classroomName}"? Hành động này không thể hoàn tác.`,
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                setIsDeleting(true)
                                await classService.deleteClass(classroomId)
                                showSuccess('Đã xóa lớp học thành công!')
                                // Refresh the class list
                                invalidateCache()
                                fetchClasses()
                            } catch (error) {
                                console.error('Error deleting class:', error)
                                showError('Không thể xóa lớp học. Vui lòng thử lại.')
                            } finally {
                                setIsDeleting(false)
                            }
                        },
                    },
                ]
            )
        }
    }, [invalidateCache, fetchClasses, showSuccess, showError])

    const navigateToChatbot = useCallback(() => {
        router.push('/(chatbot)/conversation')
    }, [router])

    const navigateToSearch = useCallback(() => {
        router.push('/(search)/search')
    }, [router])

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev)
    }, [])

    return {
        // State
        user,
        classrooms,
        isLoading,
        isRefreshing,
        isDeleting,
        showTeamOptions,
        showJoinModal,
        isCollapsed,

        // Auth helpers
        isTeacher,
        isStudent,

        // Handlers
        onRefresh,
        navigateToPosts,
        handleGridPress,
        handleCloseTeamOptions,
        handleCreateTeam,
        handleBrowseTeams,
        handleJoinWithCode,
        handleCloseJoinModal,
        handleJoinSuccess,
        handleOptionSelect,
        navigateToChatbot,
        navigateToSearch,
        toggleCollapse,
    }
}
