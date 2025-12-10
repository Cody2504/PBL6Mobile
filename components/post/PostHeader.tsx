import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PostHeaderProps {
  className: string;
  onBackPress: () => void;
  onPlusPress?: () => void;
  onHeaderPress?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  className,
  onBackPress,
  onPlusPress,
  onHeaderPress,
}) => {
  const getClassInitials = (name: string) => {
    if (!name) return 'GB';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.topHeader}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButtonContainer}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.avatarContainer} onPress={onHeaderPress}>
        <Text style={styles.avatarText}>
          {getClassInitials(className)}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.groupNameContainer} onPress={onHeaderPress}>
        <Text style={styles.groupName} numberOfLines={1}>
          {className}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.headerIcon} onPress={onPlusPress}>
        <Icon name="plus" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    padding: 4,
    marginRight: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#d946ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  groupNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerIcon: {
    padding: 4,
  },
});

export default PostHeader;
