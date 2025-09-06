import { Platform } from 'react-native';

// Color System
export const COLORS = {
  primary: {
    main: '#007AFF',
    light: '#47A3FF',
    dark: '#0056B3'
  },
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    highlight: '#FEF3C7'
  },
  text: {
    primary: '#000000',
    secondary: '#6B7280',
    light: '#9CA3AF',
    inverse: '#FFFFFF'
  },
  category: {
    tech: '#6366F1',
    environment: '#10B981',
    science: '#8B5CF6',
    space: '#F59E0B'
  },
  card: {
    background: '#FFFFFF',
    border: '#F1F5F9',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  status: {
    live: '#EF4444',
    new: '#10B981'
  }
};

// Typography
export const TYPOGRAPHY = {
  fonts: Platform.select({
    ios: {
      regular: 'SF Pro Text',
      medium: 'SF Pro Text',
      semibold: 'SF Pro Text',
      bold: 'SF Pro Display',
      heavy: 'SF Pro Display'
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      semibold: 'Roboto-Bold',
      bold: 'Roboto-Bold',
      heavy: 'Roboto-Black'
    }
  }),
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12
  },
  lineHeights: {
    h1: 40,
    h2: 32,
    h3: 28,
    body: 24,
    caption: 20,
    small: 16
  }
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  layout: {
    screenPadding: 20,
    cardPadding: 16,
    elementSpacing: 12,
    sectionSpacing: 24
  }
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  large: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8
  }
};

// Layout
export const LAYOUT = {
  header: {
    height: 44,
    buttonSize: 32
  },
  card: {
    featured: {
      aspectRatio: 16 / 9,
      titleLines: 2
    },
    standard: {
      height: 120,
      imageWidth: 120
    },
    compact: {
      height: 72,
      imageWidth: 56
    }
  },
  author: {
    avatarSize: 32,
    compactAvatarSize: 24
  }
};

// Animation Presets
export const ANIMATION = {
  timing: {
    quick: 200,
    normal: 300,
    slow: 500
  },
  spring: {
    gentle: {
      tension: 170,
      friction: 26
    },
    bouncy: {
      tension: 200,
      friction: 20
    }
  }
};