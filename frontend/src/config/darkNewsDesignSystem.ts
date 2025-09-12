import darkNewsDesignSystemJSON from './darkNewsDesignSystem.json';

// TypeScript interfaces for the dark news design system
export interface DarkDesignSystem {
  colors: {
    backgrounds: {
      primary: string;
      secondary: string;
      elevated: string;
      card: string;
      overlay: string;
      modalOverlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      accent: string;
      link: string;
    };
    accent: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    status: Record<string, string>;
    categories: Record<string, string>;
    interactive: {
      buttonPrimary: string;
      buttonSecondary: string;
      buttonDanger: string;
      buttonSuccess: string;
      hover: string;
      pressed: string;
      focus: string;
    };
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
  interactions: Record<string, any>;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// Export the typed dark design system
export const DarkDS: DarkDesignSystem = darkNewsDesignSystemJSON.darkNewsDesignSystem as DarkDesignSystem;

// Helper functions for consistent styling
export const getDarkSpacing = (size: keyof typeof DarkDS.spacing): number => DarkDS.spacing[size];
export const getDarkFontSize = (size: keyof typeof DarkDS.typography.sizes): number => DarkDS.typography.sizes[size];
export const getDarkBorderRadius = (size: keyof typeof DarkDS.borderRadius): number => DarkDS.borderRadius[size];
export const getDarkShadow = (size: 'sm' | 'md' | 'lg' | 'xl'): Shadow => DarkDS.shadows[size];

// Category color helper
export const getDarkCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return DarkDS.colors.categories[normalizedCategory] || DarkDS.colors.accent.primary;
};

// Status color helper
export const getDarkStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return DarkDS.colors.status[normalizedStatus] || DarkDS.colors.accent.primary;
};
