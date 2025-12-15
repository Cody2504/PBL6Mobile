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
import { useVerifyOtpScreen } from '../hooks/use-verify-otp-screen'
import { createStyles } from './VerifyOtpScreen.styles'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { Colors } from '@/libs/constants/theme'

export default function VerifyOtp() {
  const {
    email,
    code,
    loading,
    timeLeft,
    setCode,
    handleVerifyCode,
    handleResendCode,
    handleBack,
    formatTime,
  } = useVerifyOtpScreen()
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
            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
                placeholderTextColor={Colors[colorScheme].textPlaceholder}
                returnKeyType="done"
                onSubmitEditing={handleVerifyCode}
              />
            </View>

            {timeLeft > 0 && (
              <Text style={styles.timerText}>
                Code expires in: {formatTime(timeLeft)}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResendCode}
              disabled={loading || timeLeft > 0}
              style={[
                styles.backButton,
                (timeLeft > 0 || loading) && styles.disabled,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.backButtonText,
                  (timeLeft > 0 || loading) && styles.disabledText,
                ]}
              >
                Resend Code
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
