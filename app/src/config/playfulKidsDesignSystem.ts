import playfulKidsDesignSystemJSON from './playfulKidsDesignSystem.json';

export interface PlayfulKidsDesignSystem {
  name: string;
  description: string;
  colors: {
    primary: {
      orange: string;
      yellow: string;
      amber: string;
      tangerine: string;
    };
    secondary: {
      peach: string;
      cream: string;
      lightYellow: string;
      beige: string;
    };
    accent: {
      coral: string;
      mint: string;
      skyBlue: string;
      lavender: string;
      pink: string;
      green: string;
    };
    ui: {
      background: string;
      surface: string;
      surfaceAlt: string;
      border: string;
      divider: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      onPrimary: string;
      onAccent: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      display: string;
    };
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
      display: number;
    };
    weights: {
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    huge: number;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    round: number;
    pill: number;
  };
  shadows: {
    [key: string]: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  components: any;
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
      spring: string;
    };
  };
  layout: {
    containerPadding: number;
    screenPadding: number;
    cardSpacing: number;
    listSpacing: number;
    gridColumns: number;
    aspectRatios: {
      card: number;
      thumbnail: number;
      hero: number;
    };
  };
  icons: {
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    style: string;
  };
}

export const playfulKidsDesignSystem: PlayfulKidsDesignSystem = playfulKidsDesignSystemJSON as PlayfulKidsDesignSystem;
