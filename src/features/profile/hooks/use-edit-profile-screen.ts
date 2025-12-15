import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { UpdateProfileRequest } from '../types'

export function useEditProfileScreen() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [gender, setGender] = useState('')

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true)
            const response = await profileService.getProfile()
            if (response.success) {
                const profile = response.data
                setFullName(profile.full_name || '')
                setEmail(profile.email || '')
                setPhoneNumber(profile.phone || '')
                setAddress(profile.address || '')
                setDateOfBirth(profile.dateOfBirth || '')
                setGender(profile.gender || '')
            } else {
                Alert.alert('Error', response.message || 'Failed to fetch profile')
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            Alert.alert('Error', 'Failed to load profile information')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            setSaving(true)

            const updateData: UpdateProfileRequest = {
                fullName: fullName,
                email: email,
                phone: phoneNumber,
                address: address,
                dateOfBirth: dateOfBirth,
                gender: gender,
            }

            const response = await profileService.updateProfile(updateData)

            if (response.success) {
                Alert.alert('Success', 'Profile updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ])
            } else {
                Alert.alert('Error', response.message || 'Failed to update profile')
            }
        } catch (error: any) {
            console.error('Error updating profile:', error)
            Alert.alert('Error', 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }, [fullName, email, phoneNumber, address, dateOfBirth, gender, router])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    return {
        // State
        loading,
        saving,
        fullName,
        email,
        phoneNumber,
        address,
        dateOfBirth,
        gender,

        // Setters
        setFullName,
        setEmail,
        setPhoneNumber,
        setAddress,
        setDateOfBirth,
        setGender,

        // Handlers
        handleSubmit,
        handleBack,
    }
}
