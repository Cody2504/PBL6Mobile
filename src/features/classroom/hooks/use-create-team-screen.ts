import { useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { classService } from '@/features/classroom'
import { useAuth, useToast } from '@/global/context'

// Function to generate 6-character class code
const generateClassCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export function useCreateTeamScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { showSuccess, showError, showWarning } = useToast()
    const [teamName, setTeamName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleDone = useCallback(async () => {
        if (teamName.trim() === '') {
            showWarning('Vui lòng nhập tên lớp học')
            return
        }

        if (!user?.user_id) {
            showError('Người dùng chưa xác thực')
            return
        }

        setIsLoading(true)

        try {
            // Generate class code
            const classCode = generateClassCode()

            // Create the class via API
            await classService.createClass({
                class_name: teamName.trim(),
                description: description.trim() || undefined,
                class_code: classCode,
                teacher_id: Number(user.user_id),
            })

            showSuccess('Tạo lớp học thành công!')
            router.push('/(tabs)/teams')
        } catch (error) {
            showError('Tạo lớp học thất bại. Vui lòng thử lại.')
            console.error('Error creating team:', error)
        } finally {
            setIsLoading(false)
        }
    }, [teamName, description, user?.user_id, router, showSuccess, showError, showWarning])

    return {
        // State
        teamName,
        description,
        isLoading,

        // Setters
        setTeamName,
        setDescription,

        // Handlers
        handleBack,
        handleDone,
    }
}
