import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { profileService, UserProfile } from '../../services/profileService';

interface ProfileOption {
  icon: string;
  title: string;
  value?: string;
  hasArrow?: boolean;
  onPress?: () => void;
}

// Custom component for the profile option rows
const OptionRow: React.FC<{ option: ProfileOption }> = ({ option }) => (
  <TouchableOpacity key={option.title} style={styles.optionRow} onPress={option.onPress}>
    <View style={styles.optionLeft}>
      <Ionicons
        name={
          option.title === 'Edit profile information' ? 'document-text-outline' :
          option.title === 'Security' ? 'lock-closed-outline' :
          option.title === 'Theme' ? 'bulb-outline' :
          option.title === 'Help & Support' ? 'person-circle-outline' :
          option.title === 'Contact us' ? 'chatbubble-outline' :
          option.title === 'Privacy policy' ? 'lock-closed-outline' :
          option.icon as any
        }
        size={24}
        color="#333"
      />
      <Text style={styles.optionTitle}>{option.title}</Text>
    </View>
    <View style={styles.optionRight}>
      {option.value && <Text style={[styles.optionValue, option.title === 'Notifications' && styles.valueOrange]}>{option.value}</Text>}
      {option.hasArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const profileOptions: ProfileOption[] = [
    {
      icon: 'document-text-outline',
      title: 'Edit profile information',
      hasArrow: true,
      onPress: () => router.push('/(profile)/edit-profile')
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      value: 'ON',
      hasArrow: true,
      onPress: () => console.log('Notifications')
    },
    {
      icon: 'language-outline',
      title: 'Language',
      value: 'English',
      hasArrow: true,
      onPress: () => console.log('Language')
    }
  ];

  const securityOptions: ProfileOption[] = [
    {
      icon: 'lock-closed-outline',
      title: 'Change Password',
      hasArrow: true,
      onPress: () => router.push('/(profile)/change-password')
    },
    {
      icon: 'bulb-outline',
      title: 'Theme',
      value: 'Light mode',
      hasArrow: true,
      onPress: () => console.log('Theme')
    }
  ];

  const supportOptions: ProfileOption[] = [
    {
      icon: 'person-circle-outline',
      title: 'Help & Support',
      hasArrow: true,
      onPress: () => console.log('Help & Support')
    },
    {
      icon: 'chatbubble-outline',
      title: 'Contact us',
      hasArrow: true,
      onPress: () => console.log('Contact us')
    },
    {
      icon: 'lock-closed-outline',
      title: 'Privacy policy',
      hasArrow: true,
      onPress: () => console.log('Privacy policy')
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} />
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
                uri: userProfile?.avatar || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(profile)/edit-profile')}>
              <Ionicons name="pencil" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {userProfile?.full_name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || 'email@domain.com'} 
            {userProfile?.phone ? ` | ${userProfile.phone}` : ' | +01 234 567 89'}
          </Text>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          {profileOptions.map((option) => <OptionRow key={option.title} option={option} />)}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          {securityOptions.map((option) => <OptionRow key={option.title} option={option} />)}
        </View>

        {/* Support Section */}
        <View style={[styles.section, styles.lastSection]}>
          {supportOptions.map((option) => <OptionRow key={option.title} option={option} />)}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerRightIcons: {
    flexDirection: 'row',
  },
  headerIconWrapper: {
    marginLeft: 15,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#E6F0FF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  lastSection: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
    fontWeight: '500',
  },
  valueOrange: {
    color: '#FF6B35',
  },
});