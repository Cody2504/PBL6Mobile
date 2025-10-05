import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Get responsive dimensions
export const wp = (percentage: number) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage: number) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Font scaling
export const fs = (size: number) => moderateScale(size);

// Spacing scaling
export const hs = (size: number) => scale(size);
export const vs = (size: number) => verticalScale(size);

// Get device info
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;

// Minimum touch target size (44pt for iOS, 48dp for Android)
export const MIN_TOUCH_SIZE = 44;

// Get safe padding based on device size
export const getSafePadding = () => {
  if (isSmallDevice) return hs(16);
  if (isMediumDevice) return hs(20);
  return hs(24);
};

// Get safe font sizes
export const getFontSize = (base: number) => {
  const scaled = fs(base);
  // Ensure minimum readable size
  return Math.max(scaled, isSmallDevice ? base * 0.9 : base);
};