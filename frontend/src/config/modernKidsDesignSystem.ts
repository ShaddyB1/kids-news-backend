export interface ModernKidsDesignSystem {
  colors: {
    primaryBlue: string;
    secondaryOrange: string;
    accentGreen: string;
    accentPurple: string;
    accentYellow: string;
    accentPink: string;
    backgroundLight: string;
    backgroundWhite: string;
    backgroundGray: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    textLight: string;
    textWhite: string;
    borderLight: string;
    shadowColor: string;
    successGreen: string;
    warningOrange: string;
    errorRed: string;
    coinGold: string;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    button: TextStyle;
    tabLabel: TextStyle;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    round: number;
    circle: number;
  };
  shadows: {
    none: ShadowStyle;
    soft: ShadowStyle;
    medium: ShadowStyle;
    strong: ShadowStyle;
  };
  components: {
    profileHeader: ComponentStyle;
    greeting: ComponentStyle;
    searchBar: ComponentStyle;
    categoryGrid: ComponentStyle;
    categoryCard: ComponentStyle;
    storyCard: ComponentStyle;
    videoCard: ComponentStyle;
    button: {
      primary: ComponentStyle;
      secondary: ComponentStyle;
      outline: ComponentStyle;
      small: ComponentStyle;
    };
    badge: {
      breaking: ComponentStyle;
      trending: ComponentStyle;
      hot: ComponentStyle;
      achievement: ComponentStyle;
    };
    navigation: ComponentStyle;
    sectionHeader: ComponentStyle;
    emptyState: ComponentStyle;
    loadingSpinner: ComponentStyle;
    progressBar: ComponentStyle;
  };
  layouts: {
    screenPadding: number;
    headerHeight: number;
    contentMarginTop: number;
    sectionSpacing: number;
    itemSpacing: number;
    gridSpacing: number;
  };
  icons: {
    [key: string]: string;
  };
  animations: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  breakpoints: {
    small: number;
    medium: number;
    large: number;
  };
}

interface TextStyle {
  fontSize: number;
  fontWeight: string;
  color: string;
  lineHeight: number;
}

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

interface ComponentStyle {
  [key: string]: any;
}

// Import the design system
import designSystemData from './modernKidsDesignSystem.json';
export const modernKidsDesignSystem: ModernKidsDesignSystem = designSystemData as ModernKidsDesignSystem;
