import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: hs(16),
    paddingVertical: vs(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hs(12),
  },
  avatar: {
    width: hs(40),
    height: hs(40),
    borderRadius: hs(20),
    backgroundColor: '#6264a7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#fff',
  },
  headerTitle: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: '#000',
  },
  todayIconButton: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
