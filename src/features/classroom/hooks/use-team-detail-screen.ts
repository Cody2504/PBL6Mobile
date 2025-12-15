import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { useAuth } from '@/global/context'

export interface TeamDetail {
    class_id: string
    class_name: string
    description: string
    class_code: string
    teacher_id: string
}

export function useTeamDetailScreen() {
    const navigation = useNavigation()
    const router = useRouter()
    const params = useLocalSearchParams()
    const { user, isTeacher } = useAuth()

    const [teamData, setTeamData] = useState<TeamDetail>({
        class_id: params.classId as string,
        class_name: params.className as string,
        description: params.description as string,
        class_code: params.classCode as string,
        teacher_id: params.teacherId as string,
    })

    const [isEditModalVisible, setIsEditModalVisible] = useState(false)

    // Check if current user is the teacher of this team
    const isTeamOwner = isTeacher() && user?.user_id.toString() === teamData.teacher_id

    useEffect(() => {
        if (params.teamId) {
            setTeamData({
                class_id: params.classId as string,
                class_name: params.className as string,
                description: params.description as string,
                class_code: params.classCode as string,
                teacher_id: params.teacherId as string,
            })
        }
    }, [params])

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const handleEditPress = useCallback(() => {
        console.log('Edit button pressed, opening modal')
        setIsEditModalVisible(true)
    }, [])

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalVisible(false)
    }, [])

    const handleEditSuccess = useCallback((updatedData: {
        class_id: string
        class_name: string
        description: string
        class_code: string
    }) => {
        setTeamData({
            ...teamData,
            ...updatedData,
        })
    }, [teamData])

    const handleAddStudents = useCallback(() => {
        router.push({
            pathname: '/(group)/add-members',
            params: {
                teamName: teamData.class_name,
                classId: teamData.class_id,
            },
        })
    }, [router, teamData])

    const handleCopyEmail = useCallback(async () => {
        try {
            // Generate team email format: classname-classcode@team.com
            const teamEmail = `${teamData.class_name.toLowerCase().replace(/\s+/g, '-')}-${teamData.class_code}@team.com`
            await Clipboard.setStringAsync(teamEmail)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            Alert.alert('Đã sao chép', 'Địa chỉ email đã được sao chép vào clipboard')
        } catch (error) {
            console.error('Error copying email:', error)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Alert.alert('Lỗi', 'Không thể sao chép email')
        }
    }, [teamData])

    const handleCopyLink = useCallback(async () => {
        try {
            // Generate deep link to team channel
            const teamLink = `msteam://team/${teamData.class_id}/channel/general`
            await Clipboard.setStringAsync(teamLink)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            Alert.alert('Đã sao chép', 'Liên kết kênh đã được sao chép vào clipboard')
        } catch (error) {
            console.error('Error copying link:', error)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Alert.alert('Lỗi', 'Không thể sao chép liên kết')
        }
    }, [teamData])

    return {
        // State
        teamData,
        isEditModalVisible,
        isTeamOwner,

        // Handlers
        handleBackPress,
        handleEditPress,
        handleCloseEditModal,
        handleEditSuccess,
        handleAddStudents,
        handleCopyEmail,
        handleCopyLink,
    }
}
