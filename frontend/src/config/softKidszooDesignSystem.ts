import designSystemData from './softKidszooDesignSystem.json';

export interface SoftColorPalette {
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundCard: string;
  backgroundInput: string;
  backgroundButton: string;
  backgroundButtonSecondary: string;
  backgroundAccent: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textButton: string;
  textLink: string;
  borderLight: string;
  borderMedium: string;
  borderFocus: string;
  shadowSoft: string;
  accentPink: string;
  accentBlue: string;
  accentGreen: string;
  accentOrange: string;
  accentPurple: string;
  accentYellow: string;
  accentTeal: string;
  accentCoral: string;
  accentMint: string;
  accentLavender: string;
  accentPeach: string;
  accentSky: string;
  accentLime: string;
  accentRose: string;
  accentAqua: string;
  accentLilac: string;
  accentCream: string;
  accentPowder: string;
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
  bodySmall: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
  buttonSmall: TypographyStyle;
  link: TypographyStyle;
  inputLabel: TypographyStyle;
  inputText: TypographyStyle;
  placeholder: TypographyStyle;
  categoryTitle: TypographyStyle;
  categorySubtitle: TypographyStyle;
  greeting: TypographyStyle;
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
  contentContainer: any;
  header: any;
  logo: any;
  greeting: any;
  inputField: any;
  inputFieldFocused: any;
  primaryButton: any;
  secondaryButton: any;
  categoryCard: any;
  categoryIcon: any;
  categoryTitle: any;
  categorySubtitle: any;
  storyCard: any;
  storyTitle: any;
  storySummary: any;
  storyMeta: any;
  storyMetaLeft: any;
  storyMetaText: any;
  bookmarkButton: any;
  bookmarkIcon: any;
  badge: any;
  badgeText: any;
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
  bottomNavigation: any;
  navTab: any;
  navTabActive: any;
  navTabIcon: any;
  navTabText: any;
  navTabTextActive: any;
  navTabTextInactive: any;
  profileHeader: any;
  profileAvatar: any;
  profileAvatarText: any;
  profileName: any;
  profileSubtitle: any;
  coinDisplay: any;
  coinIcon: any;
  coinText: any;
  profileItem: any;
  profileItemLeft: any;
  profileItemIcon: any;
  profileItemText: any;
  profileItemTitle: any;
  profileItemSubtitle: any;
  profileItemRight: any;
  achievementCard: any;
  achievementIcon: any;
  achievementTitle: any;
  achievementDescription: any;
  libraryTabs: any;
  libraryTab: any;
  libraryTabText: any;
  instructionText: any;
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

export interface SoftKidszooDesignSystem {
  colors: SoftColorPalette;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
  components: ComponentStyles;
  layouts: Layouts;
  animations: Animations;
  illustrations: Illustrations;
}

export const softKidszooDesignSystem: SoftKidszooDesignSystem = designSystemData as SoftKidszooDesignSystem;
