import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { kidsFriendlyDesignSystem } from '../config/kidsFriendlyDesignSystem';

interface KidsPlayfulButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'play';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const KidsPlayfulButton: React.FC<KidsPlayfulButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  style
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
      alignItems: 'center',
      justifyContent: 'center',
      ...kidsFriendlyDesignSystem.shadows.playful,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: kidsFriendlyDesignSystem.colorPalette.secondary.skyBlue,
        };
      case 'play':
        return {
          ...baseStyles,
          backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.coral,
          borderRadius: kidsFriendlyDesignSystem.borderRadius.pill,
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      color: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
      fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        return {
          ...baseTextStyles,
          fontSize: kidsFriendlyDesignSystem.typography.fontSizes.caption,
          paddingVertical: kidsFriendlyDesignSystem.spacing.xs,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
        };
      case 'medium':
        return {
          ...baseTextStyles,
          fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
          paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.lg,
        };
      case 'large':
        return {
          ...baseTextStyles,
          fontSize: kidsFriendlyDesignSystem.typography.fontSizes.subtitle,
          paddingVertical: kidsFriendlyDesignSystem.spacing.md,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.xl,
        };
      default:
        return baseTextStyles;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: kidsFriendlyDesignSystem.spacing.xs,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.lg,
          minHeight: 44,
        };
      case 'large':
        return {
          paddingVertical: kidsFriendlyDesignSystem.spacing.md,
          paddingHorizontal: kidsFriendlyDesignSystem.spacing.xl,
          minHeight: 52,
        };
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[getTextStyles(), disabled && styles.disabledText]}>
        {icon && `${icon} `}{title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.neutrals.lightGray,
    shadowOpacity: 0.1,
  },
  disabledText: {
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
  },
});

export default KidsPlayfulButton;
