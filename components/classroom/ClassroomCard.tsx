import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Classroom {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher_id: string;
  created_at: string;
  avatarColor: string;
  avatarText: string;
  role: 'student' | 'teacher';
}

interface ClassroomCardProps {
  classroom: Classroom;
  onPress: () => void;
  onOptionSelect: (option: 'members' | 'hide' | 'delete') => void;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom, onPress, onOptionSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const menuOptions = [
    { label: 'See all the members', key: 'members' as const },
    { label: 'Hiding the classroom', key: 'hide' as const },
    ...(classroom.role === 'teacher'
      ? [{ label: 'Delete the classroom', key: 'delete' as const }]
      : []),
  ];

  const handleMenuSelect = (key: 'members' | 'hide' | 'delete') => {
    setShowMenu(false);
    
    if (key === 'members') {
      router.push({
        pathname: '../(group)/team-members',
        params: {
          classroomId: classroom.id,
          classroomName: classroom.name,
          userRole: classroom.role,
        },
      });
    } else {
      onOptionSelect(key);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.card} onPress={onPress}>
        {/* <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevron} /> */}
        
        <View style={[styles.avatar, { backgroundColor: classroom.avatarColor }]}>
          <Text style={styles.avatarText}>{classroom.avatarText}</Text>
        </View>

        <View style={styles.classInfo}>
          <Text style={styles.name} numberOfLines={1}>{classroom.name}</Text>
          {/* <Text style={styles.code} numberOfLines={1}>Code: {classroom.code}</Text>
          {classroom.description && (
            <Text style={styles.description} numberOfLines={1}>{classroom.description}</Text>
          )} */}
        </View>

        <Pressable 
          onPress={() => setShowMenu(!showMenu)} 
          style={styles.menuButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </Pressable>
      </Pressable>

      {showMenu && (
        <>
          <Pressable 
            style={styles.menuOverlay} 
            onPress={() => setShowMenu(false)} 
          />
          <View style={styles.menuContainer}>
            {menuOptions.map((option, index) => (
              <Pressable
                key={option.key}
                onPress={() => handleMenuSelect(option.key)}
                style={[
                  styles.menuItem,
                  index === menuOptions.length - 1 && styles.menuItemLast
                ]}
              >
                <Text style={styles.menuText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  chevron: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  classInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  code: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 15,
    color: '#000',
  },
});

export default ClassroomCard;