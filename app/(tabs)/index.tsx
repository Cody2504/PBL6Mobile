import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Demo</Text>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/forgot-password" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Forgot Password</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/verify-otp" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>OTP Verification</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/reset-password" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
