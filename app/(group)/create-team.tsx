import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { classService } from '../../services/classService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

// Function to generate 6-character class code
const generateClassCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function CreateTeamScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDone = async () => {
    if (teamName.trim() === '') {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate class code
      const classCode = generateClassCode();
      
      // Create the class via API
      const newClass = await classService.createClass({
        class_name: teamName.trim(),
        description: description.trim() || undefined,
        class_code: classCode,
        teacher_id: Number(user.id),
      });

      Alert.alert(
        'Success', 
        'Team created successfully!',
        [{ 
          text: 'OK',
          onPress: () => router.push('/(tabs)/teams')
        }]
      );
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to create team. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom + 10
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#0078d4" />
        </Pressable>
        <Text style={styles.headerTitle}>Create team</Text>
        <Pressable 
          onPress={handleDone} 
          style={[styles.doneButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0078d4" />
          ) : (
            <Text style={styles.doneText}>Done</Text>
          )}
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Team name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Letters, numbers and spaces are allowed"
            value={teamName}
            onChangeText={setTeamName}
            maxLength={50}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="This will help people find your team"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
            editable={!isLoading}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Teachers are owners of class teams and students participate as members. Each class team includes a Class Notebook.
          </Text>
          <Text style={styles.codeInfo}>
            A 6-character class code will be automatically generated for easy sharing.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  doneButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  doneText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  descriptionInput: {
    minHeight: 60,
  },
  infoSection: {
    marginTop: 32,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  codeInfo: {
    fontSize: 14,
    color: '#0078d4',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});