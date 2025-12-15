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
import { useEditProfileScreen } from '../hooks/use-edit-profile-screen'
import { styles } from './EditProfileScreen.styles'

// Placeholder for the dropdown component icon
const DropdownIcon = () => (
  <Ionicons
    name="chevron-down"
    size={20}
    color="#333"
    style={styles.dropdownIcon}
  />
)

// Custom component for the input fields
interface CustomInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  icon?: React.ReactNode
  isDropdown?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  isDropdown = false,
  keyboardType = 'default',
}) => {
  return (
    <View
      style={[styles.inputContainer, isDropdown && styles.dropdownContainer]}
    >
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
  )
}

export default function EditProfileScreen() {
  const {
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
  } = useEditProfileScreen()

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8C00" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={styles.headerSpacer} />
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
        <CustomInput label="Gender" value={gender} onChangeText={setGender} />

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
  )
}
