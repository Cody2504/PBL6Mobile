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
import { useForgotPasswordScreen } from '../hooks/use-forgot-password-screen'
import { createStyles } from './ForgotPasswordScreen.styles'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { Colors } from '@/libs/constants/theme'

export default function ForgotPassword() {
  const { email, loading, setEmail, handleForgotPassword, handleBackToLogin } =
    useForgotPasswordScreen()
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a verification code to
              reset your password.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors[colorScheme].textPlaceholder}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleForgotPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleForgotPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBackToLogin}
              disabled={loading}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
