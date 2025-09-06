import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@constants/theme';
import { haptics } from '@utils/helpers/haptics';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return COLORS.secondary;
      case 'accent':
        return COLORS.accent;
      default:
        return COLORS.primary;
    }
  };

  const handlePress = () => {
    haptics.medium();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.card,
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
});
