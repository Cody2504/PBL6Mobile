import { StyleSheet } from 'react-native'
import { vs, getFontSize } from '@/libs/utils/responsive'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(40),
  },
  message: {
    fontSize: getFontSize(16),
    color: '#999',
    marginTop: vs(16),
  },
})
