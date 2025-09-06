import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, LAYOUT } from '@constants/theme';
import { AuthorBadge } from './AuthorBadge';
import { CategoryBadge } from './CategoryBadge';
import { useAnimation } from '@hooks/useAnimation';
import { haptics } from '@utils/helpers/haptics';

interface StoryCardProps {
  type?: 'featured' | 'standard' | 'compact';
  title: string;
  image: ImageSourcePropType;
  category: string;
  author: {
    name: string;
    avatar?: ImageSourcePropType;
    timestamp?: string;
  };
  isLive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function StoryCard({
  type = 'standard',
  title,
  image,
  category,
  author,
  isLive,
  onPress,
  style,
}: StoryCardProps) {
  const { animation: scaleAnim, scale } = useAnimation(1);

  const handlePress = () => {
    haptics.light();
    scale();
    onPress?.();
  };

  const renderContent = () => {
    switch (type) {
      case 'featured':
        return (
          <>
            <Image source={image} style={styles.featuredImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                {isLive && <LiveBadge />}
                <CategoryBadge category={category} />
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {title}
                </Text>
                <AuthorBadge {...author} size="compact" />
              </View>
            </LinearGradient>
          </>
        );

      case 'compact':
        return (
          <View style={styles.compactContainer}>
            <Image source={image} style={styles.compactImage} />
            <View style={styles.compactContent}>
              <Text style={styles.compactTitle} numberOfLines={2}>
                {title}
              </Text>
              <View style={styles.compactMeta}>
                <CategoryBadge category={category} size="small" />
                <Text style={styles.timestamp}>{author.timestamp}</Text>
              </View>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.standardContainer}>
            <View style={styles.standardContent}>
              <View style={styles.standardHeader}>
                {isLive && <LiveBadge />}
                <CategoryBadge category={category} />
              </View>
              <Text style={styles.standardTitle} numberOfLines={3}>
                {title}
              </Text>
              <AuthorBadge {...author} />
            </View>
            <Image source={image} style={styles.standardImage} />
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[
        styles.container,
        styles[`${type}Container`],
        style,
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {renderContent()}
      </Animated.View>
    </TouchableOpacity>
  );
}

function LiveBadge() {
  return (
    <View style={styles.liveBadge}>
      <View style={styles.liveIndicator} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  featuredContainer: {
    height: LAYOUT.card.featured.aspectRatio,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: SPACING.layout.cardPadding,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  featuredTitle: {
    fontFamily: TYPOGRAPHY.fonts.bold,
    fontSize: TYPOGRAPHY.sizes.h2,
    color: COLORS.text.inverse,
    lineHeight: TYPOGRAPHY.lineHeights.h2,
  },
  standardContainer: {
    flexDirection: 'row',
    padding: SPACING.layout.cardPadding,
    height: LAYOUT.card.standard.height,
  },
  standardContent: {
    flex: 1,
    marginRight: SPACING.md,
    gap: SPACING.sm,
  },
  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  standardTitle: {
    fontFamily: TYPOGRAPHY.fonts.semibold,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.body,
  },
  standardImage: {
    width: LAYOUT.card.standard.imageWidth,
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  compactContainer: {
    flexDirection: 'row',
    padding: SPACING.sm,
    height: LAYOUT.card.compact.height,
  },
  compactImage: {
    width: LAYOUT.card.compact.imageWidth,
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  compactContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontFamily: TYPOGRAPHY.fonts.medium,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.lineHeights.caption,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timestamp: {
    fontFamily: TYPOGRAPHY.fonts.regular,
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.text.secondary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.live,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.pill,
    gap: SPACING.xs,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.text.inverse,
  },
  liveText: {
    fontFamily: TYPOGRAPHY.fonts.semibold,
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.text.inverse,
  },
});
