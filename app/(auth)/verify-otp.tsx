import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService, VerifyCodeRequest } from '../../services/authService';
import { wp, hp, fs, hs, vs, getSafePadding, getFontSize, MIN_TOUCH_SIZE } from '../../utils/responsive';

export default function VerifyOtp() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const verifyCodeData: VerifyCodeRequest = { email, code };
      const response = await authService.verifyCode(verifyCodeData);

      if (response.success && response.isValid) {
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/reset-password',
                params: { email, code }
              });
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Verify code error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    try {
      setLoading(true);
      const response = await authService.forgotPassword({ email });
      if (response.success) {
        setTimeLeft(300); // Reset timer
        Alert.alert('Success', 'Verification code resent to your email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                placeholderTextColor="#999"
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
              style={[styles.backButton, (timeLeft > 0 || loading) && styles.disabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.backButtonText, (timeLeft > 0 || loading) && styles.disabledText]}>
                Resend Code
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.back()}
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
  email: {
    fontWeight: '600',
    color: '#1F2937',
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
    fontSize: getFontSize(18),
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    letterSpacing: hs(4),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    textAlignVertical: 'center',
    lineHeight: getFontSize(24),
  },
  timerText: {
    fontSize: getFontSize(12),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: getFontSize(18),
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
    marginBottom: vs(8),
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: getFontSize(14),
    color: '#3B82F6',
    fontWeight: '500',
    lineHeight: getFontSize(20),
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});