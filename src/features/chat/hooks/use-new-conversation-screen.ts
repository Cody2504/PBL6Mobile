import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { profileService, User } from '@/features/profile'
import { useAuth } from '@/global/context'

const RECENT_CHATS_KEY = 'recent_chats'
const MAX_RECENT_CHATS = 10

export function useNewConversationScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchText, setSearchText] = useState('')
    const [recentChats, setRecentChats] = useState<User[]>([])
    const [recommendedPeople, setRecommendedPeople] = useState<User[]>([])
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadRecentChats()
        loadRecommendedPeople()
    }, [])

    useEffect(() => {
        if (searchText.trim()) {
            performSearch()
        } else {
            setSearchResults([])
        }
    }, [searchText])

    const loadRecentChats = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_CHATS_KEY)
            if (stored) {
                const userIds: string[] = JSON.parse(stored)
                // Fetch user details for recent chats
                const users: User[] = []
                for (const userId of userIds) {
                    try {
                        const response = await profileService.getUserById(Number(userId))
                        if (response.data) {
                            // Transform UserProfile to User
                            const userProfile = response.data
                            const transformedUser: User = {
                                user_id: userProfile.user_id.toString(),
                                user_name: userProfile.full_name,
                                full_name: userProfile.full_name,
                                email: userProfile.email,
                                avatar: userProfile.avatar,
                                role: userProfile.role,
                                status: userProfile.status,
                            }
                            users.push(transformedUser)
                        }
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error)
                    }
                }
                setRecentChats(users)
            }
        } catch (error) {
            console.error('Error loading recent chats:', error)
        }
    }, [])

    const saveRecentChat = useCallback(async (userId: string | number) => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_CHATS_KEY)
            let userIds: string[] = stored ? JSON.parse(stored) : []

            // Remove if exists and add to front
            const userIdStr = String(userId)
            userIds = [userIdStr, ...userIds.filter(id => id !== userIdStr)].slice(0, MAX_RECENT_CHATS)

            await AsyncStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(userIds))
        } catch (error) {
            console.error('Error saving recent chat:', error)
        }
    }, [])

    const loadRecommendedPeople = useCallback(async () => {
        try {
            const response = await profileService.getUsers(1, 100)
            // Filter out current user and randomly select 5-8 people
            const otherUsers = response.data.filter(u => u.user_id !== user?.user_id)
            const shuffled = otherUsers.sort(() => 0.5 - Math.random())
            const count = Math.floor(Math.random() * 4) + 5 // Random between 5-8
            setRecommendedPeople(shuffled.slice(0, count))
        } catch (error) {
            console.error('Error loading recommended people:', error)
        }
    }, [user])

    const performSearch = useCallback(async () => {
        if (!searchText.trim()) {
            setSearchResults([])
            return
        }

        setIsLoading(true)
        try {
            const searchLower = searchText.toLowerCase().trim()
            const response = await profileService.getUsers(1, 1000)

            // Filter users by search text and exclude current user
            const matchingUsers = response.data.filter(u => {
                if (u.user_id === user?.user_id) return false

                const fullName = u.full_name?.toLowerCase() || ''
                const userName = u.user_name?.toLowerCase() || ''
                const email = u.email?.toLowerCase() || ''

                return fullName.includes(searchLower) ||
                       userName.includes(searchLower) ||
                       email.includes(searchLower)
            })

            setSearchResults(matchingUsers)
        } catch (error) {
            console.error('Error performing search:', error)
        } finally {
            setIsLoading(false)
        }
    }, [searchText, user])

    const handleSearchTextChange = useCallback((text: string) => {
        setSearchText(text)
    }, [])

    const handleClearSearch = useCallback(() => {
        setSearchText('')
        setSearchResults([])
    }, [])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleUserPress = useCallback(async (selectedUser: User) => {
        // Save to recent chats
        await saveRecentChat(selectedUser.user_id)

        // Navigate to conversation
        router.push({
            pathname: '/(chat)/conversation',
            params: {
                contactName: selectedUser.full_name || selectedUser.user_name || 'User',
                contactEmail: selectedUser.email || '',
                conversationId: 0, // New conversation
                receiverId: selectedUser.user_id,
                currentUserId: user?.user_id || 0,
            },
        })
    }, [router, user, saveRecentChat])

    return {
        // State
        searchText,
        recentChats,
        recommendedPeople,
        searchResults,
        isLoading,

        // Handlers
        handleSearchTextChange,
        handleClearSearch,
        handleBack,
        handleUserPress,
    }
}
