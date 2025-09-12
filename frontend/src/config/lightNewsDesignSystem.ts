import lightNewsDesignSystemJSON from './lightNewsDesignSystem.json';

// TypeScript interfaces for the light news design system
export interface LightDesignSystem {
  colors: {
    backgrounds: {
      primary: string;
      secondary: string;
      elevated: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    accent: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    interactive: {
      pressed: string;
      hover: string;
      focus: string;
      disabled: string;
    };
    borders: {
      primary: string;
      secondary: string;
      accent: string;
    };
    status: {
      live: string;
      trending: string;
      hot: string;
      new: string;
      breaking: string;
    };
  };
  typography: {
    fonts: {
      primary: string;
      secondary: string;
    };
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
      xxxxl: number;
      xxxxxl: number;
    };
    weights: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    xxxxl: number;
    xxxxxl: number;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    card: number;
    button: number;
    full: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

// Export the design system as a typed object
export const LightDS: LightDesignSystem = lightNewsDesignSystemJSON as LightDesignSystem;

// Helper functions for easy access to design tokens
export const getLightSpacing = (size: keyof LightDesignSystem['spacing']): number => {
  return LightDS.spacing[size];
};

export const getLightFontSize = (size: keyof LightDesignSystem['typography']['sizes']): number => {
  return LightDS.typography.sizes[size];
};

export const getLightBorderRadius = (size: keyof LightDesignSystem['borderRadius']): number => {
  return LightDS.borderRadius[size];
};

export const getLightShadow = (size: keyof LightDesignSystem['shadows']): object => {
  return LightDS.shadows[size];
};

export const getLightCategoryColor = (category: string): string => {
  const categoryColors: { [key: string]: string } = {
    'Technology': LightDS.colors.accent.info,
    'Science': LightDS.colors.accent.success,
    'Environment': LightDS.colors.accent.success,
    'Space': LightDS.colors.accent.primary,
    'Health': LightDS.colors.accent.error,
    'Education': LightDS.colors.accent.secondary,
    'Sports': LightDS.colors.accent.warning,
    'Arts': LightDS.colors.accent.secondary,
    'World': LightDS.colors.accent.primary,
    'Breaking': LightDS.colors.status.breaking,
  };
  
  return categoryColors[category] || LightDS.colors.accent.primary;
};

export const getLightStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'LIVE': LightDS.colors.status.live,
    'TRENDING': LightDS.colors.status.trending,
    'HOT': LightDS.colors.status.hot,
    'NEW': LightDS.colors.status.new,
    'BREAKING': LightDS.colors.status.breaking,
  };
  
  return statusColors[status] || LightDS.colors.accent.primary;
};

export default LightDS;
