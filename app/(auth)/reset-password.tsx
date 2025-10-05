import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { authService, ResetPasswordRequest } from '../../services/authService';

interface PasswordHint {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { code } = useLocalSearchParams<{ code: string }>();

  const passwordHints: PasswordHint[] = [
    {
      id: 'length',
      text: '≥7 characters',
      validator: (password) => password.length >= 7,
    },
    {
      id: 'uppercase',
      text: '1 Uppercase letter',
      validator: (password) => /[A-Z]/.test(password),
    },
    {
      id: 'number',
      text: '1 Number',
      validator: (password) => /\d/.test(password),
    },
    {
      id: 'special',
      text: '1 Special character',
      validator: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const getHintStatus = (hint: PasswordHint) => {
    return hint.validator(newPassword);
  };

  const allHintsSatisfied = passwordHints.every(hint => getHintStatus(hint));
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSubmit = allHintsSatisfied && passwordsMatch;

  const handleSetPassword = async () => {

  setIsLoading(true);

  try {
    const resetPasswordData: ResetPasswordRequest = {
      email: email, 
      code: code,
      password: newPassword,
      confirmPassword: confirmPassword
    };
    console.log(resetPasswordData);
    const response = await authService.resetPassword(resetPasswordData);

    if (response.success) {
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully reset. You can now login with your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } else {
      Alert.alert('Error', response.message);
    }
  } catch (error) {
    console.error('Reset password error:', error);
    Alert.alert('Error', 'Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Set a New Password</Text>
        <Text style={styles.subtitle}>
          Create a strong password for your account
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={[
              styles.input,
              confirmPassword && !passwordsMatch && styles.inputError
            ]}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          {confirmPassword && !passwordsMatch && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>

        <View style={styles.hintsContainer}>
          <Text style={styles.hintsTitle}>Password Requirements:</Text>
          {passwordHints.map((hint) => {
            const isValid = getHintStatus(hint);
            return (
              <View key={hint.id} style={styles.hintItem}>
                <View style={[
                  styles.hintIcon,
                  isValid && styles.hintIconValid
                ]}>
                  {isValid && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[
                  styles.hintText,
                  isValid && styles.hintTextValid
                ]}>
                  {hint.text}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.setPasswordButton,
            (!canSubmit || isLoading) && styles.setPasswordButtonDisabled
          ]}
          onPress={handleSetPassword}
          disabled={!canSubmit || isLoading}
        >
          <Text style={styles.setPasswordButtonText}>
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  hintsContainer: {
    marginBottom: 24,
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIconValid: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
  },
  hintTextValid: {
    color: '#10B981',
  },
  setPasswordButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  setPasswordButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  setPasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});