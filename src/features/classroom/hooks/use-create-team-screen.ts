import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { classService } from '@/features/classroom'
import { useAuth } from '@/global/context'

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
    const [teamName, setTeamName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleDone = useCallback(async () => {
        if (teamName.trim() === '') {
            Alert.alert('Error', 'Please enter a team name')
            return
        }

        if (!user?.user_id) {
            Alert.alert('Error', 'User not authenticated')
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

            Alert.alert('Success', 'Team created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.push('/(tabs)/teams'),
                },
            ])
        } catch (error) {
            Alert.alert('Error', 'Failed to create team. Please try again.', [
                { text: 'OK' },
            ])
            console.error('Error creating team:', error)
        } finally {
            setIsLoading(false)
        }
    }, [teamName, description, user?.user_id, router])

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
