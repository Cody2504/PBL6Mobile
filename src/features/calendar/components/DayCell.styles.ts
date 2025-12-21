import { StyleSheet, Dimensions } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

const SCREEN_WIDTH = Dimensions.get('window').width
const PADDING = hs(8) * 2 // MonthGrid horizontal padding
const CELL_SIZE = (SCREEN_WIDTH - PADDING) / 7

export const styles = StyleSheet.create({
  container: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hs(2),
  },
  // Box that contains number and dots
  dayBox: {
    width: CELL_SIZE - hs(6),
    height: CELL_SIZE - hs(6),
    borderRadius: hs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayBox: {
    borderWidth: 2,
    borderColor: '#6264a7',
  },
  selectedBox: {
    backgroundColor: '#6264a7',
    borderRadius: hs(8),
  },
  dayNumber: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  otherMonthText: {
    color: '#ccc',
  },
  todayText: {
    color: '#6264a7',
    fontWeight: '700',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
  // Event indicators below the number, inside the box
  eventIndicators: {
    marginTop: vs(2),
    alignItems: 'center',
    minHeight: hs(6),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: hs(2),
  },
  dot: {
    width: hs(5),
    height: hs(5),
    borderRadius: hs(2.5),
  },
  countBadge: {
    paddingHorizontal: hs(4),
    paddingVertical: vs(1),
    backgroundColor: '#6264a7',
    borderRadius: hs(8),
  },
  countText: {
    fontSize: getFontSize(9),
    fontWeight: '600',
    color: '#fff',
  },
})

