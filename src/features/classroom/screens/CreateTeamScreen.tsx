import React from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCreateTeamScreen } from '../hooks/use-create-team-screen'
import { createStyles } from './CreateTeamScreen.styles'
import { Colors } from '@/libs/constants/theme'

export default function CreateTeamScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const insets = useSafeAreaInsets()
  const {
    // State
    teamName,
    description,
    isLoading,

    // Setters
    setTeamName,
    setDescription,

    // Handlers
    handleBack,
    handleDone,
  } = useCreateTeamScreen()

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
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
            Teachers are owners of class teams and students participate as
            members. Each class team includes a Class Notebook.
          </Text>
          <Text style={styles.codeInfo}>
            A 6-character class code will be automatically generated for easy
            sharing.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
