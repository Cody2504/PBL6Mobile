import { useState, useEffect, useCallback } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { classService } from '@/features/classroom'
import { profileService, User } from '@/features/profile'
import { useToast } from '@/global/context'

export interface SelectedMember extends User {
    selected?: boolean
}

export function useAddMembersScreen() {
    const router = useRouter()
    const { classId, teamName } = useLocalSearchParams()
    const { showSuccess, showError, showWarning } = useToast()

    const [activeTab, setActiveTab] = useState<'Students' | 'Teachers'>('Students')
    const [searchText, setSearchText] = useState('')
    const [users, setUsers] = useState<SelectedMember[]>([])
    const [cachedUsers, setCachedUsers] = useState<SelectedMember[]>([])
    const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [existingMemberIds, setExistingMemberIds] = useState<Set<string | number>>(new Set())

    useEffect(() => {
        fetchExistingMembers()
    }, [])

    const fetchExistingMembers = useCallback(async () => {
        try {
            if (!classId) return

            // Fetch existing class members
            const members = await classService.getClassMembers(classId as string)
            const memberIds = new Set(members.map((member) => member.user_id))
            setExistingMemberIds(memberIds)

            // After getting existing members, fetch all users
            await fetchUsers(memberIds)
        } catch (error) {
            console.error('Error fetching existing members:', error)
            // Continue to fetch users even if this fails
            await fetchUsers(new Set())
        }
    }, [classId])

    const fetchUsers = useCallback(async (existingIds: Set<string | number>) => {
        try {
            setIsLoading(true)
            // Fetch all users at once with a large limit
            const response = await profileService.getUsers(1, 1000)

            // Filter out users who are already members of the class
            const filteredUsers = response.data.filter((user) => !existingIds.has(user.user_id))

            // Transform users to include selected flag
            const transformedUsers = filteredUsers.map((user) => ({
                ...user,
                selected: false,
            }))

            // Cache all users
            setCachedUsers(transformedUsers)

            // Apply initial filter for current tab
            filterUsers(transformedUsers, '', activeTab)
        } catch (error) {
            console.error('Error fetching users:', error)
            showError('Tải danh sách người dùng thất bại')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const filterUsers = useCallback((
        usersToFilter: SelectedMember[],
        search: string,
        tab: 'Students' | 'Teachers'
    ) => {
        let filtered = usersToFilter

        // Filter by role based on active tab
        if (tab === 'Students') {
            filtered = filtered.filter(
                (user) => user.role !== 'teacher' && user.role !== 'admin',
            )
        } else if (tab === 'Teachers') {
            filtered = filtered.filter((user) => user.role === 'teacher')
        }

        // Filter by search text (email or name)
        if (search.trim()) {
            const searchLower = search.toLowerCase().trim()
            filtered = filtered.filter((user) => {
                const email = user.email?.toLowerCase() || ''
                const userName = user.user_name?.toLowerCase() || ''
                const fullName = user.full_name?.toLowerCase() || ''

                return email.includes(searchLower) ||
                    userName.includes(searchLower) ||
                    fullName.includes(searchLower)
            })
        }

        setUsers(filtered)
    }, [])

    const handleSearch = useCallback((text: string) => {
        setSearchText(text)
        // Filter cached users based on search text
        filterUsers(cachedUsers, text, activeTab)
    }, [cachedUsers, activeTab, filterUsers])

    const handleTabChange = useCallback((tab: 'Students' | 'Teachers') => {
        setActiveTab(tab)
        // Filter cached users based on new tab and current search text
        filterUsers(cachedUsers, searchText, tab)
    }, [cachedUsers, searchText, filterUsers])

    const handleSkip = useCallback(() => {
        router.back()
    }, [router])

    const handleDone = useCallback(async () => {
        if (selectedMembers.length === 0) {
            showWarning('Vui lòng chọn ít nhất một thành viên')
            return
        }

        if (!classId) {
            showError('Thiếu ID lớp học')
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

            showSuccess('Thêm thành viên thành công!')
            router.back()
        } catch (error) {
            showError('Thêm thành viên thất bại. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }, [selectedMembers, classId, router, showSuccess, showError, showWarning])

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
