export interface KidsFriendlyDesignSystem {
  designSystemName: string;
  version: string;
  targetAudience: string;
  
  colorPalette: {
    primary: {
      orange: string;
      brightOrange: string;
      coral: string;
      warmOrange: string;
    };
    secondary: {
      skyBlue: string;
      lightBlue: string;
      mint: string;
      lavender: string;
    };
    backgrounds: {
      cream: string;
      lightPeach: string;
      softYellow: string;
      paleBlue: string;
      lightPink: string;
    };
    neutrals: {
      darkBrown: string;
      mediumBrown: string;
      lightGray: string;
      white: string;
    };
    accents: {
      brightGreen: string;
      sunYellow: string;
      hotPink: string;
      purple: string;
    };
  };
  
  typography: {
    fontFamilies: {
      primary: string;
      secondary: string;
      fallback: string;
    };
    fontSizes: {
      hero: number;
      title: number;
      subtitle: number;
      body: number;
      caption: number;
      small: number;
    };
    fontWeights: {
      regular: number;
      medium: number;
      bold: number;
      extraBold: number;
    };
    characteristics: {
      rounded: boolean;
      playful: boolean;
      highReadability: boolean;
      childFriendly: boolean;
    };
  };
  
  spacing: {
    base: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    generous: boolean;
    breathingRoom: boolean;
  };
  
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    extraLarge: number;
    pill: number;
    characteristic: string;
  };
  
  shadows: {
    soft: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
    playful: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
  };
  
  components: {
    buttons: {
      primary: {
        backgroundColor: string;
        borderRadius: number;
        paddingVertical: number;
        paddingHorizontal: number;
        shadowEnabled: boolean;
        textColor: string;
        fontSize: number;
        fontWeight: string;
        characteristics: string[];
      };
      playButton: {
        backgroundColor: string;
        shape: string;
        size: number;
        iconColor: string;
        shadowEnabled: boolean;
        characteristics: string[];
      };
    };
    
    cards: {
      content: {
        backgroundColor: string;
        borderRadius: number;
        padding: number;
        shadowEnabled: boolean;
        borderWidth: number;
        characteristics: string[];
      };
      story: {
        backgroundColor: string;
        gradientColors: string[];
        borderRadius: number;
        padding: number;
        imageRadius: number;
        characteristics: string[];
      };
    };
    
    navigation: {
      tabBar: {
        backgroundColor: string;
        borderRadius: number;
        height: number;
        shadowEnabled: boolean;
        iconSize: number;
        activeColor: string;
        inactiveColor: string;
        characteristics: string[];
      };
    };
    
    illustrations: {
      style: string;
      characteristics: string[];
      placement: string[];
      animalCharacters: boolean;
      humanCharacters: boolean;
      abstractShapes: boolean;
    };
  };
  
  layoutPrinciples: {
    spacing: string;
    hierarchy: string;
    touchTargets: string;
    contentDensity: string;
    visualComplexity: string;
    characteristics: string[];
  };
  
  iconography: {
    style: string;
    strokeWidth: string;
    fillStyle: string;
    size: string;
    characteristics: string[];
  };
  
  interactions: {
    feedback: {
      haptic: string;
      visual: string;
      audio: string;
    };
    animations: {
      duration: string;
      easing: string;
      characteristics: string[];
    };
  };
  
  accessibility: {
    contrast: string;
    textSize: string;
    touchTargets: string;
    simplicity: string;
    readability: string;
  };
  
  contentPresentation: {
    images: {
      style: string;
      borderRadius: string;
      aspectRatio: string;
      characteristics: string[];
    };
    text: {
      lineHeight: number;
      paragraphSpacing: string;
      characteristics: string[];
    };
  };
  
  specialElements: {
    characters: {
      mascot: {
        style: string;
        placement: string;
        characteristics: string[];
      };
    };
    badges: {
      achievement: {
        shape: string;
        colors: string;
        size: string;
        characteristics: string[];
      };
    };
    progressIndicators: {
      style: string;
      shape: string;
      characteristics: string[];
    };
  };
  
  designPhilosophy: {
    core: string;
    principles: string[];
  };
}

// Import the actual design system
import kidsFriendlyDesignSystemData from './kidsFriendlyDesignSystem.json';

export const kidsFriendlyDesignSystem: KidsFriendlyDesignSystem = kidsFriendlyDesignSystemData as KidsFriendlyDesignSystem;
