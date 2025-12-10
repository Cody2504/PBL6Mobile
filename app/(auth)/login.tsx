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
import { Link, useRouter } from 'expo-router';
import { authService, LoginRequest } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp, fs, hs, vs, getSafePadding, getFontSize, MIN_TOUCH_SIZE, isSmallDevice } from '../../utils/responsive';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const loginData: LoginRequest = { email, password };
      const response = await authService.login(loginData);

      // Check if the response is successful and has the expected structure
      if (response.success && response.data?.success && response.data.accessToken && response.data.user) {
        // Store remember me preference
        if (rememberMe) {
          await AsyncStorage.setItem('rememberMe', 'true');
          await AsyncStorage.setItem('savedEmail', email);
        } else {
          await AsyncStorage.removeItem('rememberMe');
          await AsyncStorage.removeItem('savedEmail');
        }

        const userData = {
          id: response.data.user.user_id.toString(),
          email: response.data.user.email,
          name: response.data.user.full_name,
          phone: response.data.user.phone,
          address: response.data.user.address,
          dateOfBirth: response.data.user.dateOfBirth,
          gender: response.data.user.gender,
          avatar: response.data.user.avatar,
          role: response.data.user.role,
          status: response.data.user.status,
        };

      // Use auth context to handle login
      await login(userData, response.data.accessToken, response.data.refreshToken);

        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
      } else {
        Alert.alert('Login Failed', response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  // Load saved email if remember me was enabled
  React.useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const rememberMeEnabled = await AsyncStorage.getItem('rememberMe');
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        
        if (rememberMeEnabled === 'true' && savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    };

    loadSavedCredentials();
  }, []);

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
          <View style={styles.loginCard}>
            <Text style={styles.title}>Login to Account</Text>
            
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
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </TouchableOpacity>
              
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity disabled={loading} activeOpacity={0.7}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity onPress={handleSignUp} disabled={loading} activeOpacity={0.7}>
                  <Text style={styles.signupLink}>Sign up now</Text>
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
  loginCard: {
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(24),
    minHeight: MIN_TOUCH_SIZE,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: vs(8),
  },
  checkbox: {
    width: hs(18),
    height: hs(18),
    borderRadius: hs(3),
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: hs(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: getFontSize(14),
    color: '#374151',
    lineHeight: getFontSize(20),
    flexShrink: 1,
  },
  forgotPassword: {
    fontSize: getFontSize(14),
    color: '#3B82F6',
    fontWeight: '500',
    lineHeight: getFontSize(20),
    paddingVertical: vs(8),
    paddingHorizontal: hs(4),
  },
  loginButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: hs(8),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(16),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
    lineHeight: getFontSize(22),
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    minHeight: MIN_TOUCH_SIZE,
  },
  signupText: {
    fontSize: getFontSize(14),
    color: '#6B7280',
    lineHeight: getFontSize(20),
  },
  signupLink: {
    fontSize: getFontSize(14),
    color: '#10B981',
    fontWeight: '500',
    lineHeight: getFontSize(20),
    paddingVertical: vs(8),
    paddingHorizontal: hs(4),
  },
});