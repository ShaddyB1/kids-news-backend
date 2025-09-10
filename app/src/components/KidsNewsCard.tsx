import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { kidsFriendlyDesignSystem } from '../config/kidsFriendlyDesignSystem';

interface KidsNewsCardProps {
  title: string;
  summary: string;
  category: string;
  onPress: () => void;
  illustration?: string;
  readTime?: string;
  isBreaking?: boolean;
  isTrending?: boolean;
}

const KidsNewsCard: React.FC<KidsNewsCardProps> = ({
  title,
  summary,
  category,
  onPress,
  illustration = '📰',
  readTime = '3 min',
  isBreaking = false,
  isTrending = false
}) => {
  const getCategoryColor = () => {
    const colors = kidsFriendlyDesignSystem.colorPalette.secondary;
    switch (category.toLowerCase()) {
      case 'science': return colors.mint;
      case 'animals': return colors.lightBlue;
      case 'sports': return colors.skyBlue;
      case 'technology': return colors.lavender;
      default: return kidsFriendlyDesignSystem.colorPalette.primary.orange;
    }
  };

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'science': return '🔬';
      case 'animals': return '🐾';
      case 'sports': return '⚽';
      case 'technology': return '🚀';
      case 'environment': return '🌱';
      case 'space': return '🌟';
      default: return '📰';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {isBreaking && (
            <View style={[styles.badge, { backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.coral }]}>
              <Text style={styles.badgeText}>🔥 Breaking</Text>
            </View>
          )}
          {isTrending && (
            <View style={[styles.badge, { backgroundColor: kidsFriendlyDesignSystem.colorPalette.accents.brightGreen }]}>
              <Text style={styles.badgeText}>📈 Trending</Text>
            </View>
          )}
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>{illustration}</Text>
        </View>

        {/* Category */}
        <View style={[styles.categoryContainer, { backgroundColor: getCategoryColor() }]}>
          <Text style={styles.categoryText}>
            {getCategoryIcon()} {category}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.summary} numberOfLines={3}>
            {summary}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.readTimeContainer}>
            <Text style={styles.readTime}>⏱️ {readTime} read</Text>
          </View>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: kidsFriendlyDesignSystem.spacing.md,
    marginVertical: kidsFriendlyDesignSystem.spacing.sm,
  },
  card: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
    padding: kidsFriendlyDesignSystem.spacing.md,
    ...kidsFriendlyDesignSystem.shadows.medium,
    shadowColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
    shadowOpacity: 0.1,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: kidsFriendlyDesignSystem.spacing.sm,
    gap: kidsFriendlyDesignSystem.spacing.xs,
  },
  badge: {
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.sm,
    paddingVertical: kidsFriendlyDesignSystem.spacing.xs,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.pill,
  },
  badgeText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.small,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: kidsFriendlyDesignSystem.spacing.sm,
  },
  illustration: {
    fontSize: 60,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingVertical: kidsFriendlyDesignSystem.spacing.xs,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.pill,
    marginBottom: kidsFriendlyDesignSystem.spacing.sm,
  },
  categoryText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.caption,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
  },
  content: {
    marginBottom: kidsFriendlyDesignSystem.spacing.md,
  },
  title: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.subtitle,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
    marginBottom: kidsFriendlyDesignSystem.spacing.xs,
    lineHeight: kidsFriendlyDesignSystem.contentPresentation.text.lineHeight * kidsFriendlyDesignSystem.typography.fontSizes.subtitle,
  },
  summary: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.regular.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
    lineHeight: kidsFriendlyDesignSystem.contentPresentation.text.lineHeight * kidsFriendlyDesignSystem.typography.fontSizes.body,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTimeContainer: {
    flex: 1,
  },
  readTime: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.caption,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
  },
  playButton: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.coral,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.pill,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  playIcon: {
    fontSize: 16,
  },
});

export default KidsNewsCard;
