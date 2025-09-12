import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { kidsFriendlyDesignSystem } from '../config/kidsFriendlyDesignSystem';

interface KidsCharacterMascotProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  character?: 'owl' | 'fox' | 'bear' | 'rabbit';
}

const KidsCharacterMascot: React.FC<KidsCharacterMascotProps> = ({
  message = "Hi there! Ready for some news?",
  size = 'medium',
  character = 'owl'
}) => {
  const getCharacterEmoji = () => {
    switch (character) {
      case 'owl': return '🦉';
      case 'fox': return '🦊';
      case 'bear': return '🐻';
      case 'rabbit': return '🐰';
      default: return '🦉';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: 40, containerPadding: 12 };
      case 'medium':
        return { fontSize: 60, containerPadding: 16 };
      case 'large':
        return { fontSize: 80, containerPadding: 20 };
      default:
        return { fontSize: 60, containerPadding: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, { padding: sizeStyles.containerPadding }]}>
      <View style={styles.characterContainer}>
        <Text style={[styles.character, { fontSize: sizeStyles.fontSize }]}>
          {getCharacterEmoji()}
        </Text>
        <View style={styles.speechBubble}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.speechTail} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: kidsFriendlyDesignSystem.spacing.md,
  },
  characterContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  character: {
    marginBottom: kidsFriendlyDesignSystem.spacing.sm,
  },
  speechBubble: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.medium,
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
    maxWidth: 250,
    position: 'relative',
    ...kidsFriendlyDesignSystem.shadows.soft,
    shadowColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
    shadowOpacity: 0.1,
  },
  message: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
    textAlign: 'center',
    lineHeight: kidsFriendlyDesignSystem.contentPresentation.text.lineHeight * kidsFriendlyDesignSystem.typography.fontSizes.body,
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
  },
});

export default KidsCharacterMascot;
