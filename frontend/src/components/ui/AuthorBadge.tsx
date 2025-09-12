import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '@constants/theme';

interface AuthorBadgeProps {
  name: string;
  avatar?: ImageSourcePropType;
  timestamp?: string;
  size?: 'regular' | 'compact';
  style?: ViewStyle;
}

export function AuthorBadge({
  name,
  avatar,
  timestamp,
  size = 'regular',
  style,
}: AuthorBadgeProps) {
  const isCompact = size === 'compact';
  const avatarSize = isCompact
    ? LAYOUT.author.compactAvatarSize
    : LAYOUT.author.avatarSize;

  return (
    <View style={[styles.container, style]}>
      {avatar && (
        <Image
          source={avatar}
          style={[
            styles.avatar,
            { width: avatarSize, height: avatarSize },
          ]}
        />
      )}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.name,
            isCompact && styles.compactText,
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        {timestamp && (
          <Text
            style={[
              styles.timestamp,
              isCompact && styles.compactText,
            ]}
            numberOfLines={1}
          >
            {timestamp}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    borderRadius: 9999,
    backgroundColor: COLORS.card.border,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: TYPOGRAPHY.fonts.medium,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.primary,
  },
  timestamp: {
    fontFamily: TYPOGRAPHY.fonts.regular,
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  compactText: {
    fontSize: TYPOGRAPHY.sizes.small,
  },
});
