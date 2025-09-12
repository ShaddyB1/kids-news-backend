import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '@constants/theme';

interface CategoryBadgeProps {
  category: string;
  color?: string;
}

export function CategoryBadge({ category, color = COLORS.accent }: CategoryBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    ...SHADOWS.small,
  },
  text: {
    color: COLORS.card,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
