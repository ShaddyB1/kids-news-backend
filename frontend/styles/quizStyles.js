import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  quizContainer: {
    padding: 20,
    gap: 20,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    color: '#374151',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  progressText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultsScore: {
    fontSize: 24,
    color: '#374151',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;


