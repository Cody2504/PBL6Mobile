import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Link } from 'expo-router'
import { vs } from '@/libs/utils'
import { useRegisterScreen } from '../hooks/use-register-screen'
import { styles } from './RegisterScreen.styles'

export default function Register() {
  const {
    email,
    fullName,
    password,
    confirmPassword,
    loading,
    emailWarning,
    fullNameWarning,
    passwordWarning,
    confirmPasswordWarning,
    setEmail,
    setFullName,
    setPassword,
    setConfirmPassword,
    handleRegister,
    handleEmailBlur,
    handleFullNameBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
  } = useRegisterScreen()

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
          <View style={styles.registerCard}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailWarning ? styles.inputError : null]}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="next"
              />
              {emailWarning ? (
                <Text style={styles.warningText}>{emailWarning}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  fullNameWarning ? styles.inputError : null,
                ]}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                onBlur={handleFullNameBlur}
                autoCapitalize="words"
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="next"
              />
              {fullNameWarning ? (
                <Text style={styles.warningText}>{fullNameWarning}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  passwordWarning ? styles.inputError : null,
                ]}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                onBlur={handlePasswordBlur}
                secureTextEntry
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="next"
              />
              {passwordWarning ? (
                <Text style={styles.warningText}>{passwordWarning}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPasswordWarning ? styles.inputError : null,
                ]}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={handleConfirmPasswordBlur}
                secureTextEntry
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              {confirmPasswordWarning ? (
                <Text style={styles.warningText}>{confirmPasswordWarning}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity disabled={loading} activeOpacity={0.7}>
                  <Text style={styles.loginLink}>Login here</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
