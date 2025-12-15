import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useChangePasswordScreen } from '../hooks/use-change-password-screen'
import { styles } from './ChangePasswordScreen.styles'

export default function ChangePasswordScreen() {
  const {
    // State
    loading,
    currentPassword,
    newPassword,
    confirmNewPassword,
    logoutOtherDevices,

    // Setters
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,

    // Handlers
    handleSubmit,
    handleBack,
    handleForgotPassword,
    toggleLogoutOtherDevices,
  } = useChangePasswordScreen()

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
          Your password must be at least 6 characters, including numbers,
          letters, and special characters (! $@ %).
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
            onPress={toggleLogoutOtherDevices}
            disabled={loading}
          >
            <Ionicons
              name={logoutOtherDevices ? 'checkbox' : 'square-outline'}
              size={24}
              color={logoutOtherDevices ? '#1877F2' : '#ccc'}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Log out of other devices. Select this option if someone else has
            used your account.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            loading ? styles.submitButtonDisabled : styles.facebookBlue,
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
  )
}
