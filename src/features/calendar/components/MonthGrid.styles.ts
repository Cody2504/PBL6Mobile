import { StyleSheet, Dimensions } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

const SCREEN_WIDTH = Dimensions.get('window').width
const PADDING = hs(8) * 2
const CELL_SIZE = (SCREEN_WIDTH - PADDING) / 7

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: hs(8),
    paddingVertical: vs(8),
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: vs(4),
  },
  dayLabelContainer: {
    width: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(4),
  },
  dayLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
