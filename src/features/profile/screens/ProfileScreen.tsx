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
import { createStyles } from './ProfileScreen.styles'
import { useColorScheme } from '@/global/hooks/use-color-scheme'

// Custom component for the profile option rows
const OptionRow: React.FC<{ option: ProfileOption; styles: any; colorScheme: 'light' | 'dark' }> = ({ option, styles, colorScheme }) => (
  <TouchableOpacity
    key={option.title}
    style={styles.optionRow}
    onPress={option.onPress}
  >
    <View style={styles.optionLeft}>
      <Ionicons
        name={option.icon as any}
        size={24}
        color={option.title === 'Đăng xuất' ? '#FF3B30' : (colorScheme === 'dark' ? '#94A3B8' : '#666')}
      />
      <Text style={[styles.optionTitle, option.title === 'Đăng xuất' && { color: '#FF3B30' }]}>
        {option.title}
      </Text>
    </View>
    <View style={styles.optionRight}>
      {option.value && (
        <Text style={styles.optionValue}>
          {option.value}
        </Text>
      )}
      {option.hasArrow && (
        <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#64748B' : '#ccc'} />
      )}
    </View>
  </TouchableOpacity>
)

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

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
          <ActivityIndicator size="large" color="#6264A7" />
          <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBarSpacer} />
      <ScrollView style={styles.content}>
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
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {userProfile?.full_name || 'Người dùng'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || 'email@domain.com'}
          </Text>
          {userProfile?.phone && (
            <Text style={styles.userPhone}>
              {userProfile.phone}
            </Text>
          )}
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          {profileOptions.map((option) => (
            <OptionRow key={option.title} option={option} styles={styles} colorScheme={colorScheme} />
          ))}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          {securityOptions.map((option) => (
            <OptionRow key={option.title} option={option} styles={styles} colorScheme={colorScheme} />
          ))}
        </View>

        {/* Support Section */}
        <View style={[styles.section, styles.lastSection]}>
          {supportOptions.map((option) => (
            <OptionRow key={option.title} option={option} styles={styles} colorScheme={colorScheme} />
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}
