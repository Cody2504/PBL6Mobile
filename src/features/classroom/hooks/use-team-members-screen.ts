import { useState, useEffect, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { classService, Student } from '@/features/classroom'
import { useAuth, useToast } from '@/global/context'

export interface Member extends Student {
  avatar?: string
  role?: string
}

type TabType = 'owners' | 'members'

export function useTeamMembersScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { user } = useAuth()
  const { showError } = useToast()

  const classroomId = params.classroomId as string
  const classroomName = params.classroomName as string
  const userRole = params.userRole as string

  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('members')

  const fetchMembers = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      console.log('🔍 Fetching members for classroomId:', classroomId)
      const membersList = await classService.getClassMembers(classroomId)
      console.log('👥 Final members list:', membersList)
      setMembers(membersList)
    } catch (error) {
      console.error('❌ Error fetching members:', error)
      showError('Tải danh sách thành viên thất bại')
      setMembers([]) // Set empty array on error
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [classroomId])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const onRefresh = useCallback(() => {
    fetchMembers(true)
  }, [fetchMembers])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text)
  }, [])

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
  }, [])

  // Helper functions for UI
  const getInitials = useCallback((name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
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
    const index = (name || '').charCodeAt(0) % colors.length
    return colors[index]
  }, [])

  // Filter members based on search query and active tab
  const filteredMembers = (members || []).filter((member) => {
    // Filter by tab
    if (activeTab === 'owners' && member.role !== 'teacher') {
      return false
    }
    if (activeTab === 'members' && member.role === 'teacher') {
      return false
    }

    // Filter by search
    if (!searchQuery.trim()) return true

    const searchLower = searchQuery.toLowerCase()
    const name = (member.user_name || '').toLowerCase()
    const email = (member.email || '').toLowerCase()

    return name.includes(searchLower) || email.includes(searchLower)
  })

  return {
    // User
    user,

    // Params
    classroomName,
    userRole,

    // State
    members: filteredMembers,
    displayedMembers: filteredMembers,
    totalCount: members.length,
    isLoading,
    isRefreshing,
    searchQuery,
    activeTab,

    // Handlers
    handleBack,
    handleSearch,
    handleTabChange,
    onRefresh,

    // Helpers
    getInitials,
    getAvatarColor,
  }
}
