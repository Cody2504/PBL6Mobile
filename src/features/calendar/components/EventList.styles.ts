import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

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
  headerText: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#000',
  },
  countText: {
    fontSize: getFontSize(14),
    color: '#666',
  },
  listContent: {
    padding: hs(16),
  },
})
