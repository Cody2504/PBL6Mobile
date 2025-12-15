import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: hs(8),
    borderLeftWidth: 4,
    padding: hs(12),
    marginBottom: vs(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pressed: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginRight: hs(12),
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(4),
  },
  title: {
    flex: 1,
    fontSize: getFontSize(15),
    fontWeight: '600',
    color: '#000',
    marginRight: hs(8),
  },
  points: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#6264a7',
  },
  time: {
    fontSize: getFontSize(13),
    color: '#666',
    marginBottom: vs(2),
  },
  type: {
    fontSize: getFontSize(12),
    color: '#999',
  },
})
