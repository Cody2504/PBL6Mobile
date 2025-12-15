/**
 * ColorSchemaExample Component
 *
 * This is a reference component demonstrating how to use the MSTeam color schema.
 * You can use this as a template for implementing consistent colors in your components.
 *
 * To view this component, import it in any screen and render it.
 */

import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Colors } from '@/libs/constants/theme'
import { useColorScheme } from '@/global/hooks/use-color-scheme'

export function ColorSchemaExample() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Color Schema Example</Text>
      <Text style={styles.subtitle}>Current theme: {colorScheme}</Text>

      {/* Brand Colors Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brand Colors</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: Colors[colorScheme].primary }]}>
            <Text style={styles.colorLabel}>Primary</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: Colors[colorScheme].primaryLight }]}>
            <Text style={styles.colorLabel}>Light</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: Colors[colorScheme].primaryDark }]}>
            <Text style={styles.colorLabelWhite}>Dark</Text>
          </View>
        </View>
      </View>

      {/* Text Hierarchy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Hierarchy</Text>
        <Text style={styles.primaryText}>Primary Text - Main headings and important content</Text>
        <Text style={styles.secondaryText}>Secondary Text - Body text and descriptions</Text>
        <Text style={styles.tertiaryText}>Tertiary Text - Captions, labels, metadata</Text>
        <Text style={styles.disabledText}>Disabled Text - Inactive or disabled state</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons</Text>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Primary Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Secondary Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledButtonText}>Disabled Button</Text>
        </TouchableOpacity>
      </View>

      {/* Semantic Colors Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semantic Colors</Text>

        <View style={styles.alertBox}>
          <View style={[styles.alert, { backgroundColor: Colors[colorScheme].success + '20', borderColor: Colors[colorScheme].success }]}>
            <Text style={{ color: Colors[colorScheme].success }}>Success: Operation completed successfully!</Text>
          </View>

          <View style={[styles.alert, { backgroundColor: Colors[colorScheme].warning + '20', borderColor: Colors[colorScheme].warning }]}>
            <Text style={{ color: Colors[colorScheme].warning }}>Warning: Please review this action.</Text>
          </View>

          <View style={[styles.alert, { backgroundColor: Colors[colorScheme].error + '20', borderColor: Colors[colorScheme].error }]}>
            <Text style={{ color: Colors[colorScheme].error }}>Error: Something went wrong.</Text>
          </View>

          <View style={[styles.alert, { backgroundColor: Colors[colorScheme].info + '20', borderColor: Colors[colorScheme].info }]}>
            <Text style={{ color: Colors[colorScheme].info }}>Info: Here's some helpful information.</Text>
          </View>
        </View>
      </View>

      {/* Surface & Cards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Surfaces & Cards</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Card Title</Text>
          <Text style={styles.cardDescription}>
            This is a card component using the surface color with proper borders and text hierarchy.
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Action</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input Fields</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.input}>
            <Text style={styles.placeholder}>Enter your email</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.input, styles.inputFocused]}>
            <Text style={styles.inputText}>••••••••</Text>
          </View>
          <Text style={styles.inputHelper}>Focused state with border highlight</Text>
        </View>
      </View>

      {/* Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        <Text style={styles.linkText}>This is a clickable link</Text>
        <Text style={styles.linkTextHover}>Link in hover state</Text>
      </View>

      {/* Dividers & Spacing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dividers</Text>
        <View style={styles.divider} />
        <Text style={styles.secondaryText}>Content above divider</Text>
        <View style={styles.divider} />
        <Text style={styles.secondaryText}>Content below divider</Text>
      </View>
    </ScrollView>
  )
}

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors[theme].text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors[theme].textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors[theme].text,
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorBox: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors[theme].border,
  },
  colorLabel: {
    color: Colors[theme].text,
    fontWeight: '600',
  },
  colorLabelWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors[theme].text,
    marginBottom: 8,
  },
  secondaryText: {
    fontSize: 16,
    color: Colors[theme].textSecondary,
    marginBottom: 8,
  },
  tertiaryText: {
    fontSize: 14,
    color: Colors[theme].textTertiary,
    marginBottom: 8,
  },
  disabledText: {
    fontSize: 14,
    color: Colors[theme].textDisabled,
  },
  primaryButton: {
    backgroundColor: Colors[theme].buttonPrimary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: Colors[theme].buttonPrimaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors[theme].buttonSecondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors[theme].buttonSecondaryBorder,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: Colors[theme].buttonSecondaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors[theme].buttonPrimaryDisabled,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButtonText: {
    color: Colors[theme].textDisabled,
    fontSize: 16,
    fontWeight: '600',
  },
  alertBox: {
    gap: 12,
  },
  alert: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  card: {
    backgroundColor: Colors[theme].surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[theme].border,
    shadowColor: Colors[theme].shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors[theme].text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors[theme].textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: Colors[theme].primary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors[theme].text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors[theme].inputBackground,
    borderWidth: 1,
    borderColor: Colors[theme].inputBorder,
    borderRadius: 8,
    padding: 12,
  },
  inputFocused: {
    borderColor: Colors[theme].borderFocus,
    borderWidth: 2,
  },
  placeholder: {
    color: Colors[theme].inputPlaceholder,
  },
  inputText: {
    color: Colors[theme].inputText,
  },
  inputHelper: {
    fontSize: 12,
    color: Colors[theme].textTertiary,
    marginTop: 4,
  },
  linkText: {
    fontSize: 16,
    color: Colors[theme].link,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  linkTextHover: {
    fontSize: 16,
    color: Colors[theme].linkHover,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: Colors[theme].divider,
    marginVertical: 12,
  },
})
