import designSystemData from './kidszooDesignSystem.json';

export interface ColorPalette {
  backgroundLight: string;
  backgroundWhite: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  logoPurple: string;
  logoPink: string;
  logoOrange: string;
  logoGreen: string;
  logoBlue: string;
  logoYellow: string;
  logoRed: string;
  accentBlue: string;
  accentGreen: string;
  accentYellow: string;
  accentPink: string;
  accentPurple: string;
  accentOrange: string;
  accentTeal: string;
  accentRed: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonSuccess: string;
  buttonWarning: string;
  buttonDanger: string;
  inputBackground: string;
  inputBorder: string;
  inputFocus: string;
  cardBackground: string;
  shadowColor: string;
  borderLight: string;
  successGreen: string;
  warningOrange: string;
  errorRed: string;
  infoBlue: string;
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
  circle: number;
}

export interface TypographyStyle {
  fontSize: number;
  fontWeight: string;
  color?: string;
  fontFamily?: string;
  textDecorationLine?: 'none' | 'underline' | 'line-through';
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface Typography {
  logo: TypographyStyle;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  body: TypographyStyle;
  bodyLarge: TypographyStyle;
  small: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
  buttonSmall: TypographyStyle;
  link: TypographyStyle;
  linkSmall: TypographyStyle;
  inputLabel: TypographyStyle;
  inputText: TypographyStyle;
  placeholder: TypographyStyle;
  categoryTitle: TypographyStyle;
  categorySubtitle: TypographyStyle;
  largeLetter: TypographyStyle;
  letterAssociation: TypographyStyle;
  alphabetSidebar: TypographyStyle;
  instruction: TypographyStyle;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  soft: ShadowStyle;
  medium: ShadowStyle;
  large: ShadowStyle;
  card: ShadowStyle;
}

export interface ComponentStyles {
  screenContainer: any;
  header: any;
  headerTitle: any;
  headerIcon: any;
  logo: any;
  inputField: any;
  inputFieldFocused: any;
  primaryButton: any;
  secondaryButton: any;
  successButton: any;
  categoryCard: any;
  categoryIcon: any;
  categoryTitle: any;
  categorySubtitle: any;
  largeLetterCard: any;
  largeLetter: any;
  letterAssociation: any;
  alphabetSidebar: any;
  alphabetItem: any;
  alphabetText: any;
  instructionText: any;
  profileHeader: any;
  profileAvatar: any;
  profileName: any;
  profileSubtitle: any;
  coinDisplay: any;
  coinText: any;
  bottomNavigation: any;
  navTab: any;
  navTabActive: any;
  navTabIcon: any;
  navTabText: any;
  navTabTextActive: any;
  navTabTextInactive: any;
  storyCard: any;
  storyTitle: any;
  storySummary: any;
  storyMeta: any;
  storyMetaLeft: any;
  storyMetaText: any;
  bookmarkButton: any;
  bookmarkIcon: any;
  emptyState: any;
  emptyStateIcon: any;
  emptyStateTitle: any;
  emptyStateSubtitle: any;
  sectionHeader: any;
  sectionTitle: any;
  seeAllButton: any;
  seeAllText: any;
  categoryGrid: any;
  categoryGridItem: any;
  achievementCard: any;
  achievementIcon: any;
  achievementTitle: any;
  achievementDescription: any;
  profileItem: any;
  profileItemLeft: any;
  profileItemIcon: any;
  profileItemText: any;
  profileItemTitle: any;
  profileItemSubtitle: any;
  profileItemRight: any;
  toggleSwitch: any;
  toggleThumb: any;
  videoCard: any;
  videoThumbnail: any;
  playButton: any;
  playButtonText: any;
  videoTitle: any;
  videoDescription: any;
  watchButton: any;
  watchButtonText: any;
  generateButton: any;
  generateButtonText: any;
}

export interface Layouts {
  container: any;
  content: any;
  centered: any;
  row: any;
  rowSpaceBetween: any;
  column: any;
  grid2: any;
  grid3: any;
}

export interface Animations {
  fadeIn: any;
  fadeOut: any;
  scaleIn: any;
  scaleOut: any;
}

export interface Illustrations {
  dinosaurScene: {
    description: string;
    colors: string[];
  };
  learningIcons: {
    numbers: string;
    reading: string;
    shapes: string;
    vocabulary: string;
    analysis: string;
    settings: string;
  };
  alphabetColors: { [key: string]: string };
}

export interface KidszooDesignSystem {
  colors: ColorPalette;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
  components: ComponentStyles;
  layouts: Layouts;
  animations: Animations;
  illustrations: Illustrations;
}

export const kidszooDesignSystem: KidszooDesignSystem = designSystemData as KidszooDesignSystem;
