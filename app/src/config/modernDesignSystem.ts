import modernDesignSystemJSON from './modernDesignSystem.json';

// TypeScript interfaces for the modern design system
export interface ColorWithGradient {
  main: string;
  light: string;
  dark?: string;
  gradient?: string;
}

export interface CategoryColor {
  main: string;
  light: string;
  gradient: string;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ModernDesignSystem {
  colors: {
    primary: ColorWithGradient;
    secondary: ColorWithGradient;
    accent: ColorWithGradient;
    background: {
      primary: string;
      secondary: string;
      elevated: string;
      overlay: string;
      gradient: string;
      darkMode: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      accent: string;
    };
    status: Record<string, string>;
    categories: Record<string, CategoryColor>;
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
    xs: Shadow;
    sm: Shadow;
    md: Shadow;
    lg: Shadow;
    xl: Shadow;
    floating: Shadow;
  };
  components: Record<string, any>;
  layouts: Record<string, any>;
  animations: Record<string, any>;
}

// Export the typed modern design system
export const MDS: ModernDesignSystem = modernDesignSystemJSON.modernDesignSystem as ModernDesignSystem;

// Helper functions for consistent styling
export const getModernSpacing = (size: keyof typeof MDS.spacing): number => MDS.spacing[size];
export const getModernFontSize = (size: keyof typeof MDS.typography.sizes): number => MDS.typography.sizes[size];
export const getModernBorderRadius = (size: keyof typeof MDS.borderRadius): number => MDS.borderRadius[size];
export const getModernShadow = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'floating'): Shadow => MDS.shadows[size];

// Category color helper with gradients
export const getModernCategoryColor = (category: string): CategoryColor => {
  const normalizedCategory = category.toLowerCase();
  return MDS.colors.categories[normalizedCategory] || {
    main: MDS.colors.primary.main,
    light: MDS.colors.primary.light,
    gradient: MDS.colors.primary.gradient || MDS.colors.primary.main
  };
};

// Gradient helper
export const getCategoryGradient = (category: string): string => {
  const categoryColor = getModernCategoryColor(category);
  return categoryColor.gradient;
};
