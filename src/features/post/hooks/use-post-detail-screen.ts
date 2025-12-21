import { useState, useRef, useEffect, useCallback } from 'react'
import { TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { classService, Post } from '@/features/classroom'
import { profileService, UserProfile } from '@/features/profile'
import { useAuth, useToast } from '@/global/context'

export function usePostDetailScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { postId, classId, autoFocusComment } = params
    const { user } = useAuth()
    const { showError } = useToast()

    const commentInputRef = useRef<TextInput>(null)

    const [commentText, setCommentText] = useState('')
    const [post, setPost] = useState<Post | null>(null)
    const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
    const [classData, setClassData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState<Post[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Get current user ID from auth context
    const currentUserId = user?.user_id || null

    useEffect(() => {
        fetchPostData()
        if (autoFocusComment === 'true') {
            setTimeout(() => {
                commentInputRef.current?.focus()
            }, 500)
        }
    }, [postId, autoFocusComment])

    const fetchPostData = useCallback(async () => {
        try {
            setIsLoading(true)

            // Fetch class data first to get the post
            const classResponse = await classService.getClassById(classId as string)

            // Fetch materials for the class
            let fetchedMaterials: any[] = []
            try {
                const materialsResponse = await classService.getMaterials(
                    classId as string,
                )
                fetchedMaterials = materialsResponse || []
            } catch (materialError) {
                console.error('Error fetching materials:', materialError)
            }

            // Enrich posts with their materials
            const postsWithMaterials = classResponse.posts.map((p: Post) => ({
                ...p,
                materials: fetchedMaterials.filter(
                    (material: any) => String(material.post_id) === String(p.id),
                ),
            }))

            const foundPost = postsWithMaterials.find(
                (p: Post) => p.id === parseInt(postId as string),
            )

            if (foundPost) {
                setPost(foundPost)
                setClassData({
                    ...classResponse,
                    posts: postsWithMaterials,
                })

                // Fetch user info for the post sender
                const userResponse = await profileService.getUserById(
                    foundPost.sender_id,
                )
                setUserInfo(userResponse.data)

                // Filter comments - posts where parent_id equals current post id
                const postComments = postsWithMaterials.filter(
                    (p: Post) => p.parent_id === foundPost.id,
                )
                setComments(postComments)
            }
        } catch (error) {
            console.error('Error fetching post data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [postId, classId])

    const handleSendComment = useCallback(async () => {
        if (!commentText.trim()) return

        if (!currentUserId) {
            showError('Chưa đăng nhập')
            return
        }

        if (!post) {
            showError('Không tìm thấy bài viết')
            return
        }

        try {
            setIsSubmitting(true)

            await classService.addNewPost({
                class_id: parseInt(classId as string),
                sender_id: currentUserId,
                message: commentText.trim(),
                parent_id: post.id,
                title: '',
            })

            // Clear input and refresh data
            setCommentText('')
            commentInputRef.current?.blur()

            // Refresh post data to get new comments
            await fetchPostData()
        } catch (error) {
            console.error('Error sending comment:', error)
            showError('Gửi bình luận thất bại. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }, [commentText, currentUserId, post, classId, fetchPostData])

    const handleBackPress = useCallback(() => {
        router.back()
    }, [router])

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60),
        )

        if (diffInHours < 24) {
            if (diffInHours < 1) return 'Just now'
            return `${diffInHours}h ago`
        }

        return date.toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
    }, [])

    const getUserDisplayName = useCallback(() => {
        if (!userInfo) return 'Unknown User'
        return userInfo.full_name || userInfo.email || 'Unknown User'
    }, [userInfo])

    const getAvatarText = useCallback(() => {
        const displayName = getUserDisplayName()
        if (displayName === 'Unknown User') return '?'
        return displayName.charAt(0).toUpperCase()
    }, [getUserDisplayName])

    const focusCommentInput = useCallback(() => {
        commentInputRef.current?.focus()
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        try {
            await fetchPostData()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } catch (error) {
            console.error('Error refreshing post:', error)
        } finally {
            setRefreshing(false)
        }
    }, [fetchPostData])

    return {
        // Refs
        commentInputRef,

        // State
        commentText,
        post,
        userInfo,
        classData,
        isLoading,
        comments,
        isSubmitting,
        refreshing,

        // Setters
        setCommentText,

        // Handlers
        handleSendComment,
        handleBackPress,
        formatDate,
        getUserDisplayName,
        getAvatarText,
        focusCommentInput,
        onRefresh,
    }
}
