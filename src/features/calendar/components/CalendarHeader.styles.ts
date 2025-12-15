import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hs(16),
    paddingVertical: vs(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hs(16),
  },
  navButton: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYear: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#6264a7',
  },
  todayButton: {
    paddingHorizontal: hs(12),
    paddingVertical: vs(6),
    backgroundColor: '#f8f9fa',
    borderRadius: hs(8),
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
  },
  todayText: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#6264a7',
  },
})
