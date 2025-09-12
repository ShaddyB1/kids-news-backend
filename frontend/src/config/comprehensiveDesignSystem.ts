/**
 * Comprehensive Design System for Kids Story App
 * Based on visual analysis of provided screenshots
 */

export interface ColorPalette {
  primary: {
    orange: string;
    coral: string;
    warmOrange: string;
  };
  secondary: {
    teal: string;
    mint: string;
    skyBlue: string;
    lavender: string;
  };
  backgrounds: {
    cream: string;
    lightPeach: string;
    softWhite: string;
    gradientStart: string;
    gradientEnd: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
    white: string;
  };
  accents: {
    success: string;
    warning: string;
    info: string;
    error: string;
  };
  categoryColors: {
    animals: string;
    science: string;
    space: string;
    adventure: string;
    magic: string;
    heroes: string;
    fantasy: string;
  };
}

export interface Typography {
  fontFamily: {
    primary: string;
    rounded: string;
    playful: string;
  };
  sizes: {
    hero: number;
    title: number;
    subtitle: number;
    body: number;
    caption: number;
    small: number;
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
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadius {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
  round: number;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ButtonStyle {
  backgroundColor: string;
  borderRadius: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  shadow?: string;
  alignItems?: string;
  justifyContent?: string;
  pressedOpacity?: number;
}

export interface CardStyle {
  backgroundColor: string;
  borderRadius: number;
  padding?: number;
  marginBottom?: number;
  shadow?: string;
  minHeight?: number;
  flexDirection?: string;
  alignItems?: string;
  minWidth?: number;
}

export interface Components {
  buttons: {
    primary: ButtonStyle;
    secondary: ButtonStyle;
    play: ButtonStyle;
    small: ButtonStyle;
  };
  cards: {
    story: CardStyle;
    category: CardStyle;
    video: CardStyle;
    progress: CardStyle;
  };
  illustrations: {
    mascot: {
      size: number;
      marginBottom: number;
      character: string;
    };
    storyThumbnail: {
      width: string;
      height: number;
      borderRadius: number;
      marginBottom: number;
      backgroundColor: string;
    };
    categoryIcon: {
      width: number;
      height: number;
      borderRadius: number;
      alignItems: string;
      justifyContent: string;
      marginBottom: number;
    };
  };
  navigation: any;
  search: any;
  badges: any;
  speechBubble: any;
  progressBar: any;
  progressFill: any;
}

export interface Layouts {
  screen: {
    flex: number;
    backgroundColor: string;
  };
  container: {
    paddingHorizontal: number;
    paddingTop: number;
  };
  header: {
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    paddingHorizontal: number;
    paddingTop: number;
    paddingBottom: number;
  };
  content: {
    flex: number;
    paddingHorizontal: number;
  };
  section: {
    marginBottom: number;
  };
  row: {
    flexDirection: string;
    alignItems: string;
  };
  center: {
    alignItems: string;
    justifyContent: string;
  };
}

export interface IconMapping {
  categories: {
    [key: string]: string;
  };
  actions: {
    [key: string]: string;
  };
  emotions: {
    [key: string]: string;
  };
}

export interface ComprehensiveDesignSystem {
  metadata: {
    name: string;
    version: string;
    description: string;
    targetAge: string;
  };
  colorPalette: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: {
    soft: Shadow;
    medium: Shadow;
    strong: Shadow;
  };
  components: Components;
  layouts: Layouts;
  animations: any;
  iconMapping: IconMapping;
  contentStructure: any;
  responsiveBreakpoints: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  accessibility: {
    minTouchTarget: number;
    contrastRatio: number;
    fontSize: {
      minimum: number;
      comfortable: number;
    };
  };
}

// Import the JSON and cast it to our interface
import designSystemData from './comprehensiveDesignSystem.json';
export const DS = designSystemData as ComprehensiveDesignSystem;

// Convenience exports
export const Colors = DS.colorPalette;
export const Typography = DS.typography;
export const Spacing = DS.spacing;
export const BorderRadius = DS.borderRadius;
export const Shadows = DS.shadows;
export const Components = DS.components;
export const Layouts = DS.layouts;
export const Icons = DS.iconMapping;
