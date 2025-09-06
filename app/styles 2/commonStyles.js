import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  cardText: {
    color: '#475569',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    color: '#374151',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default commonStyles;


