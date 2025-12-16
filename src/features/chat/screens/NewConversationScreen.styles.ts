import { StyleSheet } from 'react-native'
import { Colors } from '@/libs/constants/theme'
import { wp, hp, fs, vs, hs } from '@/libs/utils/responsive'

export const createStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme].background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingVertical: vs(12),
      gap: hs(12),
      backgroundColor: Colors[colorScheme].background,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].border,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme].backgroundSecondary,
      borderRadius: 8,
      paddingHorizontal: hs(12),
      paddingVertical: vs(10),
      gap: hs(8),
    },
    searchInput: {
      flex: 1,
      fontSize: fs(16),
      color: Colors[colorScheme].text,
    },
    cancelButton: {
      fontSize: fs(16),
      color: Colors[colorScheme].primary,
      fontWeight: '500',
    },
    recommendedSection: {
      paddingVertical: vs(16),
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].border,
    },
    recommendedScroll: {
      paddingHorizontal: wp(4),
      gap: hs(16),
    },
    recommendedItem: {
      alignItems: 'center',
      gap: vs(8),
    },
    recommendedAvatar: {
      width: hs(60),
      height: hs(60),
      borderRadius: hs(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
    recommendedAvatarText: {
      fontSize: fs(24),
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    recommendedName: {
      fontSize: fs(12),
      color: Colors[colorScheme].text,
      maxWidth: hs(70),
    },
    content: {
      flex: 1,
    },
    recentSection: {
      paddingVertical: vs(16),
      paddingHorizontal: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].border,
    },
    sectionTitle: {
      fontSize: fs(18),
      fontWeight: 'bold',
      color: Colors[colorScheme].text,
      marginBottom: vs(12),
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: vs(16),
    },
    loadingText: {
      fontSize: fs(16),
      color: Colors[colorScheme].textSecondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(8),
      gap: vs(12),
    },
    emptyText: {
      fontSize: fs(18),
      fontWeight: '600',
      color: Colors[colorScheme].textSecondary,
    },
    emptySubtext: {
      fontSize: fs(14),
      color: Colors[colorScheme].textTertiary,
      textAlign: 'center',
    },
    resultsContainer: {
      flex: 1,
    },
    resultSection: {
      paddingVertical: vs(16),
      paddingHorizontal: wp(4),
    },
    resultSectionTitle: {
      fontSize: fs(18),
      fontWeight: 'bold',
      color: Colors[colorScheme].text,
      marginBottom: vs(12),
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: vs(12),
      paddingHorizontal: hs(8),
      borderRadius: 8,
    },
    userItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: hs(12),
    },
    userAvatar: {
      width: hs(48),
      height: hs(48),
      borderRadius: hs(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    userAvatarText: {
      fontSize: fs(20),
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    userItemInfo: {
      flex: 1,
    },
    userItemTitle: {
      fontSize: fs(16),
      fontWeight: '500',
      color: Colors[colorScheme].text,
      marginBottom: vs(2),
    },
    userItemSubtitle: {
      fontSize: fs(14),
      color: Colors[colorScheme].textSecondary,
    },
  })
