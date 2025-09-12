import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { DarkDS, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkShadow, getDarkCategoryColor } from '../../config/darkNewsDesignSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerScreenProps {
  videoData: {
    id: string;
    title: string;
    category?: string;
    duration?: string;
    views?: string;
    uploadDate?: string;
    description?: string;
    author?: string;
    likes?: number;
    comments?: number;
  };
  onBack: () => void;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ videoData, onBack }) => {
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const video = useRef(null);

  const handlePlayPause = async () => {
    if (video.current) {
      if (isPlaying) {
        await video.current.pauseAsync();
      } else {
        await video.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would call an API
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would call an API
  };

  const handleShare = () => {
    // In a real app, this would open share dialog
    console.log('Sharing video:', videoData.title);
  };

  // Demo video URL - in production, this would come from your backend
  const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const categoryColor = getDarkCategoryColor(videoData.category || 'General');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Player</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: demoVideoUrl }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={(status) => setStatus(status)}
            shouldPlay={false}
          />
          
          {/* Custom Play Button Overlay (when video is paused) */}
          {!isPlaying && (
            <TouchableOpacity style={styles.playOverlay} onPress={handlePlayPause}>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Info */}
        <View style={styles.videoInfo}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoTitle}>{videoData.title}</Text>
            <View style={styles.videoMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {videoData.category?.toUpperCase() || 'GENERAL'}
                </Text>
              </View>
              <Text style={styles.videoStats}>
                👁 {videoData.views || '1.2K'} • 📅 {videoData.uploadDate || '2 days ago'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isLiked && styles.actionButtonActive]}
              onPress={handleLike}
            >
              <Text style={[styles.actionIcon, isLiked && styles.actionIconActive]}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
                {isLiked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, isBookmarked && styles.actionButtonActive]}
              onPress={handleBookmark}
            >
              <Text style={[styles.actionIcon, isBookmarked && styles.actionIconActive]}>
                {isBookmarked ? '🔖' : '📑'}
              </Text>
              <Text style={[styles.actionText, isBookmarked && styles.actionTextActive]}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Video Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About this video</Text>
            <Text style={styles.descriptionText}>
              {videoData.description || 
                `Join us for an amazing adventure as we explore ${videoData.title}! This educational video is perfect for young learners who want to discover more about ${videoData.category?.toLowerCase() || 'the world around us'}. Learn interesting facts, see incredible visuals, and expand your knowledge in a fun and engaging way!`
              }
            </Text>
            
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorEmoji}>👨‍🏫</Text>
              </View>
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>
                  {videoData.author || 'Junior News Team'}
                </Text>
                <Text style={styles.authorRole}>Educational Content Creator</Text>
              </View>
            </View>
          </View>

          {/* Engagement Stats */}
          <View style={styles.engagementSection}>
            <Text style={styles.engagementTitle}>Engagement</Text>
            <View style={styles.engagementStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{videoData.likes || '1.2K'}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{videoData.comments || '89'}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{videoData.views || '5.7K'}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>
          </View>

          {/* Educational Value */}
          <View style={styles.educationalSection}>
            <Text style={styles.educationalTitle}>🎓 Educational Value</Text>
            <View style={styles.educationalTags}>
              <View style={styles.educationalTag}>
                <Text style={styles.educationalTagText}>Age 6-12</Text>
              </View>
              <View style={styles.educationalTag}>
                <Text style={styles.educationalTagText}>Safe Content</Text>
              </View>
              <View style={styles.educationalTag}>
                <Text style={styles.educationalTagText}>Learning Fun</Text>
              </View>
              <View style={styles.educationalTag}>
                <Text style={styles.educationalTagText}>Parent Approved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkDS.colors.backgrounds.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: DarkDS.colors.backgrounds.elevated,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    ...getDarkShadow('sm'),
  },
  backIcon: {
    fontSize: getDarkFontSize('xl'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.bold,
  },
  headerTitle: {
    flex: 1,
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    textAlign: 'center',
    marginHorizontal: getDarkSpacing('md'),
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: DarkDS.colors.backgrounds.secondary,
  },
  video: {
    width: screenWidth,
    height: screenWidth * 0.5625, // 16:9 aspect ratio
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DarkDS.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...getDarkShadow('lg'),
  },
  playIcon: {
    fontSize: 32,
    marginLeft: 4, // Adjust for visual centering
  },
  videoInfo: {
    padding: getDarkSpacing('lg'),
  },
  videoHeader: {
    marginBottom: getDarkSpacing('lg'),
  },
  videoTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    lineHeight: getDarkFontSize('xl') * 1.3,
    marginBottom: getDarkSpacing('sm'),
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: getDarkSpacing('xs'),
    borderRadius: getDarkBorderRadius('sm'),
  },
  categoryText: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
  },
  videoStats: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: getDarkSpacing('lg'),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    marginBottom: getDarkSpacing('lg'),
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('sm'),
    paddingHorizontal: getDarkSpacing('md'),
    borderRadius: getDarkBorderRadius('md'),
    minWidth: 80,
  },
  actionButtonActive: {
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  actionIcon: {
    fontSize: getDarkFontSize('xl'),
    marginBottom: getDarkSpacing('xs'),
  },
  actionIconActive: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  actionTextActive: {
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.bold,
  },
  descriptionSection: {
    marginBottom: getDarkSpacing('xl'),
  },
  descriptionTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  descriptionText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('md') * 1.5,
    marginBottom: getDarkSpacing('lg'),
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    padding: getDarkSpacing('md'),
    borderRadius: getDarkBorderRadius('md'),
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DarkDS.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getDarkSpacing('md'),
  },
  authorEmoji: {
    fontSize: 24,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  authorRole: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
  },
  engagementSection: {
    marginBottom: getDarkSpacing('xl'),
  },
  engagementTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  engagementStats: {
    flexDirection: 'row',
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
    padding: getDarkSpacing('lg'),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: DarkDS.colors.backgrounds.secondary,
    marginHorizontal: getDarkSpacing('md'),
  },
  statNumber: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.accent.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  statLabel: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  educationalSection: {
    marginBottom: getDarkSpacing('xl'),
  },
  educationalTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  educationalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  educationalTag: {
    backgroundColor: DarkDS.colors.accent.success + '20',
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    borderRadius: getDarkBorderRadius('xl'),
    marginRight: getDarkSpacing('sm'),
    marginBottom: getDarkSpacing('sm'),
    borderWidth: 1,
    borderColor: DarkDS.colors.accent.success + '40',
  },
  educationalTagText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.success,
    fontWeight: DarkDS.typography.weights.semibold,
  },
  bottomSpacing: {
    height: getDarkSpacing('xxxxl'),
  },
});

export default VideoPlayerScreen;
