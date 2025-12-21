import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hs(8),
    position: 'relative',
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: '#6264a7',
  },
  selectedContainer: {
    backgroundColor: '#6264a7',
  },
  dayNumber: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#000',
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    color: '#6264a7',
    fontWeight: '700',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
  eventIndicators: {
    position: 'absolute',
    bottom: vs(4),
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: hs(2),
  },
  dot: {
    width: hs(6),
    height: hs(6),
    borderRadius: hs(3),
  },
  countBadge: {
    paddingHorizontal: hs(4),
    paddingVertical: vs(1),
    backgroundColor: '#6264a7',
    borderRadius: hs(8),
  },
  countText: {
    fontSize: getFontSize(10),
    fontWeight: '600',
    color: '#fff',
  },
})
