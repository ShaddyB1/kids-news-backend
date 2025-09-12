import { ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface StoryCardProps {
  type?: 'featured' | 'standard' | 'compact';
  title: string;
  image: ImageSourcePropType;
  category: string;
  author: {
    name: string;
    avatar?: ImageSourcePropType;
    timestamp?: string;
  };
  isLive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export interface CategoryBadgeProps {
  category: string;
  color?: string;
  size?: 'small' | 'regular';
  style?: ViewStyle;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export interface AuthorBadgeProps {
  name: string;
  avatar?: ImageSourcePropType;
  timestamp?: string;
  size?: 'regular' | 'compact';
  style?: ViewStyle;
}
