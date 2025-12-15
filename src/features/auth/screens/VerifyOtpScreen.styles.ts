import { StyleSheet } from 'react-native'
import {
  wp,
  hp,
  vs,
  hs,
  getSafePadding,
  getFontSize,
  MIN_TOUCH_SIZE,
} from '@/libs/utils'
import { Colors } from '@/libs/constants/theme'

export const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].backgroundSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: getSafePadding(),
    paddingVertical: vs(20),
    minHeight: hp(100),
  },
  card: {
    backgroundColor: Colors[theme].surface,
    borderRadius: hs(16),
    paddingHorizontal: getSafePadding(),
    paddingVertical: vs(24),
    shadowColor: Colors[theme].shadowColor,
    shadowOffset: {
      width: 0,
      height: vs(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: hs(8),
    elevation: 5,
    width: '100%',
    maxWidth: wp(90),
    alignSelf: 'center',
  },
  title: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: Colors[theme].text,
    textAlign: 'center',
    marginBottom: vs(12),
    lineHeight: getFontSize(28),
  },
  subtitle: {
    fontSize: getFontSize(14),
    color: Colors[theme].textTertiary,
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: getFontSize(20),
    paddingHorizontal: hs(8),
  },
  email: {
    fontWeight: '600',
    color: Colors[theme].text,
  },
  formGroup: {
    marginBottom: vs(16),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: Colors[theme].textSecondary,
    marginBottom: vs(8),
    lineHeight: getFontSize(20),
  },
  input: {
    backgroundColor: Colors[theme].inputBackground,
    borderRadius: hs(8),
    paddingHorizontal: hs(16),
    paddingVertical: vs(12),
    fontSize: getFontSize(18),
    color: Colors[theme].text,
    borderWidth: 1,
    borderColor: Colors[theme].border,
    textAlign: 'center',
    letterSpacing: hs(4),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    textAlignVertical: 'center',
    lineHeight: getFontSize(24),
  },
  timerText: {
    fontSize: getFontSize(12),
    color: Colors[theme].textTertiary,
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: getFontSize(18),
  },
  button: {
    backgroundColor: Colors[theme].buttonPrimary,
    borderRadius: hs(8),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(16),
    minHeight: Math.max(MIN_TOUCH_SIZE, vs(48)),
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors[theme].buttonPrimaryDisabled,
  },
  buttonText: {
    color: Colors[theme].buttonPrimaryText,
    fontSize: getFontSize(16),
    fontWeight: '600',
    lineHeight: getFontSize(22),
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: vs(12),
    marginBottom: vs(8),
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: getFontSize(14),
    color: Colors[theme].link,
    fontWeight: '500',
    lineHeight: getFontSize(20),
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors[theme].buttonPrimaryDisabled,
  },
})
