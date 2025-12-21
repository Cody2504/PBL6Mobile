import { StyleSheet } from 'react-native'
import { hs, vs, getFontSize, MIN_TOUCH_SIZE } from '@/libs/utils/responsive'
import {
  Colors,
  Typography,
  Spacing,
} from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: hs(Spacing.lg),
    paddingVertical: vs(Spacing.md),
    backgroundColor: Colors[theme].surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors[theme].border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hs(Spacing.md),
  },
  avatar: {
    width: hs(36),
    height: hs(36),
    borderRadius: hs(18),
    backgroundColor: '#F4E4C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: getFontSize(Typography.labelLarge.fontSize),
    fontWeight: Typography.labelLarge.fontWeight,
    color: '#8B7355',
  },
  headerTitle: {
    fontSize: getFontSize(Typography.h1.fontSize),
    fontWeight: Typography.h1.fontWeight,
    color: Colors[theme].text,
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
