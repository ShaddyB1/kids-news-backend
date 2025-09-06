import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';

interface Styles {
  banner: ViewStyle;
  bannerTitle: TextStyle;
  bannerSubtitle: TextStyle;
  sparkles: ViewStyle;
  sparkle: TextStyle;
  quickActions: ViewStyle;
  actionButton: ViewStyle;
  actionEmoji: TextStyle;
  actionText: TextStyle;
  factCard: ViewStyle;
  factTitle: TextStyle;
  factText: TextStyle;
  messageCard: ViewStyle;
  messageTitle: TextStyle;
  messageText: TextStyle;
}

export default StyleSheet.create<Styles>({
  banner: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.large,
    marginBottom: 8,
  },
  bannerTitle: {
    color: COLORS.card,
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: COLORS.card,
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
    ...SHADOWS.medium,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: COLORS.card,
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
    ...SHADOWS.medium,
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
    ...SHADOWS.medium,
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
