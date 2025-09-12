import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@constants/theme';

interface QuizStyles {
  quizContainer: ViewStyle;
  quizTitle: TextStyle;
  questionText: TextStyle;
  progressText: TextStyle;
  resultsTitle: TextStyle;
  resultsScore: TextStyle;
}

export default StyleSheet.create<QuizStyles>({
  quizContainer: {
    padding: 20,
    gap: 20,
  },
  quizTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  progressText: {
    textAlign: 'center',
    color: COLORS.text.light,
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.success,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultsScore: {
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '700',
  },
});
