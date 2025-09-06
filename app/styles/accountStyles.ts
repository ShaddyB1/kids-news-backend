import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@constants/theme';

interface AccountStyles {
  title: TextStyle;
}

export default StyleSheet.create<AccountStyles>({
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});
