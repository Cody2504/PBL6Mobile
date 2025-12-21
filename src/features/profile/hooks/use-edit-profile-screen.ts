import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { profileService } from '../api'
import type { UpdateProfileRequest } from '../types'
import { useProfileCache, useToast } from '@/global/context'

export function useEditProfileScreen() {
    const router = useRouter()
    const { showSuccess, showError } = useToast()
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
                showError(response.message || 'Không thể tải thông tin hồ sơ')
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            showError('Không thể tải thông tin hồ sơ')
        } finally {
            setLoading(false)
        }
    }, [setCachedProfile, showError])

    const handleSubmit = useCallback(async () => {
        try {
            setSaving(true)

            // Build update data, only including non-empty values
            const updateData: UpdateProfileRequest = {}

            if (fullName?.trim()) updateData.fullName = fullName.trim()
            if (phoneNumber?.trim()) updateData.phone = phoneNumber.trim()
            if (address?.trim()) updateData.address = address.trim()
            if (dateOfBirth?.trim()) updateData.dateOfBirth = dateOfBirth.trim()
            if (gender?.trim()) updateData.gender = gender.trim()

            console.log('Updating profile with data:', updateData)

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

                showSuccess('Cập nhật hồ sơ thành công')
                router.back()
            } else {
                showError(response.message || 'Không thể cập nhật hồ sơ')
            }
        } catch (error: any) {
            console.error('Error updating profile:', error)
            showError('Không thể cập nhật hồ sơ')
        } finally {
            setSaving(false)
        }
    }, [fullName, email, phoneNumber, address, dateOfBirth, gender, router, cachedProfile, setCachedProfile, showSuccess, showError])

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
