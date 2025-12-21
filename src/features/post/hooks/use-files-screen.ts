import { useState, useEffect, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
    classService,
    Material as BackendMaterial,
} from '@/features/classroom'
import { batchGetUserInfo } from '@/libs/utils'
import {
    formatFileSize,
    formatRelativeTime,
    getFileExtension,
    getFilenameFromUrl,
} from '@/libs/utils'
import { useToast } from '@/global/context'

export interface Material {
    id: number
    name: string
    size: string
    type: string
    uploadedBy: string
    uploadedAt: string
    url?: string
}

export function useFilesScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { showError } = useToast()

    const [materials, setMaterials] = useState<Material[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [className, setClassName] = useState<string>('')
    const [userInfoMap, setUserInfoMap] = useState<Map<number, any>>(new Map())

    useEffect(() => {
        fetchMaterials()
    }, [params.classId])

    const transformMaterial = useCallback((material: BackendMaterial): Material => {
        const fileName = getFilenameFromUrl(material.file_url) || material.title
        const fileExtension = getFileExtension(fileName)
        const userInfo = userInfoMap.get(material.uploaded_by)

        return {
            id: material.material_id,
            name: fileName,
            size: formatFileSize(material.file_size),
            type: fileExtension,
            uploadedBy: userInfo?.full_name || `User ${material.uploaded_by}`,
            uploadedAt: formatRelativeTime(material.uploaded_at),
            url: material.file_url,
        }
    }, [userInfoMap])

    const fetchMaterials = useCallback(async () => {
        try {
            setIsLoading(true)

            // Fetch class data to get className
            const classResponse = await classService.getClassById(
                params.classId as string,
            )
            setClassName(classResponse.class_name)

            // Fetch materials
            const materialsData = await classService.getMaterials(
                params.classId as string,
            )

            if (materialsData.length === 0) {
                setMaterials([])
                return
            }

            // Extract unique uploader IDs
            const uploaderIds = [...new Set(materialsData.map((m) => m.uploaded_by))]

            // Batch fetch user info
            const userInfoResults = await batchGetUserInfo(uploaderIds)
            setUserInfoMap(userInfoResults)

            // Transform materials to UI format
            const transformedMaterials = materialsData.map((material: BackendMaterial) => {
                const fileName = getFilenameFromUrl(material.file_url) || material.title
                const fileExtension = getFileExtension(fileName)
                const userInfo = userInfoResults.get(material.uploaded_by)

                return {
                    id: material.material_id,
                    name: fileName,
                    size: formatFileSize(material.file_size),
                    type: fileExtension,
                    uploadedBy: userInfo?.full_name || `User ${material.uploaded_by}`,
                    uploadedAt: formatRelativeTime(material.uploaded_at),
                    url: material.file_url,
                }
            })
            setMaterials(transformedMaterials)
        } catch (error) {
            console.error('Error fetching materials:', error)
            showError('Tải tài liệu thất bại')
            setMaterials([])
        } finally {
            setIsLoading(false)
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

    const navigateToPostsTab = useCallback(() => {
        router.push({
            pathname: '/(post)/post-screen',
            params: {
                classId: params.classId,
                classroomName: params.classroomName,
            },
        })
    }, [router, params.classId, params.classroomName])

    const navigateToOtherTab = useCallback(() => {
        router.push({
            pathname: '/(post)/other-screen',
            params: {
                classId: params.classId,
                classroomName: params.classroomName,
            },
        })
    }, [router, params.classId, params.classroomName])

    const getFileIcon = useCallback((type: string) => {
        const lowerType = type.toLowerCase()

        // Documents
        if (lowerType === 'pdf') return 'file-pdf-box'
        if (['doc', 'docx'].includes(lowerType)) return 'file-word-box'
        if (['xls', 'xlsx'].includes(lowerType)) return 'file-excel-box'
        if (['ppt', 'pptx'].includes(lowerType)) return 'file-powerpoint-box'

        // Images
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(lowerType))
            return 'file-image'

        // Videos
        if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(lowerType))
            return 'file-video'

        // Audio
        if (['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg'].includes(lowerType))
            return 'file-music'

        // Archives
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(lowerType))
            return 'folder-zip'

        // Code files
        if (
            ['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(lowerType)
        )
            return 'file-code'

        // Default
        return 'file-document'
    }, [])

    return {
        // Params
        params,

        // State
        materials,
        isLoading,
        className,

        // Handlers
        handleBackPress,
        handleGroupNamePress,
        navigateToPostsTab,
        navigateToOtherTab,
        getFileIcon,
    }
}
