import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { profileService, UpdateProfileRequest } from '../../services/profileService';

// Placeholder for the dropdown component icon
const DropdownIcon = () => (
    <Ionicons name="chevron-down" size={20} color="#333" style={styles.dropdownIcon} />
);

// Custom component for the input fields
interface CustomInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
    isDropdown?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const CustomInput: React.FC<CustomInputProps> = ({ label, value, onChangeText, icon, isDropdown = false, keyboardType = 'default' }) => {
    return (
        <View style={[styles.inputContainer, isDropdown && styles.dropdownContainer]}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputContent}>
                {icon && icon}
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    editable={!isDropdown}
                />
                {isDropdown && <DropdownIcon />}
            </View>
        </View>
    );
};

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            if (response.success) {
                const profile = response.data;
                setFullName(profile.full_name || '');
                setEmail(profile.email || '');
                setPhoneNumber(profile.phone || '');
                setAddress(profile.address || '');
                setDateOfBirth(profile.dateOfBirth || '');
                setGender(profile.gender || '');
            } else {
                Alert.alert('Error', response.message || 'Failed to fetch profile');
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile information');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            const updateData: UpdateProfileRequest = {
                fullName: fullName,
                email: email,
                phone: phoneNumber,
                address: address,
                dateOfBirth: dateOfBirth,
                gender: gender,
            };

            const response = await profileService.updateProfile(updateData);
            
            if (response.success) {
                Alert.alert('Success', 'Profile updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]);
            } else {
                Alert.alert('Error', response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit profile</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF8C00" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit profile</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <ScrollView contentContainerStyle={styles.content}>
                {/* Full Name */}
                <CustomInput
                    label="Full name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                {/* Email */}
                <CustomInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                {/* Phone Number */}
                <CustomInput
                    label="Phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />

                {/* Address */}
                <CustomInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                />

                {/* Date of Birth */}
                <CustomInput
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                />

                {/* Gender */}
                <CustomInput
                    label="Gender"
                    value={gender}
                    onChangeText={setGender}
                />

                {/* Submit Button */}
                <TouchableOpacity 
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const INPUT_BACKGROUND = '#FFFFFF';
const BORDER_COLOR = '#FF9900';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    content: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
        backgroundColor: INPUT_BACKGROUND,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    dropdownContainer: {
        paddingBottom: 5,
    },
    inputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 0,
    },
    countryFlag: {
        fontSize: 20,
        marginRight: 10,
    },
    dropdownIcon: {
        marginLeft: 5,
        opacity: 0.6,
    },
    inlineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    inlineItem: {
        flex: 1,
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#FF8C00',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, 
        shadowColor: '#FF8C00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#FFB366',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});