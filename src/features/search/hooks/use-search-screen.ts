import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { profileService, User } from '@/features/profile'
import { classService } from '@/features/classroom'
import { useAuth } from '@/global/context'

export type SearchCategory = 'all' | 'people' | 'messages' | 'files'

export interface SearchResult {
    id: string
    type: 'person' | 'message' | 'file'
    title: string
    subtitle?: string
    avatarUrl?: string
    timestamp?: string
}

const RECENT_SEARCHES_KEY = 'recent_searches'
const MAX_RECENT_SEARCHES = 10

export function useSearchScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchText, setSearchText] = useState('')
    const [activeCategory, setActiveCategory] = useState<SearchCategory>('all')
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [recommendedPeople, setRecommendedPeople] = useState<User[]>([])
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadRecentSearches()
        loadRecommendedPeople()
    }, [])

    useEffect(() => {
        if (searchText.trim()) {
            performSearch()
        } else {
            setSearchResults([])
        }
    }, [searchText, activeCategory])

    const loadRecentSearches = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
            if (stored) {
                setRecentSearches(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Error loading recent searches:', error)
        }
    }, [])

    const saveRecentSearch = useCallback(async (search: string) => {
        try {
            const trimmed = search.trim()
            if (!trimmed) return

            const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, MAX_RECENT_SEARCHES)
            setRecentSearches(updated)
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
        } catch (error) {
            console.error('Error saving recent search:', error)
        }
    }, [recentSearches])

    const removeRecentSearch = useCallback(async (search: string) => {
        try {
            const updated = recentSearches.filter(s => s !== search)
            setRecentSearches(updated)
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
        } catch (error) {
            console.error('Error removing recent search:', error)
        }
    }, [recentSearches])

    const loadRecommendedPeople = useCallback(async () => {
        try {
            const response = await profileService.getUsers(1, 100)
            // Randomly select 5-8 people
            const shuffled = response.data.sort(() => 0.5 - Math.random())
            const count = Math.floor(Math.random() * 4) + 5 // Random between 5-8
            setRecommendedPeople(shuffled.slice(0, count))
        } catch (error) {
            console.error('Error loading recommended people:', error)
        }
    }, [])

    const performSearch = useCallback(async () => {
        if (!searchText.trim()) {
            setSearchResults([])
            return
        }

        setIsLoading(true)
        try {
            const results: SearchResult[] = []
            const searchLower = searchText.toLowerCase().trim()

            // Search people
            if (activeCategory === 'all' || activeCategory === 'people') {
                const usersResponse = await profileService.getUsers(1, 1000)
                const matchingUsers = usersResponse.data.filter(u =>
                    u.full_name?.toLowerCase().includes(searchLower) ||
                    u.user_name?.toLowerCase().includes(searchLower) ||
                    u.email?.toLowerCase().includes(searchLower)
                )

                results.push(...matchingUsers.map(u => ({
                    id: `user-${u.user_id}`,
                    type: 'person' as const,
                    title: u.full_name || u.user_name || 'Unknown',
                    subtitle: u.email,
                    avatarUrl: u.avatar,
                })))
            }

            // Search files/materials (from user's classes)
            if (activeCategory === 'all' || activeCategory === 'files') {
                try {
                    if (user?.user_id) {
                        // Get user's classes
                        const role = user.role === 'teacher' ? 'teacher' : 'student'
                        const classes = await classService.getClassesByUserRole(role, Number(user.user_id))

                        // Search materials from all classes
                        for (const classEntity of classes) {
                            try {
                                const materials = await classService.getMaterials(classEntity.class_id)
                                const matchingMaterials = materials.filter(m =>
                                    m.material_name?.toLowerCase().includes(searchLower)
                                )

                                results.push(...matchingMaterials.map(m => ({
                                    id: `material-${m.material_id}`,
                                    type: 'file' as const,
                                    title: m.material_name,
                                    subtitle: `${classEntity.class_name}`,
                                    timestamp: m.uploaded_at,
                                })))
                            } catch (error) {
                                console.error(`Error fetching materials for class ${classEntity.class_id}:`, error)
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error searching materials:', error)
                }
            }

            // TODO: Search messages when chat service is available
            // For now, we'll show a placeholder for messages category
            if (activeCategory === 'messages') {
                // Placeholder for message search
                // Will be implemented when chat search API is available
            }

            setSearchResults(results)
        } catch (error) {
            console.error('Error performing search:', error)
        } finally {
            setIsLoading(false)
        }
    }, [searchText, activeCategory, user])

    const handleSearchSubmit = useCallback(() => {
        if (searchText.trim()) {
            saveRecentSearch(searchText)
            performSearch()
        }
    }, [searchText, saveRecentSearch, performSearch])

    const handleSearchTextChange = useCallback((text: string) => {
        setSearchText(text)
    }, [])

    const handleCategoryChange = useCallback((category: SearchCategory) => {
        setActiveCategory(category)
    }, [])

    const handleRecentSearchPress = useCallback((search: string) => {
        setSearchText(search)
        saveRecentSearch(search)
    }, [saveRecentSearch])

    const handleClearSearch = useCallback(() => {
        setSearchText('')
        setSearchResults([])
    }, [])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleResultPress = useCallback((result: SearchResult) => {
        // Navigate based on result type
        if (result.type === 'person') {
            // Extract user ID from result.id (format: "user-{id}")
            const userId = result.id.replace('user-', '')

            // Navigate to conversation with this user
            router.push({
                pathname: '/(chat)/conversation',
                params: {
                    contactName: result.title,
                    contactEmail: result.subtitle || '',
                    conversationId: 0, // New conversation
                    receiverId: userId,
                    currentUserId: user?.user_id || 0,
                },
            })
        } else if (result.type === 'file') {
            // TODO: Navigate to file or download
            console.log('Navigate to file:', result.id)
        } else if (result.type === 'message') {
            // TODO: Navigate to message/chat
            console.log('Navigate to message:', result.id)
        }
    }, [router, user])

    return {
        // State
        searchText,
        activeCategory,
        recentSearches,
        recommendedPeople,
        searchResults,
        isLoading,

        // Handlers
        handleSearchTextChange,
        handleSearchSubmit,
        handleCategoryChange,
        handleRecentSearchPress,
        handleClearSearch,
        removeRecentSearch,
        handleBack,
        handleResultPress,
    }
}
