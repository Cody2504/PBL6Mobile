import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
  category: 'assistant' | 'added' | 'other';
}

interface OtherTabContentProps {
  bottomPadding: number;
}

const OtherTabContent: React.FC<OtherTabContentProps> = ({ bottomPadding }) => {
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

  const handleAppPress = (app: AppItem) => {
    console.log('App pressed:', app.name);
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
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đã thêm trợ lý ảo và bot</Text>
        {assistantApps.map((app) => renderAppItem(app, false))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ứng dụng đã thêm</Text>
        {addedApps.map((app) => renderAppItem(app, true))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ứng dụng khác</Text>
        {otherApps.map((app) => renderAppItem(app, false))}
      </View>

      <View style={styles.section}>
        {powerApps.map((app) => renderAppItem(app, false))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default OtherTabContent;
