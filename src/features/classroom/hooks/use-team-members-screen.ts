import { useState, useEffect, useCallback } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/global/context'

export interface Member {
    user_id: string
    user_name: string
    email: string
    role: 'teacher' | 'student'
    avatar?: string
}

// Mock data
const MOCK_TEACHERS: Member[] = [
    {
        user_id: '1',
        user_name: 'Lê Thị Mỹ Hạnh',
        email: 'ltmhanh@dut.udn.vn',
        role: 'teacher',
    },
]

const MOCK_STUDENTS: Member[] = [
    {
        user_id: '2',
        user_name: 'Bùi Hữu Trọng',
        email: 'buihuutrong@dut.udn.vn',
        role: 'student',
    },
    {
        user_id: '3',
        user_name: 'Bùi Nguyễn Văn Giáp',
        email: 'buinguyenvangiap@dut.udn.vn',
        role: 'student',
    },
    {
        user_id: '4',
        user_name: 'Cao Minh Đức',
        email: 'caominhduc@dut.udn.vn',
        role: 'student',
    },
    {
        user_id: '5',
        user_name: 'Cao Ngọc Quý',
        email: 'caongocquy@dut.udn.vn',
        role: 'student',
    },
    {
        user_id: '6',
        user_name: 'Hà Văn Khánh Đạt',
        email: 'havankhanhdat@dut.udn.vn',
        role: 'student',
    },
]

export function useTeamMembersScreen() {
    const router = useRouter()
    const { classroomId, classroomName } = useLocalSearchParams<{
        classroomId: string
        classroomName: string
    }>()

    const { user } = useAuth()
    const [teachers, setTeachers] = useState<Member[]>(MOCK_TEACHERS)
    const [students, setStudents] = useState<Member[]>(MOCK_STUDENTS)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState<'owners' | 'members'>('owners')

    const fetchClassMembers = useCallback(async (showRefreshing = false) => {
        if (!classroomId) return
        try {
            if (showRefreshing) {
                setIsRefreshing(true)
            } else {
                setIsLoading(true)
            }

            // TODO: Implement API call
            // const response = await classService.getClassMembers(parseInt(classroomId));
            // setTeachers(response.teachers);
            // setStudents(response.students);

            // Using mock data for now
            setTeachers(MOCK_TEACHERS)
            setStudents(MOCK_STUDENTS)
        } catch (error) {
            console.error('Error fetching class members:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [classroomId])

    useEffect(() => {
        fetchClassMembers()
    }, [classroomId, fetchClassMembers])

    const onRefresh = useCallback(() => {
        fetchClassMembers(true)
    }, [fetchClassMembers])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleTabChange = useCallback((tab: 'owners' | 'members') => {
        setActiveTab(tab)
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

    const displayedMembers = activeTab === 'owners' ? teachers : students
    const totalCount = teachers.length + students.length

    return {
        // State
        user,
        classroomName,
        teachers,
        students,
        isLoading,
        isRefreshing,
        activeTab,
        displayedMembers,
        totalCount,

        // Handlers
        onRefresh,
        handleBack,
        handleTabChange,
        getInitials,
        getAvatarColor,
    }
}
