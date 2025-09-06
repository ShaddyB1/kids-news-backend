import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LightDS, getLightShadow, getLightSpacing, getLightFontSize, getLightBorderRadius } from '../../config/lightNewsDesignSystem';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  uploadDate: string;
  thumbnail: string;
  isLive?: boolean;
  isPremium?: boolean;
  isNew?: boolean;
}

interface GeneratedVideo {
  id: string;
  title: string;
  status: 'processing' | 'ready' | 'failed';
  progress?: number;
  estimatedTime?: string;
  createdAt: string;
  duration?: string;
}

const featuredVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Amazing Ocean Robot Saves Sea Animals',
    category: 'technology',
    duration: '7:32',
    views: '12.5K',
    uploadDate: '2 days ago',
    thumbnail: '🤖',
    isNew: true,
  },
  {
    id: '2',
    title: 'Young Scientists Discover New Butterfly Species',
    category: 'science',
    duration: '5:48',
    views: '8.3K',
    uploadDate: '4 days ago',
    thumbnail: '🦋',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Kids Build Solar-Powered School Bus',
    category: 'environment',
    duration: '6:15',
    views: '15.7K',
    uploadDate: '1 week ago',
    thumbnail: '🚌',
    isLive: true,
  },
];

const generatedVideos: GeneratedVideo[] = [
  {
    id: 'gen1',
    title: 'Climate Heroes: Kids Making a Difference',
    status: 'ready',
    duration: '7:23',
    createdAt: '3 hours ago',
  },
  {
    id: 'gen2',
    title: 'Space Exploration: Mars Mission Updates',
    status: 'processing',
    progress: 75,
    estimatedTime: '5 minutes',
    createdAt: '1 hour ago',
  },
  {
    id: 'gen3',
    title: 'Animal Rescue Stories from Around the World',
    status: 'ready',
    duration: '8:12',
    createdAt: '6 hours ago',
  },
];

const categoryVideos: VideoItem[] = [
  {
    id: '4',
    title: 'How Recycling Really Works',
    category: 'environment',
    duration: '4:22',
    views: '6.8K',
    uploadDate: '3 days ago',
    thumbnail: '♻️',
  },
  {
    id: '5',
    title: 'Meet the Teen Inventor Changing Lives',
    category: 'technology',
    duration: '9:15',
    views: '22.1K',
    uploadDate: '5 days ago',
    thumbnail: '💡',
  },
  {
    id: '6',
    title: 'Ancient Civilizations: What We Can Learn',
    category: 'history',
    duration: '11:33',
    views: '18.9K',
    uploadDate: '1 week ago',
    thumbnail: '🏛️',
  },
];

const categories = [
  { id: 'all', name: 'All', color: LightDS.colors.accent.primary },
  { id: 'technology', name: 'Tech', color: LightDS.colors.accent.primary },
  { id: 'science', name: 'Science', color: LightDS.colors.accent.secondary },
  { id: 'environment', name: 'Environment', color: LightDS.colors.accent.success },
  { id: 'history', name: 'History', color: LightDS.colors.accent.warning },
  { id: 'world', name: 'World', color: LightDS.colors.accent.info },
  { id: 'sports', name: 'Sports', color: LightDS.colors.accent.error },
];

interface LightVideosScreenProps {
  onVideoPress?: (videoData: any) => void;
}

const LightVideosScreen: React.FC<LightVideosScreenProps> = ({ onVideoPress }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleVideoPress = (video: VideoItem | GeneratedVideo) => {
    const videoData = {
      id: video.id,
      title: video.title,
      category: 'category' in video ? video.category : undefined,
      duration: 'duration' in video ? video.duration : undefined,
      views: 'views' in video ? video.views : undefined,
      uploadDate: 'uploadDate' in video ? video.uploadDate : 'createdAt' in video ? video.createdAt : undefined,
      description: `Watch this amazing ${video.title} video! Perfect for young learners.`,
      author: 'Junior News Team',
      likes: Math.floor(Math.random() * 5000) + 500,
      comments: Math.floor(Math.random() * 200) + 20,
    };
    
    if (onVideoPress) {
      onVideoPress(videoData);
    }
  };

  const renderFeaturedVideo = ({ item }: { item: VideoItem }) => {
    const getCategoryColor = (category: string) => {
      const cat = categories.find(c => c.id === category);
      return cat ? cat.color : LightDS.colors.accent.primary;
    };

    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity
        style={styles.featuredVideoCard}
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.videoThumbnail}>
          <Text style={styles.thumbnailEmoji}>{item.thumbnail}</Text>
          <View style={styles.videoDuration}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
          {item.isLive && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>🔴 LIVE</Text>
            </View>
          )}
          {item.isNew && (
            <View style={styles.newIndicator}>
              <Text style={styles.newText}>✨ NEW</Text>
            </View>
          )}
          {item.isPremium && (
            <View style={styles.premiumIndicator}>
              <Text style={styles.premiumText}>⭐ PRO</Text>
            </View>
          )}
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.videoMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.videoStats}>
              👁 {item.views} • 📅 {item.uploadDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGeneratedVideo = ({ item }: { item: GeneratedVideo }) => {
    return (
      <TouchableOpacity
        style={styles.generatedVideoCard}
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
        disabled={item.status !== 'ready'}
      >
        <View style={styles.generatedVideoHeader}>
          <View style={styles.generatedVideoIcon}>
            <Text style={styles.generatedIconText}>🎬</Text>
          </View>
          <View style={styles.generatedVideoInfo}>
            <Text style={styles.generatedVideoTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.generatedVideoDate}>
              Created {item.createdAt}
            </Text>
          </View>
          <View style={styles.generatedVideoStatus}>
            {item.status === 'ready' && (
              <View style={styles.statusReady}>
                <Text style={styles.statusText}>✅</Text>
              </View>
            )}
            {item.status === 'processing' && (
              <View style={styles.statusProcessing}>
                <Text style={styles.statusText}>⏳</Text>
              </View>
            )}
            {item.status === 'failed' && (
              <View style={styles.statusFailed}>
                <Text style={styles.statusText}>❌</Text>
              </View>
            )}
          </View>
        </View>
        
        {item.status === 'processing' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress || 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}% • {item.estimatedTime} remaining
            </Text>
          </View>
        )}
        
        {item.status === 'ready' && (
          <View style={styles.readyVideoActions}>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>▶️ Watch ({item.duration})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCategoryVideo = ({ item }: { item: VideoItem }) => {
    const getCategoryColor = (category: string) => {
      const cat = categories.find(c => c.id === category);
      return cat ? cat.color : LightDS.colors.accent.primary;
    };

    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity
        style={styles.categoryVideoCard}
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.categoryVideoThumbnail}>
          <Text style={styles.categoryThumbnailEmoji}>{item.thumbnail}</Text>
          <View style={styles.categoryVideoDuration}>
            <Text style={styles.categoryDurationText}>{item.duration}</Text>
          </View>
        </View>
        
        <View style={styles.categoryVideoInfo}>
          <Text style={styles.categoryVideoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.categoryVideoMeta}>
            <View style={[styles.smallCategoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.smallCategoryText, { color: categoryColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.categoryVideoStats}>
              {item.views} views • {item.uploadDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredVideos = activeCategory === 'all' 
    ? categoryVideos 
    : categoryVideos.filter(video => video.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={LightDS.colors.backgrounds.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>📺 Videos</Text>
              <Text style={styles.headerSubtitle}>Educational content for young minds</Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌟 Featured Videos</Text>
            <Text style={styles.sectionSubtitle}>Hand-picked educational content</Text>
          </View>
          
          <FlatList
            data={featuredVideos}
            renderItem={renderFeaturedVideo}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Generated Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎬 Custom Content</Text>
            <Text style={styles.sectionSubtitle}>Special videos created for you</Text>
          </View>
          
          {generatedVideos.map((video) => (
            <View key={video.id} style={styles.generatedVideoWrapper}>
              {renderGeneratedVideo({ item: video })}
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Browse by Category</Text>
            <Text style={styles.sectionSubtitle}>Find videos by topic</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  activeCategory === category.id && styles.activeCategoryChip,
                  { borderColor: category.color }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    activeCategory === category.id && styles.activeCategoryChipText,
                    { color: category.color }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.categoryVideos}>
            {filteredVideos.map((video) => (
              <View key={video.id} style={styles.categoryVideoWrapper}>
                {renderCategoryVideo({ item: video })}
              </View>
            ))}
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
    backgroundColor: LightDS.colors.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: getLightSpacing('lg'),
    backgroundColor: LightDS.colors.backgrounds.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: getLightFontSize('xxxl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  headerSubtitle: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    ...getLightShadow('sm'),
  },
  headerButtonText: {
    fontSize: getLightFontSize('xl'),
  },
  section: {
    marginBottom: getLightSpacing('xl'),
  },
  sectionHeader: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('md'),
  },
  sectionTitle: {
    fontSize: getLightFontSize('xl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  sectionSubtitle: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  horizontalList: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  featuredVideoCard: {
    width: 280,
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    marginRight: getLightSpacing('md'),
    overflow: 'hidden',
    ...getLightShadow('md'),
  },
  videoThumbnail: {
    height: 160,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 48,
  },
  videoDuration: {
    position: 'absolute',
    bottom: getLightSpacing('sm'),
    right: getLightSpacing('sm'),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  liveIndicator: {
    position: 'absolute',
    top: getLightSpacing('sm'),
    left: getLightSpacing('sm'),
    backgroundColor: LightDS.colors.status.live,
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  newIndicator: {
    position: 'absolute',
    top: getLightSpacing('sm'),
    right: getLightSpacing('sm'),
    backgroundColor: LightDS.colors.status.new,
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  newText: {
    color: '#FFFFFF',
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  premiumIndicator: {
    position: 'absolute',
    top: getLightSpacing('sm'),
    left: getLightSpacing('sm'),
    backgroundColor: LightDS.colors.status.trending,
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  videoInfo: {
    padding: getLightSpacing('md'),
  },
  videoTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('sm'),
    lineHeight: getLightFontSize('lg') * 1.3,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  categoryText: {
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  videoStats: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  generatedVideoWrapper: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('md'),
  },
  generatedVideoCard: {
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
  },
  generatedVideoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: getLightSpacing('sm'),
  },
  generatedVideoIcon: {
    width: 48,
    height: 48,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.accent.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('md'),
  },
  generatedIconText: {
    fontSize: 24,
  },
  generatedVideoInfo: {
    flex: 1,
  },
  generatedVideoTitle: {
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
    lineHeight: getLightFontSize('md') * 1.3,
  },
  generatedVideoDate: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  generatedVideoStatus: {
    marginLeft: getLightSpacing('sm'),
  },
  statusReady: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LightDS.colors.accent.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusProcessing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LightDS.colors.accent.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusFailed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LightDS.colors.accent.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
  },
  progressContainer: {
    marginTop: getLightSpacing('sm'),
  },
  progressBar: {
    height: 6,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: getLightSpacing('xs'),
  },
  progressFill: {
    height: '100%',
    backgroundColor: LightDS.colors.accent.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  readyVideoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getLightSpacing('sm'),
  },
  playButton: {
    flex: 1,
    backgroundColor: LightDS.colors.accent.primary,
    paddingVertical: getLightSpacing('sm'),
    paddingHorizontal: getLightSpacing('md'),
    borderRadius: getLightBorderRadius('button'),
    marginRight: getLightSpacing('sm'),
  },
  playButtonText: {
    color: LightDS.colors.text.inverse,
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    textAlign: 'center',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    ...getLightShadow('sm'),
  },
  refreshButtonText: {
    fontSize: getLightFontSize('lg'),
  },
  categoriesContainer: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('lg'),
  },
  categoryChip: {
    paddingHorizontal: getLightSpacing('md'),
    paddingVertical: getLightSpacing('sm'),
    borderRadius: getLightBorderRadius('button'),
    backgroundColor: LightDS.colors.backgrounds.card,
    borderWidth: 2,
    marginRight: getLightSpacing('sm'),
    ...getLightShadow('sm'),
  },
  activeCategoryChip: {
    backgroundColor: LightDS.colors.accent.primary + '20',
  },
  categoryChipText: {
    fontSize: getLightFontSize('sm'),
    fontWeight: LightDS.typography.weights.bold,
  },
  activeCategoryChipText: {
    fontWeight: LightDS.typography.weights.bold,
  },
  categoryVideos: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  categoryVideoWrapper: {
    marginBottom: getLightSpacing('md'),
  },
  categoryVideoCard: {
    flexDirection: 'row',
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    overflow: 'hidden',
    ...getLightShadow('sm'),
  },
  categoryVideoThumbnail: {
    width: 120,
    height: 90,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryThumbnailEmoji: {
    fontSize: 32,
  },
  categoryVideoDuration: {
    position: 'absolute',
    bottom: getLightSpacing('xs'),
    right: getLightSpacing('xs'),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: getLightSpacing('xs'),
    paddingVertical: 2,
    borderRadius: getLightBorderRadius('sm'),
  },
  categoryDurationText: {
    color: '#FFFFFF',
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  categoryVideoInfo: {
    flex: 1,
    padding: getLightSpacing('md'),
    justifyContent: 'space-between',
  },
  categoryVideoTitle: {
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
    lineHeight: getLightFontSize('md') * 1.3,
  },
  categoryVideoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallCategoryBadge: {
    paddingHorizontal: getLightSpacing('xs'),
    paddingVertical: 2,
    borderRadius: getLightBorderRadius('sm'),
  },
  smallCategoryText: {
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  categoryVideoStats: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  bottomSpacing: {
    height: getLightSpacing('xxxxl'),
  },
});

export default LightVideosScreen;
