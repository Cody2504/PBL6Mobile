import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { classService, Post, ClassFullInfo } from '@/features/classroom'
import { useAuth } from '@/global/context'

export type TabType = 'posts' | 'files' | 'other'

export function usePostScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { user } = useAuth()

    const [classData, setClassData] = useState<ClassFullInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<Post[]>([])
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('posts')
    const [materials, setMaterials] = useState<any[]>([])
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchClassData()
    }, [params.classId])

    const fetchClassData = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await classService.getClassById(params.classId as string)
            setClassData(response)

            // Fetch materials for the class
            let fetchedMaterials: any[] = []
            try {
                const materialsResponse = await classService.getMaterials(
                    params.classId as string,
                )
                fetchedMaterials = materialsResponse || []
                setMaterials(fetchedMaterials)
            } catch (materialError) {
                console.error('Error fetching materials:', materialError)
                setMaterials([])
            }

            // Enrich posts with their materials
            const postsWithMaterials = response.posts.map((post: Post) => ({
                ...post,
                materials: fetchedMaterials.filter(
                    (material: any) => String(material.post_id) === String(post.id),
                ),
            }))

            // Filter only main posts (posts with parent_id = null)
            const mainPosts = postsWithMaterials.filter(
                (post: Post) => post.parent_id === null,
            )
            setPosts(mainPosts)

            // Update classData with enriched posts
            setClassData({
                ...response,
                posts: postsWithMaterials,
            })
        } catch (error) {
            console.error('Error fetching class data:', error)
            Alert.alert('Error', 'Failed to load class data')
        } finally {
            setIsLoading(false)
        }
    }, [params.classId])

    const handleCreatePostPress = useCallback(() => {
        setIsCreateModalVisible(true)
    }, [])

    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalVisible(false)
    }, [])

    const handlePostSuccess = useCallback(async () => {
        await fetchClassData()
    }, [fetchClassData])

    const handleCommentPress = useCallback((postId: number) => {
        console.log(`Navigating to Post Detail for: ${postId}`)
        router.push({
            pathname: '/(post)/post-detail',
            params: {
                postId: postId,
                classId: classData?.class_id,
            },
        })
    }, [router, classData?.class_id])

    const handleBackPress = useCallback(() => {
        router.push('/(tabs)/teams')
    }, [router])

    const handleHeaderPress = useCallback(() => {
        if (classData) {
            router.push({
                pathname: '/(group)/team-detail',
                params: {
                    classId: classData.class_id,
                    className: classData.class_name,
                    description: classData.description || '',
                    classCode: classData.class_code,
                    teacherId: classData.teacher_id,
                },
            })
        }
    }, [router, classData])

    const handleTabChange = useCallback((tab: TabType) => {
        setActiveTab(tab)
    }, [])

    const getClassId = useCallback(() => {
        const classIdStr = Array.isArray(params.classId)
            ? params.classId[0]
            : params.classId
        return typeof classIdStr === 'string'
            ? parseInt(classIdStr, 10)
            : classIdStr
    }, [params.classId])

    const getUploaderId = useCallback(() => {
        return user?.user_id || 0
    }, [user?.user_id])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        try {
            await fetchClassData()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } catch (error) {
            console.error('Error refreshing posts:', error)
        } finally {
            setRefreshing(false)
        }
    }, [fetchClassData])

    return {
        // Params
        params,

        // State
        classData,
        isLoading,
        posts,
        isCreateModalVisible,
        activeTab,
        materials,
        refreshing,

        // Handlers
        handleCreatePostPress,
        handleCloseCreateModal,
        handlePostSuccess,
        handleCommentPress,
        handleBackPress,
        handleHeaderPress,
        handleTabChange,
        getClassId,
        getUploaderId,
        onRefresh,
    }
}
