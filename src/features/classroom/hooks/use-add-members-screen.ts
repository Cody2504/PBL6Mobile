import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { classService } from '@/features/classroom'
import { profileService, User } from '@/features/profile'

export interface SelectedMember extends User {
    selected?: boolean
}

export function useAddMembersScreen() {
    const router = useRouter()
    const { classId, teamName } = useLocalSearchParams()

    const [activeTab, setActiveTab] = useState<'Students' | 'Teachers'>('Students')
    const [searchText, setSearchText] = useState('')
    const [users, setUsers] = useState<SelectedMember[]>([])
    const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchUsers(1)
    }, [])

    const fetchUsers = useCallback(async (pageNum: number = 1, search?: string) => {
        try {
            setIsLoading(true)
            const response = await profileService.getUsers(pageNum, 10, search)

            // Filter users based on active tab
            let filteredUsers = response.data
            if (activeTab === 'Students') {
                filteredUsers = response.data.filter(
                    (user) => user.role !== 'teacher' && user.role !== 'admin',
                )
            } else if (activeTab === 'Teachers') {
                filteredUsers = response.data.filter((user) => user.role === 'teacher')
            }

            // Transform users to include selected flag
            const transformedUsers = filteredUsers.map((user) => ({
                ...user,
                selected: false,
            }))

            setUsers(transformedUsers)
            setPage(pageNum)
            setHasMore(
                response.pagination.page * response.pagination.limit <
                response.pagination.total,
            )
        } catch (error) {
            console.error('Error fetching users:', error)
            Alert.alert('Error', 'Failed to fetch users')
        } finally {
            setIsLoading(false)
        }
    }, [activeTab])

    const handleSearch = useCallback(async (text: string) => {
        setSearchText(text)
        if (text.trim()) {
            await fetchUsers(1, text)
        } else {
            await fetchUsers(1)
        }
    }, [fetchUsers])

    const handleTabChange = useCallback((tab: 'Students' | 'Teachers') => {
        setActiveTab(tab)
        fetchUsers(1, searchText)
    }, [fetchUsers, searchText])

    const handleSkip = useCallback(() => {
        router.back()
    }, [router])

    const handleDone = useCallback(async () => {
        if (selectedMembers.length === 0) {
            Alert.alert('Info', 'Please select at least one member to add')
            return
        }

        if (!classId) {
            Alert.alert('Error', 'Class ID is missing')
            return
        }

        setIsSubmitting(true)
        try {
            // Transform selected members to UserInfo format
            const students = selectedMembers.map((member) => ({
                id:
                    typeof member.user_id === 'string'
                        ? parseInt(member.user_id)
                        : member.user_id,
                email: member.email,
                firstName:
                    (member.user_name || member.full_name || '').split(' ')[0] || '',
                lastName:
                    (member.user_name || member.full_name || '')
                        .split(' ')
                        .slice(1)
                        .join(' ') || '',
            }))

            // Call API to add students to class
            await classService.addStudentsToClass({
                class_id: parseInt(classId as string),
                students: students,
            })

            Alert.alert('Success', 'New users have been added successfully', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ])
        } catch (error) {
            Alert.alert('Error', 'Failed to add members. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }, [selectedMembers, classId, router])

    const toggleMemberSelection = useCallback((member: SelectedMember) => {
        setSelectedMembers((prev) => {
            const isSelected = prev.some((m) => m.user_id === member.user_id)
            if (isSelected) {
                return prev.filter((m) => m.user_id !== member.user_id)
            } else {
                return [...prev, member]
            }
        })

        // Update the users list to reflect selection
        setUsers((prev) =>
            prev.map((user) =>
                user.user_id === member.user_id
                    ? { ...user, selected: !user.selected }
                    : user,
            ),
        )
    }, [])

    return {
        // Params
        teamName,

        // State
        activeTab,
        searchText,
        users,
        selectedMembers,
        isLoading,
        isSubmitting,

        // Handlers
        handleSearch,
        handleTabChange,
        handleSkip,
        handleDone,
        toggleMemberSelection,
    }
}
