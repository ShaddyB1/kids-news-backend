import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';

interface CommonStyles {
  safeContainer: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  centerContainer: ViewStyle;
  tabIcon: TextStyle;
  card: ViewStyle;
  cardTitle: TextStyle;
  cardText: TextStyle;
  cardHint: TextStyle;
  optionButton: ViewStyle;
  optionText: TextStyle;
}

export default StyleSheet.create<CommonStyles>({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabIcon: {
    fontSize: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  cardText: {
    color: COLORS.text.secondary,
    marginVertical: 4,
    fontSize: 16,
    lineHeight: 24,
  },
  cardHint: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionButton: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  optionText: {
    color: COLORS.text.primary,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
});
