import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';

interface StoriesStyles {
  storyTabs: ViewStyle;
  storyTab: ViewStyle;
  storyTabActive: ViewStyle;
  storyTabText: TextStyle;
  storyTabTextActive: TextStyle;
  storyTitle: TextStyle;
  storyContent: TextStyle;
  watchVideoButton: ViewStyle;
  watchVideoButtonText: TextStyle;
  videoSection: ViewStyle;
  videoContainer: ViewStyle;
  videoPlayer: ViewStyle;
  videoInfoTitle: TextStyle;
  videoInfoText: TextStyle;
}

export default StyleSheet.create<StoriesStyles>({
  storyTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  storyTab: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    ...SHADOWS.small,
  },
  storyTabActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
  },
  storyTabText: {
    color: COLORS.text.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  storyTabTextActive: {
    color: COLORS.card,
  },
  storyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: 16,
    lineHeight: 34,
  },
  storyContent: {
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  watchVideoButton: {
    marginVertical: 16,
  },
  watchVideoButtonText: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  videoSection: {
    marginVertical: 16,
  },
  videoContainer: {
    backgroundColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...SHADOWS.large,
  },
  videoPlayer: {
    width: '100%',
    height: 220,
  },
  videoInfoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  videoInfoText: {
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: 8,
  },
});
