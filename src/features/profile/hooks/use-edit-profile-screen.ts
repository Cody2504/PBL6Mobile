import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { UpdateProfileRequest } from '../types'
import { useProfileCache } from '@/global/context'

export function useEditProfileScreen() {
    const router = useRouter()
    const { cachedProfile, setCachedProfile, isCacheValid } = useProfileCache()
    const [loading, setLoading] = useState(!isCacheValid)
    const [saving, setSaving] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [gender, setGender] = useState('')

    // Fetch user profile data on component mount
    useEffect(() => {
        // If cache is valid, use it immediately
        if (isCacheValid && cachedProfile) {
            setFullName(cachedProfile.full_name || '')
            setEmail(cachedProfile.email || '')
            setPhoneNumber(cachedProfile.phone || '')
            setAddress(cachedProfile.address || '')
            setDateOfBirth(cachedProfile.dateOfBirth || '')
            setGender(cachedProfile.gender || '')
            setLoading(false)
            return
        }

        // Otherwise, fetch fresh data
        fetchUserProfile()
    }, [isCacheValid, cachedProfile])

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
                setCachedProfile(profile) // Update cache
            } else {
                Alert.alert('Lỗi', response.message || 'Không thể tải thông tin hồ sơ')
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ')
        } finally {
            setLoading(false)
        }
    }, [setCachedProfile])

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
                // Update cache with new data
                const updatedProfile = {
                    ...cachedProfile,
                    full_name: fullName,
                    email: email,
                    phone: phoneNumber,
                    address: address,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                }
                setCachedProfile(updatedProfile as any)

                Alert.alert('Thành công', 'Cập nhật hồ sơ thành công', [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ])
            } else {
                Alert.alert('Lỗi', response.message || 'Không thể cập nhật hồ sơ')
            }
        } catch (error: any) {
            console.error('Error updating profile:', error)
            Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ')
        } finally {
            setSaving(false)
        }
    }, [fullName, email, phoneNumber, address, dateOfBirth, gender, router, cachedProfile, setCachedProfile])

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
