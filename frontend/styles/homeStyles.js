import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  banner: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 8,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    opacity: 0.95,
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  sparkles: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  sparkle: {
    fontSize: 20,
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  factCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  factTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 12,
  },
  factText: {
    color: '#78350F',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  messageCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 12,
  },
  messageText: {
    color: '#1E3A8A',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default styles;


