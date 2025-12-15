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
    width: hs(40),
    height: hs(40),
    borderRadius: hs(20),
    backgroundColor: Colors[theme].primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: getFontSize(Typography.h4.fontSize),
    fontWeight: Typography.h4.fontWeight,
    color: Colors[theme].textInverse,
  },
  headerTitle: {
    fontSize: getFontSize(Typography.h2.fontSize),
    fontWeight: Typography.h2.fontWeight,
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
