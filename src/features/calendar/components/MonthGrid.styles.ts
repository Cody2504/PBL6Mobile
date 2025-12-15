import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: hs(8),
    paddingVertical: vs(8),
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: vs(8),
  },
  dayLabelContainer: {
    width: '14.28%', // 100% / 7 days
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
