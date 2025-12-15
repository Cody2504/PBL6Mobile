import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useProfileScreen, ProfileOption } from '../hooks/use-profile-screen'
import { styles } from './ProfileScreen.styles'

// Custom component for the profile option rows
const OptionRow: React.FC<{ option: ProfileOption }> = ({ option }) => (
  <TouchableOpacity
    key={option.title}
    style={styles.optionRow}
    onPress={option.onPress}
  >
    <View style={styles.optionLeft}>
      <Ionicons
        name={
          option.title === 'Edit profile information'
            ? 'document-text-outline'
            : option.title === 'Security'
              ? 'lock-closed-outline'
              : option.title === 'Theme'
                ? 'bulb-outline'
                : option.title === 'Help & Support'
                  ? 'person-circle-outline'
                  : option.title === 'Contact us'
                    ? 'chatbubble-outline'
                    : option.title === 'Privacy policy'
                      ? 'lock-closed-outline'
                      : option.title === 'Logout'
                        ? 'log-out-outline'
                        : (option.icon as any)
        }
        size={24}
        color={option.title === 'Logout' ? '#FF3B30' : '#333'}
      />
      <Text style={[styles.optionTitle, option.title === 'Logout' && { color: '#FF3B30' }]}>
        {option.title}
      </Text>
    </View>
    <View style={styles.optionRight}>
      {option.value && (
        <Text
          style={[
            styles.optionValue,
            option.title === 'Notifications' && styles.valueOrange,
          ]}
        >
          {option.value}
        </Text>
      )}
      {option.hasArrow && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </View>
  </TouchableOpacity>
)

export default function ProfileScreen() {
  const {
    // State
    userProfile,
    loading,

    // Options
    profileOptions,
    securityOptions,
    supportOptions,

    // Handlers
    handleEditProfile,
  } = useProfileScreen()

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBarSpacer} />
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconWrapper}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <Ionicons name="time-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  userProfile?.avatar ||
                  'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {userProfile?.full_name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || 'email@domain.com'}
            {userProfile?.phone
              ? ` | ${userProfile.phone}`
              : ' | +01 234 567 89'}
          </Text>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          {profileOptions.map((option) => (
            <OptionRow key={option.title} option={option} />
          ))}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          {securityOptions.map((option) => (
            <OptionRow key={option.title} option={option} />
          ))}
        </View>

        {/* Support Section */}
        <View style={[styles.section, styles.lastSection]}>
          {supportOptions.map((option) => (
            <OptionRow key={option.title} option={option} />
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
