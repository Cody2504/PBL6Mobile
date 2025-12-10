import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { classService, Material as BackendMaterial } from '../../services/classService';
import { batchGetUserInfo } from '../../utils/userCache';
import {
  formatFileSize,
  formatRelativeTime,
  getFileExtension,
  getFilenameFromUrl,
} from '../../utils/fileHelpers';

interface Material {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

const FilesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState<string>('');
  const [userInfoMap, setUserInfoMap] = useState<Map<number, any>>(new Map());

  useEffect(() => {
    fetchMaterials();
  }, [params.classId]);

  const transformMaterial = (material: BackendMaterial): Material => {
    const fileName = getFilenameFromUrl(material.file_url) || material.title;
    const fileExtension = getFileExtension(fileName);
    const userInfo = userInfoMap.get(material.uploaded_by);

    return {
      id: material.material_id,
      name: fileName,
      size: formatFileSize(material.file_size),
      type: fileExtension,
      uploadedBy: userInfo?.full_name || `User ${material.uploaded_by}`,
      uploadedAt: formatRelativeTime(material.uploaded_at),
      url: material.file_url,
    };
  };

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);

      // Fetch class data to get className
      const classResponse = await classService.getClassById(params.classId as string);
      setClassName(classResponse.class_name);

      // Fetch materials
      const materialsData = await classService.getMaterials(params.classId as string);

      if (materialsData.length === 0) {
        setMaterials([]);
        return;
      }

      // Extract unique uploader IDs
      const uploaderIds = [...new Set(materialsData.map((m) => m.uploaded_by))];

      // Batch fetch user info
      const userInfoResults = await batchGetUserInfo(uploaderIds);
      setUserInfoMap(userInfoResults);

      // Transform materials to UI format
      const transformedMaterials = materialsData.map(transformMaterial);
      setMaterials(transformedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      Alert.alert('Error', 'Failed to load materials');
      setMaterials([]);
    } finally {
      setIsLoading(false);
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

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();

    // Documents
    if (lowerType === 'pdf') return 'file-pdf-box';
    if (['doc', 'docx'].includes(lowerType)) return 'file-word-box';
    if (['xls', 'xlsx'].includes(lowerType)) return 'file-excel-box';
    if (['ppt', 'pptx'].includes(lowerType)) return 'file-powerpoint-box';

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(lowerType))
      return 'file-image';

    // Videos
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(lowerType))
      return 'file-video';

    // Audio
    if (['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg'].includes(lowerType))
      return 'file-music';

    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(lowerType)) return 'folder-zip';

    // Code files
    if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(lowerType))
      return 'file-code';

    // Default
    return 'file-document';
  };

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <TouchableOpacity style={styles.materialItem}>
      <View style={styles.fileIconContainer}>
        <Icon name={getFileIcon(item.type)} size={40} color="#0078d4" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.fileDetails}>
          {item.size} • {item.uploadedBy}
        </Text>
        <Text style={styles.fileDate}>{item.uploadedAt}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="dots-vertical" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="lock" size={80} color="#0078d4" />
        <View style={styles.fileIcons}>
          <Icon name="file-document" size={40} color="#f4a261" style={styles.floatingIcon1} />
          <Icon name="image" size={35} color="#e76f51" style={styles.floatingIcon2} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>Các tệp lớp học chỉ đọc sẽ nằm ở đây</Text>
      <Text style={styles.emptySubtitle}>
        Học viên có thể đọc những tệp này nhưng chỉ giáo viên có thể chỉnh sửa
      </Text>
    </View>
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

          <TouchableOpacity style={styles.activeTabContainer}>
            <Text style={styles.activeTabText}>Tệp</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabContainer}
            activeOpacity={1}
            onPress={() =>
              router.push({
                pathname: '/(post)/other-screen',
                params: {
                  classId: params.classId,
                  classroomName: params.classroomName,
                },
              })
            }
          >
            <Text style={styles.tabText}>Khác</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      ) : materials.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={materials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcons: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingIcon1: {
    position: 'absolute',
    left: 20,
    top: 20,
    transform: [{ rotate: '-15deg' }],
  },
  floatingIcon2: {
    position: 'absolute',
    right: 20,
    top: 30,
    transform: [{ rotate: '15deg' }],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileIconContainer: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    padding: 4,
  },
});

export default FilesScreen;
