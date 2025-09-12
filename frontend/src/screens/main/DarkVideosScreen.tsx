import React, { useState } from 'react';
import { useVideos } from '../../hooks/useApi';
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
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkCategoryColor } from '../../config/darkNewsDesignSystem';

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
    title: 'Kids Send Messages to Mars with NASA',
    category: 'science',
    duration: '5:45',
    views: '8.9K',
    uploadDate: '1 week ago',
    thumbnail: '🚀',
    isLive: true,
  },
];

const categoryVideos: VideoItem[] = [
  {
    id: '3',
    title: 'Young Inventors Create Solar Water Purifier',
    category: 'technology',
    duration: '4:20',
    views: '5.2K',
    uploadDate: '3 days ago',
    thumbnail: '💧',
  },
  {
    id: '4',
    title: 'Panda Twins Born at Conservation Center',
    category: 'world',
    duration: '3:15',
    views: '15.7K',
    uploadDate: '5 days ago',
    thumbnail: '🐼',
  },
  {
    id: '5',
    title: 'Educational Math Game Goes Viral',
    category: 'technology',
    duration: '6:10',
    views: '9.3K',
    uploadDate: '1 week ago',
    thumbnail: '🧮',
    isPremium: true,
  },
];

const generatedVideos: GeneratedVideo[] = [
  {
    id: '1',
    title: 'Climate Heroes Around the World',
    status: 'ready',
    createdAt: '2 hours ago',
    duration: '7:45',
  },
  {
    id: '2',
    title: 'Space Exploration for Kids',
    status: 'processing',
    progress: 75,
    estimatedTime: '5 minutes',
    createdAt: '1 hour ago',
  },
  {
    id: '3',
    title: 'Ocean Conservation Stories',
    status: 'failed',
    createdAt: '3 hours ago',
  },
];

const categories = [
  { id: 'all', name: 'All Videos', color: DarkDS.colors.accent.primary },
  { id: 'technology', name: 'Technology', color: DarkDS.colors.categories.technology },
  { id: 'science', name: 'Science', color: DarkDS.colors.categories.science },
  { id: 'world', name: 'World', color: DarkDS.colors.categories.world },
  { id: 'sports', name: 'Sports', color: DarkDS.colors.categories.sports },
];

interface DarkVideosScreenProps {
  onVideoPress?: (videoData: any) => void;
}

const DarkVideosScreen: React.FC<DarkVideosScreenProps> = ({ onVideoPress }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleVideoPress = (video: VideoItem | GeneratedVideo) => {
    // Convert video data to the format expected by VideoPlayerScreen
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
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.featuredVideoCard} 
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.featuredThumbnailContainer}>
          <View style={[styles.featuredThumbnail, { backgroundColor: categoryColor }]}>
            <Text style={styles.featuredThumbnailEmoji}>{item.thumbnail}</Text>
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
          </View>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.featuredVideoContent}>
          <Text style={styles.featuredVideoTitle}>{item.title}</Text>
          <View style={styles.featuredVideoMeta}>
            <Text style={[styles.featuredVideoCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.featuredVideoStats}>
              👁 {item.views} • {item.uploadDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryVideo = ({ item }: { item: VideoItem }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.categoryVideoCard} 
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.categoryThumbnailContainer}>
          <View style={[styles.categoryThumbnail, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryThumbnailEmoji}>{item.thumbnail}</Text>
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>👑</Text>
              </View>
            )}
          </View>
          <View style={styles.smallPlayButton}>
            <Text style={styles.smallPlayIcon}>▶️</Text>
          </View>
          <View style={styles.smallDurationBadge}>
            <Text style={styles.smallDurationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.categoryVideoContent}>
          <Text style={styles.categoryVideoTitle}>{item.title}</Text>
          <View style={styles.categoryVideoMeta}>
            <Text style={[styles.categoryVideoCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.categoryVideoStats}>
              👁 {item.views} • {item.uploadDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGeneratedVideo = ({ item }: { item: GeneratedVideo }) => {
    const getStatusColor = () => {
      switch (item.status) {
        case 'ready': return DarkDS.colors.accent.success;
        case 'processing': return DarkDS.colors.accent.warning;
        case 'failed': return DarkDS.colors.accent.error;
        default: return DarkDS.colors.text.tertiary;
      }
    };

    const getStatusIcon = () => {
      switch (item.status) {
        case 'ready': return '✅';
        case 'processing': return '⏳';
        case 'failed': return '❌';
        default: return '📹';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.generatedVideoCard} 
        activeOpacity={0.8}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.generatedVideoHeader}>
          <Text style={styles.generatedVideoTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {item.status === 'processing' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%`, backgroundColor: DarkDS.colors.accent.warning }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}% • {item.estimatedTime} remaining
            </Text>
          </View>
        )}
        
        {item.status === 'ready' && (
          <View style={styles.readyActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>▶️</Text>
              <Text style={styles.actionButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>🔖</Text>
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.generatedVideoFooter}>
          <Text style={styles.generatedVideoTime}>Created {item.createdAt}</Text>
          {item.duration && (
            <Text style={styles.generatedVideoDuration}>{item.duration}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Videos</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Educational videos for curious minds</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Featured Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Videos</Text>
            <Text style={styles.sectionSubtitle}>Editor's picks</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredVideos}
            renderItem={renderFeaturedVideo}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Custom Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎬 Custom Videos</Text>
            <Text style={styles.sectionSubtitle}>Created on the backend</Text>
            <TouchableOpacity>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Videos are generated on our backend servers and automatically appear here when ready.
            </Text>
          </View>
          
          <FlatList
            data={generatedVideos}
            renderItem={renderGeneratedVideo}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: getDarkSpacing('md') }} />}
          />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && [styles.categoryTabActive, { backgroundColor: category.color }]
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={[
                styles.categoryTabText,
                activeCategory === category.id && styles.categoryTabTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'all' ? 'All Videos' : categories.find(c => c.id === activeCategory)?.name + ' Videos'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoryVideos}
            renderItem={renderCategoryVideo}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: getDarkSpacing('md') }} />}
          />
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
    backgroundColor: DarkDS.colors.backgrounds.primary,
    paddingHorizontal: getDarkSpacing('lg'),
    paddingTop: getDarkSpacing('lg'),
    paddingBottom: getDarkSpacing('md'),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('xs'),
  },
  headerTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  refreshButton: {
    padding: getDarkSpacing('sm'),
  },
  refreshIcon: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: getDarkSpacing('xl'),
  },
  sectionHeader: {
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('lg'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
  },
  refreshText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  seeAllText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('lg'),
    padding: getDarkSpacing('md'),
    backgroundColor: DarkDS.colors.accent.info + '20',
    borderRadius: getDarkBorderRadius('md'),
    borderWidth: 1,
    borderColor: DarkDS.colors.accent.info + '40',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: getDarkSpacing('sm'),
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
  },
  featuredList: {
    paddingHorizontal: getDarkSpacing('lg'),
  },
  featuredVideoCard: {
    width: 280,
    marginRight: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    overflow: 'hidden',
    ...getDarkShadow('md'),
  },
  featuredThumbnailContainer: {
    height: 160,
    position: 'relative',
  },
  featuredThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredThumbnailEmoji: {
    fontSize: 48,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
  durationBadge: {
    position: 'absolute',
    bottom: getDarkSpacing('sm'),
    right: getDarkSpacing('sm'),
    paddingHorizontal: getDarkSpacing('xs'),
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: getDarkBorderRadius('xs'),
  },
  durationText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  liveIndicator: {
    position: 'absolute',
    top: getDarkSpacing('sm'),
    left: getDarkSpacing('sm'),
    paddingHorizontal: getDarkSpacing('xs'),
    paddingVertical: 2,
    backgroundColor: DarkDS.colors.status.live,
    borderRadius: getDarkBorderRadius('xs'),
  },
  liveText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.bold,
  },
  newIndicator: {
    position: 'absolute',
    top: getDarkSpacing('sm'),
    right: getDarkSpacing('sm'),
    paddingHorizontal: getDarkSpacing('xs'),
    paddingVertical: 2,
    backgroundColor: DarkDS.colors.status.new,
    borderRadius: getDarkBorderRadius('xs'),
  },
  newText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.bold,
  },
  featuredVideoContent: {
    padding: getDarkSpacing('lg'),
  },
  featuredVideoTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
    lineHeight: getDarkFontSize('md') * 1.3,
  },
  featuredVideoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredVideoCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  featuredVideoStats: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingBottom: getDarkSpacing('md'),
  },
  categoryTab: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('sm'),
    marginRight: getDarkSpacing('md'),
    borderRadius: getDarkBorderRadius('chip'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  categoryTabActive: {
    // backgroundColor will be set dynamically
  },
  categoryTabText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.secondary,
  },
  categoryTabTextActive: {
    color: DarkDS.colors.text.primary,
  },
  categoryVideoCard: {
    flexDirection: 'row',
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    overflow: 'hidden',
    ...getDarkShadow('sm'),
  },
  categoryThumbnailContainer: {
    width: 120,
    height: 80,
    position: 'relative',
  },
  categoryThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryThumbnailEmoji: {
    fontSize: 32,
  },
  smallPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPlayIcon: {
    fontSize: 12,
  },
  smallDurationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: getDarkBorderRadius('xs'),
  },
  smallDurationText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  premiumBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DarkDS.colors.accent.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 10,
  },
  categoryVideoContent: {
    flex: 1,
    padding: getDarkSpacing('md'),
    justifyContent: 'space-between',
  },
  categoryVideoTitle: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
    lineHeight: getDarkFontSize('sm') * 1.3,
  },
  categoryVideoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryVideoCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  categoryVideoStats: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  generatedVideoCard: {
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    padding: getDarkSpacing('lg'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  generatedVideoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getDarkSpacing('md'),
  },
  generatedVideoTitle: {
    flex: 1,
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginRight: getDarkSpacing('md'),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 4,
    borderRadius: getDarkBorderRadius('xs'),
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: getDarkSpacing('md'),
  },
  progressBar: {
    height: 4,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: 2,
    marginBottom: getDarkSpacing('xs'),
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.secondary,
  },
  readyActions: {
    flexDirection: 'row',
    gap: getDarkSpacing('md'),
    marginBottom: getDarkSpacing('md'),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getDarkSpacing('sm'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
  },
  actionButtonIcon: {
    fontSize: 14,
    marginRight: getDarkSpacing('xs'),
  },
  actionButtonText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
  },
  generatedVideoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generatedVideoTime: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  generatedVideoDuration: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkVideosScreen;
