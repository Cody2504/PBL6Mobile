import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useEditProfileScreen } from '../hooks/use-edit-profile-screen'
import { createStyles } from './EditProfileScreen.styles'
import { Colors } from '@/libs/constants/theme'

// Placeholder for the dropdown component icon
const DropdownIcon = ({ colorScheme }: { colorScheme: 'light' | 'dark' }) => {
  const styles = createStyles(colorScheme)
  return (
    <Ionicons
      name="chevron-down"
      size={20}
      color={Colors[colorScheme].icon}
      style={styles.dropdownIcon}
    />
  )
}

// Custom component for the input fields
interface CustomInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  icon?: React.ReactNode
  isDropdown?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  colorScheme: 'light' | 'dark'
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  isDropdown = false,
  keyboardType = 'default',
  colorScheme,
}) => {
  const styles = createStyles(colorScheme)
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
        {isDropdown && <DropdownIcon colorScheme={colorScheme} />}
      </View>
    </View>
  )
}

export default function EditProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

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
            <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
          <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Full Name */}
        <CustomInput
          label="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
          colorScheme={colorScheme}
        />

        {/* Email */}
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          colorScheme={colorScheme}
        />

        {/* Phone Number */}
        <CustomInput
          label="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          colorScheme={colorScheme}
        />

        {/* Address */}
        <CustomInput
          label="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          colorScheme={colorScheme}
        />

        {/* Date of Birth */}
        <CustomInput
          label="Ngày sinh"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          colorScheme={colorScheme}
        />

        {/* Gender */}
        <CustomInput
          label="Giới tính"
          value={gender}
          onChangeText={setGender}
          colorScheme={colorScheme}
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
            <Text style={styles.submitButtonText}>LƯU THAY ĐỔI</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
