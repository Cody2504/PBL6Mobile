import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService, ForgotPasswordRequest } from '../../services/authService';
import { wp, hp, fs, hs, vs, getSafePadding, getFontSize, MIN_TOUCH_SIZE } from '../../utils/responsive';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const forgotPasswordData: ForgotPasswordRequest = { email };
      const response = await authService.forgotPassword(forgotPasswordData);

      if (response.success) {
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/verify-otp',
                params: { email }
              });
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
              Enter your email address and we'll send you a verification code to reset your password.
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
                placeholderTextColor="#999"
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
              onPress={() => router.back()}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: getSafePadding(),
    paddingVertical: vs(20),
    minHeight: hp(100),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hs(16),
    paddingHorizontal: getSafePadding(),
    paddingVertical: vs(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: vs(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: hs(8),
    elevation: 5,
    width: '100%',
    maxWidth: wp(90),
    alignSelf: 'center',
  },
  title: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: vs(12),
    lineHeight: getFontSize(28),
  },
  subtitle: {
    fontSize: getFontSize(14),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: getFontSize(20),
    paddingHorizontal: hs(8),
  },
  formGroup: {
    marginBottom: vs(24),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#374151',
    marginBottom: vs(8),
    lineHeight: getFontSize(20),
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: hs(8),
    paddingHorizontal: hs(16),
    paddingVertical: vs(12),
    fontSize: getFontSize(16),
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    textAlignVertical: 'center',
    lineHeight: getFontSize(22),
  },
  button: {
    backgroundColor: '#1E3A8A',
    borderRadius: hs(8),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(16),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
    lineHeight: getFontSize(22),
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: vs(12),
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: getFontSize(14),
    color: '#3B82F6',
    fontWeight: '500',
    lineHeight: getFontSize(20),
  },
});