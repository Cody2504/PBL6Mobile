import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authService } from '../../services/authService';
import { wp, hp, fs, hs, vs, getSafePadding, getFontSize, MIN_TOUCH_SIZE, isSmallDevice } from '../../utils/responsive';

interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Warning states
  const [emailWarning, setEmailWarning] = useState('');
  const [fullNameWarning, setFullNameWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState('');

  const handleRegister = async () => {
    // Reset warnings
    setEmailWarning('');
    setFullNameWarning('');
    setPasswordWarning('');
    setConfirmPasswordWarning('');

    let hasError = false;

    if (!email) {
      setEmailWarning('Please fill in your email');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailWarning('Please enter a valid email address');
      hasError = true;
    }

    if (!fullName) {
      setFullNameWarning('Please fill in your full name');
      hasError = true;
    } else if (fullName.length < 2) {
      setFullNameWarning('Full name must be at least 2 characters long');
      hasError = true;
    } else if (!isValidUsername(fullName)) {
      setFullNameWarning('Full name must contain only letters and numbers');
      hasError = true;
    }

    if (!password) {
      setPasswordWarning('Please fill in your password');
      hasError = true;
    } else if (password.length < 7 || password.length > 20) {
      setPasswordWarning('Password must be between 7-20 characters');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordWarning('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordWarning('Passwords do not match');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      const registerData: RegisterRequest = {
        email,
        fullName,
        password,
        confirmPassword,
        role: 'Guest',
      };

      const response = await authService.register(registerData);

      if (response.success) {
        Alert.alert('Success', 'Account created successfully! Please login.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Registration failed.');
      }

    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9\s]+$/;
    return usernameRegex.test(username);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailWarning('Please fill in your email');
    } else if (!isValidEmail(email)) {
      setEmailWarning('Please enter a valid email address');
    } else {
      setEmailWarning('');
    }
  };

  const handleFullNameBlur = () => {
    if (!fullName) {
      setFullNameWarning('Please fill in your full name');
    } else if (fullName.length < 2) {
      setFullNameWarning('Full name must be at least 2 characters long');
    } else if (!isValidUsername(fullName)) {
      setFullNameWarning('Full name must contain only letters and numbers');
    } else {
      setFullNameWarning('');
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordWarning('Please fill in your password');
    } else if (password.length < 7 || password.length > 20) {
      setPasswordWarning('Password must be between 7-20 characters');
    } else {
      setPasswordWarning('');
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordWarning('Please confirm your password');
    } else if (password !== confirmPassword) {
      setConfirmPasswordWarning('Passwords do not match');
    } else {
      setConfirmPasswordWarning('');
    }
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
          <View style={styles.registerCard}>
            <Text style={styles.title}>Create Account</Text>
            
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
                returnKeyType="next"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
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
  registerCard: {
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
    marginBottom: vs(24),
    lineHeight: getFontSize(28),
  },
  formGroup: {
    marginBottom: vs(16),
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
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  warningText: {
    fontSize: getFontSize(12),
    color: '#EF4444',
    marginTop: vs(4),
    marginLeft: hs(4),
    lineHeight: getFontSize(16),
  },
  registerButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: hs(8),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(16),
    marginTop: vs(8),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
    lineHeight: getFontSize(22),
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    minHeight: MIN_TOUCH_SIZE,
  },
  loginText: {
    fontSize: getFontSize(14),
    color: '#6B7280',
    lineHeight: getFontSize(20),
  },
  loginLink: {
    fontSize: getFontSize(14),
    color: '#3B82F6',
    fontWeight: '500',
    lineHeight: getFontSize(20),
    paddingVertical: vs(8),
    paddingHorizontal: hs(4),
  },
});