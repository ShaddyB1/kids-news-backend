import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { haptics } from '@utils/helpers/haptics';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

export function CategoryTabs({ categories, selectedId, onSelect, style }: CategoryTabsProps) {
  const handleSelect = (id: string) => {
    haptics.light();
    onSelect(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedId;
        const backgroundColor = isSelected
          ? category.color || COLORS.primary.main
          : 'transparent';
        const textColor = isSelected
          ? COLORS.text.inverse
          : COLORS.text.secondary;

        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              isSelected && styles.selectedTab,
              { backgroundColor },
            ]}
            onPress={() => handleSelect(category.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, { color: textColor }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.layout.screenPadding,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    ...SHADOWS.small,
  },
  selectedTab: {
    borderColor: 'transparent',
  },
  tabText: {
    ...TYPOGRAPHY.sizes.caption,
    fontFamily: TYPOGRAPHY.fonts.medium,
    textAlign: 'center',
  },
});
