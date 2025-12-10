import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { profileService, ChangePasswordRequest } from '../../services/profileService';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [logoutOtherDevices, setLogoutOtherDevices] = useState(false);

    const validateForm = () => {
        if (!currentPassword.trim()) {
            Alert.alert('Validation Error', 'Please enter your current password');
            return false;
        }

        if (!newPassword.trim()) {
            Alert.alert('Validation Error', 'Please enter a new password');
            return false;
        }

        if (newPassword.length < 6) {
            Alert.alert('Validation Error', 'New password must be at least 6 characters long');
            return false;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Validation Error', 'New passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const changePasswordData: ChangePasswordRequest = {
                currentPassword,
                newPassword,
                confirmPassword: confirmNewPassword,
            };

            const response = await profileService.changePassword(changePasswordData);

            if (response.success) {
                Alert.alert(
                    'Success', 
                    'Password changed successfully', 
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Clear form
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                                router.back();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', response.message || 'Failed to change password');
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            Alert.alert('Error', 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleForgotPassword = () => {
        // Navigate to forgot password screen or show instructions
        router.push('/(auth)/forgot-password');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Title */}
                <Text style={styles.title}>Change Password</Text>

                {/* Instructions */}
                <Text style={styles.instructions}>
                    Your password must be at least 6 characters, including numbers, letters, and special characters (! $@ %).
                </Text>

                {/* Current Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Current password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholderTextColor="#666"
                    editable={!loading}
                />

                {/* New Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="New password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#666"
                    editable={!loading}
                />

                {/* Confirm New Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Re-enter new password"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholderTextColor="#666"
                    editable={!loading}
                />

                {/* Forgot Password Link */}
                <TouchableOpacity 
                    style={styles.forgotPasswordButton} 
                    onPress={handleForgotPassword}
                    disabled={loading}
                >
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Checkbox Option */}
                <View style={styles.checkboxRow}>
                    <TouchableOpacity 
                        style={styles.checkbox} 
                        onPress={() => !loading && setLogoutOtherDevices(!logoutOtherDevices)}
                        disabled={loading}
                    >
                        <Ionicons 
                            name={logoutOtherDevices ? "checkbox" : "square-outline"} 
                            size={24} 
                            color={logoutOtherDevices ? '#1877F2' : '#ccc'} 
                        />
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                        Log out of other devices. Select this option if someone else has used your account.
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                    style={[
                        styles.submitButton, 
                        loading ? styles.submitButtonDisabled : styles.facebookBlue
                    ]} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Change Password</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: '#333',
        marginBottom: 30,
        lineHeight: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#f7f7f7',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 15,
        color: '#1877F2',
        fontWeight: '600',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    checkbox: {
        marginRight: 10,
        paddingTop: 2,
    },
    checkboxText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    submitButton: {
        borderRadius: 6,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7F3FF',
    },
    facebookBlue: {
        backgroundColor: '#1877F2',
    },
    submitButtonDisabled: {
        backgroundColor: '#B0C4DE',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});