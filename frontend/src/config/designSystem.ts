import designSystemJSON from './designSystem.json';

// TypeScript interfaces for the design system
export interface ColorPalette {
  main: string;
  light: string;
  dark: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
  onDark: string;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface DesignSystem {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    background: {
      default: string;
      paper: string;
      elevated: string;
      overlay: string;
    };
    text: TextColors;
    status: Record<string, string>;
    categories: Record<string, string>;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    sizes: Record<string, number>;
    weights: Record<string, string>;
    lineHeights: Record<string, number>;
  };
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  shadows: {
    none: string;
    sm: Shadow;
    md: Shadow;
    lg: Shadow;
    xl: Shadow;
  };
  components: Record<string, any>;
  layouts: Record<string, any>;
  animations: Record<string, any>;
}

// Export the typed design system
export const DS: DesignSystem = designSystemJSON.designSystem as DesignSystem;

// Helper functions for consistent styling
export const getSpacing = (size: keyof typeof DS.spacing): number => DS.spacing[size];
export const getFontSize = (size: keyof typeof DS.typography.sizes): number => DS.typography.sizes[size];
export const getBorderRadius = (size: keyof typeof DS.borderRadius): number => DS.borderRadius[size];
export const getShadow = (size: 'sm' | 'md' | 'lg' | 'xl'): Shadow => DS.shadows[size];

// Category color helper
export const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return DS.colors.categories[normalizedCategory] || DS.colors.primary.main;
};
