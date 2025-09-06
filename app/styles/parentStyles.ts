import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';

interface ParentStyles {
  parentContainer: ViewStyle;
  parentTitle: TextStyle;
  pinButton: ViewStyle;
}

export default StyleSheet.create<ParentStyles>({
  parentContainer: {
    padding: 20,
    gap: 20,
  },
  parentTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  pinButton: {
    marginTop: 12,
  },
});
