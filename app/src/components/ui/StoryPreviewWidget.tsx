import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface StoryPreview {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  duration: string;
  category: 'science' | 'environment' | 'technology' | 'health' | 'space';
  ageGroup: '6-8' | '9-12';
  isNew: boolean;
  videoPath?: string;
  hasYouTubeShort?: boolean;
}

interface StoryPreviewWidgetProps {
  stories: StoryPreview[];
  onStorySelect: (story: StoryPreview) => void;
  onPlayVideo?: (videoPath: string) => void;
  maxVisible?: number;
}

const StoryPreviewWidget: React.FC<StoryPreviewWidgetProps> = ({
  stories,
  onStorySelect,
  onPlayVideo,
  maxVisible = 5,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const getCategoryColor = (category: string): string[] => {
    switch (category) {
      case 'science':
        return ['#4A90E2', '#7BB3F0'];
      case 'environment':
        return ['#50C878', '#7ED321'];
      case 'technology':
        return ['#9013FE', '#B388FF'];
      case 'health':
        return ['#FF6B6B', '#FF8A80'];
      case 'space':
        return ['#1A1A2E', '#16213E'];
      default:
        return [COLORS.primary, COLORS.secondary];
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'science':
        return 'flask-outline';
      case 'environment':
        return 'leaf-outline';
      case 'technology':
        return 'hardware-chip-outline';
      case 'health':
        return 'heart-outline';
      case 'space':
        return 'rocket-outline';
      default:
        return 'book-outline';
    }
  };

  const handleStoryPress = (story: StoryPreview) => {
    setSelectedStory(story.id);
    onStorySelect(story);
  };

  const handleVideoPlay = (story: StoryPreview) => {
    if (story.videoPath && onPlayVideo) {
      onPlayVideo(story.videoPath);
    } else {
      Alert.alert(
        'Video Coming Soon',
        'This story video is being generated with Leonardo.ai illustrations!',
        [{ text: 'OK' }]
      );
    }
  };

  const renderStoryCard = (story: StoryPreview, index: number) => {
    const categoryColors = getCategoryColor(story.category);
    const isSelected = selectedStory === story.id;

    return (
      <TouchableOpacity
        key={story.id}
        style={[styles.storyCard, isSelected && styles.selectedCard]}
        onPress={() => handleStoryPress(story)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={categoryColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* New Badge */}
          {story.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}

          {/* Category Icon */}
          <View style={styles.categoryIconContainer}>
            <Ionicons
              name={getCategoryIcon(story.category) as any}
              size={24}
              color="white"
            />
          </View>

          {/* Story Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.storyTitle} numberOfLines={2}>
                {story.title}
              </Text>
              <Text style={styles.ageGroup}>{story.ageGroup}</Text>
            </View>

            <Text style={styles.storySummary} numberOfLines={3}>
              {story.summary}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.durationContainer}>
                <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.duration}>{story.duration}</Text>
              </View>

              <View style={styles.actionButtons}>
                {story.hasYouTubeShort && (
                  <TouchableOpacity style={styles.shortButton}>
                    <Ionicons name="play-circle-outline" size={20} color="white" />
                    <Text style={styles.shortButtonText}>Short</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handleVideoPlay(story)}
                >
                  <Ionicons name="play" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Leonardo.ai Badge */}
          <View style={styles.leonardoBadge}>
            <Text style={styles.leonardoBadgeText}>🎨 Leonardo.ai</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Story Previews</Text>
        <Text style={styles.headerSubtitle}>
          Illustrated with Leonardo.ai • Junior News Digest
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={width * 0.8 + 16}
      >
        {stories.slice(0, maxVisible).map((story, index) => 
          renderStoryCard(story, index)
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating Leonardo.ai illustrations...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  storyCard: {
    width: width * 0.8,
    height: 280,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
    elevation: 12,
    shadowOpacity: 0.4,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  categoryIconContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 60,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storyTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    lineHeight: 22,
  },
  ageGroup: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  storySummary: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  shortButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  playButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leonardoBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  leonardoBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default StoryPreviewWidget;
