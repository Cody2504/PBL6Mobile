import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Material } from '@/features/classroom'

interface FilesTabContentProps {
  materials: Material[]
  bottomPadding: number
}

const FilesTabContent: React.FC<FilesTabContentProps> = ({
  materials,
  bottomPadding,
}) => {
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 KB'
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.round(kb)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  }

  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename)
    switch (ext) {
      case 'pdf':
        return 'file-pdf-box'
      case 'doc':
      case 'docx':
        return 'file-word-box'
      case 'xls':
      case 'xlsx':
        return 'file-excel-box'
      case 'ppt':
      case 'pptx':
        return 'file-powerpoint-box'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'file-image'
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'file-video'
      case 'zip':
      case 'rar':
        return 'folder-zip'
      default:
        return 'file-document'
    }
  }

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <TouchableOpacity style={styles.materialItem}>
      <View style={styles.fileIconContainer}>
        <Icon name={getFileIcon(item.title)} size={40} color="#0078d4" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.fileDetails}>
          {formatFileSize(item.file_size)} • User {item.uploaded_by}
        </Text>
        <Text style={styles.fileDate}>
          {new Date(item.uploaded_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="dots-vertical" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="lock" size={80} color="#0078d4" />
        <View style={styles.fileIcons}>
          <Icon
            name="file-document"
            size={40}
            color="#f4a261"
            style={styles.floatingIcon1}
          />
          <Icon
            name="image"
            size={35}
            color="#e76f51"
            style={styles.floatingIcon2}
          />
        </View>
      </View>
      <Text style={styles.emptyTitle}>
        Các tệp lớp học chỉ đọc sẽ nằm ở đây
      </Text>
      <Text style={styles.emptySubtitle}>
        Học viên có thể đọc những tệp này nhưng chỉ giáo viên có thể chỉnh sửa
      </Text>
    </View>
  )

  if (materials.length === 0) {
    return renderEmptyState()
  }

  return (
    <FlatList
      data={materials}
      renderItem={renderMaterialItem}
      keyExtractor={(item) => item.material_id.toString()}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: bottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
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
})

export default FilesTabContent
