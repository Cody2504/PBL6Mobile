import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { classService } from '../../services/classService';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
  category: 'assistant' | 'added' | 'other';
}

const OtherScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [className, setClassName] = React.useState<string>('');

  const assistantApps: AppItem[] = [
    {
      id: '1',
      name: 'Thêm trợ lý ảo và bot',
      icon: 'robot',
      iconColor: '#666',
      iconBackground: '#f0f0f0',
      category: 'assistant',
    },
  ];

  const addedApps: AppItem[] = [
    {
      id: '2',
      name: 'Forms',
      icon: 'form-select',
      iconColor: '#fff',
      iconBackground: '#20b2aa',
      category: 'added',
    },
  ];

  const otherApps: AppItem[] = [
    {
      id: '3',
      name: 'Thêm ứng dụng',
      icon: 'apps',
      iconColor: '#666',
      iconBackground: '#f0f0f0',
      category: 'other',
    },
  ];

  const powerApps: AppItem[] = [
    {
      id: '4',
      name: 'Power Apps',
      icon: 'lightning-bolt',
      iconColor: '#fff',
      iconBackground: '#742774',
      category: 'other',
    },
  ];

  useEffect(() => {
    fetchClassName();
  }, [params.classId]);

  const fetchClassName = async () => {
    try {
      const classResponse = await classService.getClassById(params.classId as string);
      setClassName(classResponse.class_name);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleGroupNamePress = () => {
    router.push({
      pathname: '/(group)/team-detail',
      params: {
        classId: params.classId,
        className: params.classroomName,
      },
    });
  };

  const handleAppPress = (app: AppItem) => {
    console.log('App pressed:', app.name);
    // TODO: Implement app navigation/action
  };

  const renderAppItem = (app: AppItem, showMore: boolean = false) => (
    <TouchableOpacity
      key={app.id}
      style={styles.appItem}
      onPress={() => handleAppPress(app)}
    >
      <View style={[styles.appIconContainer, { backgroundColor: app.iconBackground }]}>
        <Icon name={app.icon} size={24} color={app.iconColor} />
      </View>
      <Text style={styles.appName}>{app.name}</Text>
      {showMore && (
        <TouchableOpacity style={styles.appMoreButton}>
          <Icon name="dots-horizontal" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGroupNamePress} style={styles.groupNameContainer}>
            <Text style={styles.groupName}>{className || params.classroomName}</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="video" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={() =>
              router.push({
                pathname: '/(post)/post-screen',
                params: {
                  classId: params.classId,
                  classroomName: params.classroomName,
                },
              })
            }
          >
            <Text style={styles.tabText}>Bài đăng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={() =>
              router.push({
                pathname: '/(post)/files-screen',
                params: {
                  classId: params.classId,
                  classroomName: params.classroomName,
                },
              })
            }
          >
            <Text style={styles.tabText}>Tệp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.activeTabContainer}>
            <Text style={styles.activeTabText}>Khác</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Assistant Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đã thêm trợ lý ảo và bot</Text>
          {assistantApps.map((app) => renderAppItem(app, false))}
        </View>

        {/* Added Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng đã thêm</Text>
          {addedApps.map((app) => renderAppItem(app, true))}
        </View>

        {/* Other Apps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng khác</Text>
          {otherApps.map((app) => renderAppItem(app, false))}
        </View>

        {/* Power Apps Section */}
        <View style={styles.section}>
          {powerApps.map((app) => renderAppItem(app, false))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    padding: 4,
    width: 40,
  },
  groupNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTabText: {
    fontSize: 16,
    color: '#0078d4',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#0078d4',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  appMoreButton: {
    padding: 4,
  },
});

export default OtherScreen;
