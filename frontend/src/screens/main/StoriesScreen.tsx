import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Share,
  Platform,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, LAYOUT, TYPOGRAPHY } from '@constants/theme';
import { useAuth } from '@hooks/useAuth';
import { useAnimation } from '@hooks/useAnimation';
import { haptics } from '@utils/helpers/haptics';
import { stories } from '@data/stories';
import { StoryCard } from '@components/ui/StoryCard';
import { AuthorBadge } from '@components/ui/AuthorBadge';
import { CategoryBadge } from '@components/ui/CategoryBadge';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { ScreenNavigationProp } from '../types/navigation';

const HEADER_HEIGHT = 350;

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function StoriesScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { entitled } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<VideoType>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Rest of the component remains the same...
}