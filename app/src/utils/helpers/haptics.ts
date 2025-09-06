import { Vibration } from 'react-native';
import { APP_CONFIG } from '@constants/config';

export const haptics = {
  light: () => Vibration.vibrate(APP_CONFIG.HAPTIC.LIGHT),
  medium: () => Vibration.vibrate(APP_CONFIG.HAPTIC.MEDIUM),
  heavy: () => Vibration.vibrate(APP_CONFIG.HAPTIC.HEAVY),
};
