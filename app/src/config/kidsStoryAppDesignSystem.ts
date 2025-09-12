import designSystemData from './kidsStoryAppDesignSystem.json';

export interface ColorPalette {
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundCard: string;
  backgroundOverlay: string;
  backgroundGradientStart: string;
  backgroundGradientEnd: string;
  primaryOrange: string;
  primaryPink: string;
  primaryPurple: string;
  primaryBlue: string;
  primaryGreen: string;
  primaryYellow: string;
  primaryRed: string;
  accentCoral: string;
  accentPeach: string;
  accentLavender: string;
  accentMint: string;
  accentSky: string;
  accentLemon: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnDark: string;
  textOnLight: string;
  borderLight: string;
  borderMedium: string;
  borderDark: string;
  shadowColor: string;
  successGreen: string;
  warningYellow: string;
  errorRed: string;
  infoBlue: string;
}

export interface Spacing {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
}

export interface BorderRadius {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  round: number;
  circle: number;
}

export interface Typography {
  fontFamilies: {
    primary: string;
    secondary: string;
    mono: string;
  };
  sizes: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    huge: number;
    giant: number;
  };
  weights: {
    light: string;
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
    loose: number;
  };
  styles: {
    h1: any;
    h2: any;
    h3: any;
    body: any;
    bodySmall: any;
    caption: any;
    button: any;
    buttonSmall: any;
  };
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  none: Shadow;
  xs: Shadow;
  sm: Shadow;
  md: Shadow;
  lg: Shadow;
  xl: Shadow;
}

export interface Components {
  screen: any;
  header: any;
  searchBar: any;
  searchInput: any;
  searchIcon: any;
  categoryPill: any;
  categoryPillActive: any;
  categoryIcon: any;
  categoryText: any;
  categoryTextActive: any;
  storyCard: any;
  storyCardLarge: any;
  storyImage: any;
  storyImageLarge: any;
  storyContent: any;
  storyTitle: any;
  storyDescription: any;
  storyMeta: any;
  storyMetaItem: any;
  storyMetaIcon: any;
  storyMetaText: any;
  playButton: any;
  playIcon: any;
  bottomNav: any;
  navItem: any;
  navItemActive: any;
  navIcon: any;
  navIconActive: any;
  navText: any;
  navTextActive: any;
  profileHeader: any;
  profileAvatar: any;
  profileName: any;
  profileGreeting: any;
  welcomeCard: any;
  welcomeText: any;
  welcomeTitle: any;
  welcomeSubtitle: any;
  welcomeImage: any;
  sectionHeader: any;
  sectionTitle: any;
  sectionLink: any;
  emptyState: any;
  emptyIcon: any;
  emptyTitle: any;
  emptyDescription: any;
  primaryButton: any;
  primaryButtonText: any;
  secondaryButton: any;
  secondaryButtonText: any;
  characterIllustration: any;
}

export interface Animations {
  fadeIn: any;
  slideUp: any;
  scaleIn: any;
  bounce: any;
}

export interface Illustrations {
  characters: {
    girl: string;
    boy: string;
    woman: string;
    man: string;
    robot: string;
    alien: string;
    unicorn: string;
    dragon: string;
  };
  categories: {
    [key: string]: {
      icon: string;
      color: string;
    };
  };
}

export interface Layouts {
  container: any;
  scrollContainer: any;
  contentPadding: any;
  row: any;
  rowBetween: any;
  center: any;
  grid: any;
  gridItem: any;
}

export interface KidsStoryAppDesignSystem {
  colors: ColorPalette;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
  components: Components;
  animations: Animations;
  illustrations: Illustrations;
  layouts: Layouts;
}

export const kidsStoryAppDesignSystem: KidsStoryAppDesignSystem = designSystemData as KidsStoryAppDesignSystem;
