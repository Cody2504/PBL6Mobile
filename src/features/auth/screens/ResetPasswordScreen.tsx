import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native'
import { vs } from '@/libs/utils'
import { useResetPasswordScreen } from '../hooks/use-reset-password-screen'
import { createStyles } from './ResetPasswordScreen.styles'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { Colors } from '@/libs/constants/theme'

export default function ResetPassword() {
  const {
    password,
    confirmPassword,
    loading,
    setPassword,
    setConfirmPassword,
    handleResetPassword,
    handleBack,
  } = useResetPasswordScreen()
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : vs(20)}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your new password below</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                placeholderTextColor={Colors[colorScheme].textPlaceholder}
                returnKeyType="next"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                placeholderTextColor={Colors[colorScheme].textPlaceholder}
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBack}
              disabled={loading}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
