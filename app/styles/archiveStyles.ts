import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';

interface ArchiveStyles {
  archiveTitle: TextStyle;
  archiveSubtitle: TextStyle;
  weekTabs: ViewStyle;
  weekTab: ViewStyle;
  weekTabActive: ViewStyle;
  weekTabText: TextStyle;
  weekTabTextActive: TextStyle;
  weekTitle: TextStyle;
  archiveStoryCard: ViewStyle;
  storyCardHeader: ViewStyle;
  archiveDate: TextStyle;
  archiveStoryTitle: TextStyle;
  archiveStoryHint: TextStyle;
  archiveInfoCard: ViewStyle;
  archiveInfoTitle: TextStyle;
  archiveInfoText: TextStyle;
}

export default StyleSheet.create<ArchiveStyles>({
  archiveTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  archiveSubtitle: {
    fontSize: 16,
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  weekTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  weekTab: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    ...SHADOWS.small,
    marginRight: 12,
  },
  weekTabActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
  },
  weekTabText: {
    color: COLORS.text.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  weekTabTextActive: {
    color: COLORS.card,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  archiveStoryCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  storyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  archiveDate: {
    fontSize: 12,
    color: COLORS.text.light,
    fontWeight: '600',
  },
  archiveStoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  archiveStoryHint: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    fontStyle: 'italic',
  },
  archiveInfoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#8B5CF6',
    ...SHADOWS.medium,
  },
  archiveInfoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5B21B6',
    marginBottom: 12,
  },
  archiveInfoText: {
    color: '#6D28D9',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});
