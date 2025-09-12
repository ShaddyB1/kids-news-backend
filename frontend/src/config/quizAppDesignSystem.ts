/**
 * Quiz App Design System
 * Based on modern educational quiz apps with gamification
 */

export interface QuizColorPalette {
  primary: {
    blue: string;
    lightBlue: string;
    darkBlue: string;
  };
  secondary: {
    pink: string;
    coral: string;
    purple: string;
    teal: string;
  };
  backgrounds: {
    primary: string;
    secondary: string;
    gradient: {
      start: string;
      end: string;
    };
    cardBackground: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
    white: string;
    accent: string;
  };
  gamification: {
    gold: string;
    silver: string;
    bronze: string;
    diamond: string;
    platinum: string;
    coins: string;
  };
  achievements: {
    blue: string;
    green: string;
    orange: string;
    red: string;
    purple: string;
    pink: string;
  };
}

export interface QuizTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    rounded: string;
  };
  sizes: {
    heroTitle: number;
    title: number;
    subtitle: number;
    body: number;
    caption: number;
    small: number;
    coins: number;
  };
  weights: {
    light: string;
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    heavy: string;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface QuizSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
}

export interface QuizShadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface QuizComponents {
  userProfile: {
    container: any;
    avatar: any;
    name: any;
    coins: any;
    badges: any;
  };
  gameCard: {
    container: any;
    illustration: any;
    title: any;
    subtitle: any;
    playButton: any;
  };
  categoryGrid: {
    container: any;
    categoryCard: any;
    icon: any;
    label: any;
  };
  coinSystem: {
    container: any;
    icon: any;
    amount: any;
    buyButton: any;
  };
  achievementBadge: {
    container: any;
    icon: any;
    label: any;
  };
  progressBar: {
    container: any;
    fill: any;
  };
  buttons: {
    primary: any;
    secondary: any;
    play: any;
    close: any;
  };
  navigation: {
    tabBar: any;
    tab: any;
    activeTab: any;
    tabIcon: any;
    tabLabel: any;
  };
}

export interface QuizDesignSystem {
  metadata: {
    name: string;
    version: string;
    description: string;
    targetAge: string;
    inspiration: string;
  };
  colorPalette: QuizColorPalette;
  typography: QuizTypography;
  spacing: QuizSpacing;
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    round: number;
    circle: string;
  };
  shadows: {
    subtle: QuizShadow;
    soft: QuizShadow;
    medium: QuizShadow;
    strong: QuizShadow;
  };
  components: QuizComponents;
  layouts: any;
  iconMapping: {
    categories: { [key: string]: string };
    achievements: { [key: string]: string };
    actions: { [key: string]: string };
  };
  gamification: {
    coinValues: {
      starter: number;
      medium: number;
      large: number;
    };
    badgeTypes: string[];
    achievementColors: string[];
  };
  animations: any;
  accessibility: {
    minTouchTarget: number;
    contrastRatio: number;
    fontSize: {
      minimum: number;
      comfortable: number;
    };
  };
}

// Import and export the design system
import quizDesignSystemData from './quizAppDesignSystem.json';
export const QuizDS = quizDesignSystemData as QuizDesignSystem;

// Convenience exports
export const QuizColors = QuizDS.colorPalette;
export const QuizTypo = QuizDS.typography;
export const QuizSpacing = QuizDS.spacing;
export const QuizShadows = QuizDS.shadows;
export const QuizComponents = QuizDS.components;
export const QuizLayouts = QuizDS.layouts;
export const QuizIcons = QuizDS.iconMapping;
