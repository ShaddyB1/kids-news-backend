import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { modernKidsDesignSystem } from './src/config/modernKidsDesignSystem';
import { ThemeProvider } from './src/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const ds = modernKidsDesignSystem;

// Types
interface Article {
  id: string;
  title: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  published_date: string;
  read_time: string;
  is_breaking: number;
  is_trending: number;
  is_hot: number;
  views: number;
  likes: number;
  comments: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  category: string;
  published_date: string;
  views: number;
  likes: number;
}

// API Service
class ApiService {
  private baseUrl = 'http://192.168.1.69:5002';

  async fetchArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }

  async fetchVideos(): Promise<Video[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.videos || [];
    } catch (error) {
      console.error('Videos API Error:', error);
      return [];
    }
  }
}

const apiService = new ApiService();

// Profile Header Component
const ProfileHeader: React.FC = () => {
  const style = ds.components.profileHeader;
  
  return (
    <View style={[styles.profileHeader, { backgroundColor: style.backgroundColor }]}>
      <View style={styles.profileContent}>
        <View style={styles.profileLeft}>
          <View style={[styles.avatar, { 
            width: style.avatarSize, 
            height: style.avatarSize,
            borderColor: style.avatarBorderColor,
            borderWidth: style.avatarBorderWidth 
          }]}>
            <Text style={styles.avatarText}>👦</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: style.nameColor }]}>
              Young Explorer
            </Text>
            <Text style={[styles.profileSubtitle, { color: style.subtitleColor }]}>
              Level 5 News Detective
            </Text>
          </View>
        </View>
        
        <View style={styles.profileRight}>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🏆</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>⭐</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🎯</Text>
            </View>
          </View>
          
          <View style={styles.coinContainer}>
            <Text style={[styles.coinText, { color: style.coinColor }]}>💰 12000</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Greeting Component
const Greeting: React.FC = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning!' : hour < 17 ? 'Good Afternoon!' : 'Good Evening!';
  
  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.greetingTitle}>{greeting} 🌅</Text>
      <Text style={styles.greetingSubtitle}>Ready for today's learning adventure?</Text>
    </View>
  );
};

// Search Bar Component
const SearchBar: React.FC<{ value: string; onChangeText: (text: string) => void }> = ({ value, onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="What would you like to learn?"
        placeholderTextColor={ds.colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

// Category Grid Component
const CategoryGrid: React.FC<{ selectedCategory: string; onSelectCategory: (category: string) => void }> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const categories = [
    { id: 'all', name: 'All', icon: '🌟', color: ds.colors.accentYellow },
    { id: 'animals', name: 'Animals', icon: '🐾', color: ds.colors.accentGreen },
    { id: 'science', name: 'Science', icon: '🔬', color: ds.colors.primaryBlue },
    { id: 'space', name: 'Space', icon: '🚀', color: ds.colors.accentPurple },
    { id: 'sports', name: 'Sports', icon: '⚽', color: ds.colors.secondaryOrange },
    { id: 'learning', name: 'Learning', icon: '💡', color: ds.colors.accentPink },
  ];

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Choose Your Topic 🎯</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && [
                styles.categoryCardSelected,
                { backgroundColor: category.color }
              ]
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryName,
              selectedCategory === category.id && styles.categoryNameSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Story Card Component
const StoryCard: React.FC<{ article: Article; onPress: () => void }> = ({ article, onPress }) => {
  const getBadgeStyle = () => {
    if (article.is_breaking) return ds.components.badge.breaking;
    if (article.is_trending) return ds.components.badge.trending;
    if (article.is_hot) return ds.components.badge.hot;
    return null;
  };

  const getBadgeText = () => {
    if (article.is_breaking) return 'Breaking';
    if (article.is_trending) return 'Trending';
    if (article.is_hot) return 'Hot';
    return '';
  };

  const badgeStyle = getBadgeStyle();

  return (
    <TouchableOpacity style={styles.storyCard} onPress={onPress}>
      <View style={styles.storyImageContainer}>
        <View style={styles.storyImagePlaceholder}>
          <Text style={styles.storyImageIcon}>📰</Text>
        </View>
        {badgeStyle && (
          <View style={[styles.storyBadge, { backgroundColor: badgeStyle.backgroundColor }]}>
            <Text style={[styles.storyBadgeText, { color: badgeStyle.textColor }]}>
              {getBadgeText()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.storySummary} numberOfLines={2}>{article.summary}</Text>
        
        <View style={styles.storyMeta}>
          <Text style={styles.storyMetaText}>{article.read_time}</Text>
          <Text style={styles.storyMetaText}>👀 {article.views}</Text>
          <Text style={styles.storyMetaText}>❤️ {article.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Video Card Component
const VideoCard: React.FC<{ video: Video; onPress: () => void }> = ({ video, onPress }) => {
  return (
    <TouchableOpacity style={styles.videoCard} onPress={onPress}>
      <View style={styles.videoThumbnail}>
        <Text style={styles.videoIcon}>🎬</Text>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>{video.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoContent}>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.videoMeta}>👀 {video.views} • ❤️ {video.likes}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Home Screen Component
const HomeScreen: React.FC<{ articles: Article[]; onArticlePress: (article: Article) => void }> = ({ 
  articles, 
  onArticlePress 
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

      return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader />
      <View style={styles.content}>
        <Greeting />
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <CategoryGrid 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <View style={styles.storiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'Latest Stories' : `${selectedCategory} Stories`} 📖
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>⭐</Text>
              <Text style={styles.emptyStateTitle}>No stories found!</Text>
              <Text style={styles.emptyStateSubtitle}>Try selecting a different category</Text>
            </View>
          ) : (
            filteredArticles.map((article) => (
              <StoryCard
                key={article.id}
                article={article}
                onPress={() => onArticlePress(article)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

// Videos Screen Component
const VideosScreen: React.FC<{ videos: Video[]; onVideoPress: (video: Video) => void }> = ({ 
  videos, 
  onVideoPress 
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Videos 🎬</Text>
          <Text style={styles.screenSubtitle}>Watch and learn amazing stories!</Text>
        </View>
        
        {videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎬</Text>
            <Text style={styles.emptyStateTitle}>No videos available!</Text>
            <Text style={styles.emptyStateSubtitle}>Check back soon for new content</Text>
          </View>
        ) : (
          <View style={styles.videosGrid}>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPress={() => onVideoPress(video)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Library Screen Component
const LibraryScreen: React.FC<{ articles: Article[]; onArticlePress: (article: Article) => void }> = ({ 
  articles, 
  onArticlePress 
}) => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  
      return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Library 📚</Text>
          <Text style={styles.screenSubtitle}>Your saved stories and progress</Text>
        </View>
        
        <View style={styles.libraryTabs}>
          <TouchableOpacity
            style={[styles.libraryTab, activeTab === 'bookmarks' && styles.libraryTabActive]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Text style={[styles.libraryTabText, activeTab === 'bookmarks' && styles.libraryTabTextActive]}>
              🔖 Bookmarks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.libraryTab, activeTab === 'history' && styles.libraryTabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.libraryTabText, activeTab === 'history' && styles.libraryTabTextActive]}>
              📖 History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.libraryTab, activeTab === 'achievements' && styles.libraryTabActive]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.libraryTabText, activeTab === 'achievements' && styles.libraryTabTextActive]}>
              🏆 Achievements
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'bookmarks' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔖</Text>
              <Text style={styles.emptyStateTitle}>No bookmarks yet!</Text>
              <Text style={styles.emptyStateSubtitle}>Save stories you love to read later</Text>
            </View>
          </View>
        )}
        
        {activeTab === 'history' && (
          <View style={styles.tabContent}>
            {articles.slice(0, 5).map((article) => (
              <StoryCard
                key={article.id}
                article={article}
                onPress={() => onArticlePress(article)}
              />
            ))}
          </View>
        )}
        
        {activeTab === 'achievements' && (
          <View style={styles.tabContent}>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementTitle}>First Story Read!</Text>
              <Text style={styles.achievementDescription}>You read your first news story</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>⭐</Text>
              <Text style={styles.achievementTitle}>Quiz Master</Text>
              <Text style={styles.achievementDescription}>Completed 5 quizzes perfectly</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementTitle}>Daily Explorer</Text>
              <Text style={styles.achievementDescription}>Visited the app 7 days in a row</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Profile Screen Component
const ProfileScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  const profileSections = [
    {
      title: 'Content',
      items: [
        { icon: '🔖', title: 'My Bookmarks', subtitle: '12 saved stories' },
        { icon: '📖', title: 'Reading History', subtitle: '45 stories read' },
        { icon: '🏆', title: 'Achievements', subtitle: '8 badges earned' },
        { icon: '📊', title: 'Progress', subtitle: 'Level 5 Explorer' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: '👤', title: 'Profile Settings', subtitle: 'Update your info' },
        { icon: '🔒', title: 'Privacy', subtitle: 'Control your data' },
        { icon: '📧', title: 'Notifications', subtitle: 'Manage alerts' },
        { icon: '🌙', title: 'Dark Mode', subtitle: darkMode ? 'On' : 'Off', toggle: true },
      ]
    },
    {
      title: 'More',
      items: [
        { icon: '❓', title: 'Help & Support', subtitle: 'Get assistance' },
        { icon: '⭐', title: 'Rate Us', subtitle: 'Share your feedback' },
        { icon: '📱', title: 'About', subtitle: 'App version 1.0.0' },
        { icon: '🚪', title: 'Sign Out', subtitle: 'Leave the app' },
      ]
    }
  ];

  const handleItemPress = (item: any) => {
    if (item.toggle) {
      setDarkMode(!darkMode);
    } else {
      Alert.alert(item.title, `You tapped on ${item.title}`);
          }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader />
      <View style={styles.content}>
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.profileItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.profileItemLeft}>
                  <Text style={styles.profileItemIcon}>{item.icon}</Text>
                  <View style={styles.profileItemText}>
                    <Text style={styles.profileItemTitle}>{item.title}</Text>
                    <Text style={styles.profileItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.toggle ? (
                  <View style={[styles.toggle, darkMode && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
                  </View>
                ) : (
                  <Text style={styles.profileItemArrow}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Bottom Navigation Component
const BottomNavigation: React.FC<{ activeTab: string; onTabPress: (tab: string) => void }> = ({ 
  activeTab, 
  onTabPress 
}) => {
  const tabs = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'videos', name: 'Videos', icon: '🎬' },
    { id: 'library', name: 'Library', icon: '📚' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.navTab, activeTab === tab.id && styles.navTabActive]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={[styles.navTabIcon, activeTab === tab.id && styles.navTabIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.navTabText, activeTab === tab.id && styles.navTabTextActive]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [articlesData, videosData] = await Promise.all([
        apiService.fetchArticles(),
        apiService.fetchVideos()
      ]);
      setArticles(articlesData);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePress = (article: Article) => {
    Alert.alert(
      article.title,
      article.summary,
      [
        { text: 'Read Later', style: 'cancel' },
        { text: 'Read Now', onPress: () => console.log('Reading article:', article.id) }
      ]
    );
  };

  const handleVideoPress = (video: Video) => {
    Alert.alert(
      video.title,
      video.description,
      [
        { text: 'Watch Later', style: 'cancel' },
        { text: 'Watch Now', onPress: () => console.log('Playing video:', video.id) }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ds.colors.primaryBlue} />
        <Text style={styles.loadingText}>Loading amazing content...</Text>
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen articles={articles} onArticlePress={handleArticlePress} />;
      case 'videos':
        return <VideosScreen videos={videos} onVideoPress={handleVideoPress} />;
      case 'library':
        return <LibraryScreen articles={articles} onArticlePress={handleArticlePress} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen articles={articles} onArticlePress={handleArticlePress} />;
    }
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.app}>
        {renderScreen()}
        <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      </SafeAreaView>
    </ThemeProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: ds.colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: ds.colors.backgroundLight,
  },
  content: {
    padding: ds.layouts.screenPadding,
    paddingBottom: 100, // Space for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ds.colors.backgroundLight,
  },
  loadingText: {
    ...ds.typography.body,
    marginTop: ds.spacing.md,
    color: ds.colors.textSecondary,
  },
  
  // Profile Header
  profileHeader: {
    borderRadius: ds.borderRadius.large,
    margin: ds.spacing.md,
    marginBottom: 0,
    ...ds.shadows.medium,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ds.spacing.lg,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    borderRadius: ds.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ds.spacing.md,
  },
  avatarText: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...ds.typography.h3,
    fontWeight: 'bold',
  },
  profileSubtitle: {
    ...ds.typography.bodySmall,
    marginTop: 2,
  },
  profileRight: {
    alignItems: 'flex-end',
  },
  badges: {
    flexDirection: 'row',
    marginBottom: ds.spacing.sm,
  },
  badge: {
    marginLeft: ds.spacing.xs,
  },
  badgeIcon: {
    fontSize: 16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    ...ds.typography.h4,
    fontWeight: 'bold',
    marginRight: ds.spacing.sm,
  },
  buyButton: {
    backgroundColor: ds.colors.accentYellow,
    paddingHorizontal: ds.spacing.md,
    paddingVertical: ds.spacing.sm,
    borderRadius: ds.borderRadius.round,
  },
  buyButtonText: {
    ...ds.typography.button,
    fontSize: 14,
    color: ds.colors.textPrimary,
    fontWeight: 'bold',
  },
  
  // Greeting
  greetingContainer: {
    marginBottom: ds.spacing.lg,
  },
  greetingTitle: {
    ...ds.typography.h2,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.xs,
  },
  greetingSubtitle: {
    ...ds.typography.body,
    color: ds.colors.textSecondary,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.round,
    paddingHorizontal: ds.spacing.md,
    paddingVertical: ds.spacing.md,
    marginBottom: ds.spacing.lg,
    ...ds.shadows.soft,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: ds.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...ds.typography.body,
    color: ds.colors.textPrimary,
  },
  
  // Categories
  categoryContainer: {
    marginBottom: ds.spacing.lg,
  },
  sectionTitle: {
    ...ds.typography.h3,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 3, // 3 columns with margins
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ds.spacing.md,
    minHeight: 80,
    ...ds.shadows.soft,
  },
  categoryCardSelected: {
    backgroundColor: ds.colors.accentGreen,
    ...ds.shadows.medium,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: ds.spacing.xs,
  },
  categoryName: {
    ...ds.typography.bodySmall,
    color: ds.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryNameSelected: {
    color: ds.colors.textWhite,
  },
  
  // Stories
  storiesSection: {
    marginBottom: ds.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ds.spacing.md,
  },
  seeAllText: {
    ...ds.typography.body,
    color: ds.colors.primaryBlue,
    fontWeight: '600',
  },
  storyCard: {
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.md,
    marginBottom: ds.spacing.md,
    ...ds.shadows.medium,
  },
  storyImageContainer: {
    position: 'relative',
    marginBottom: ds.spacing.md,
  },
  storyImagePlaceholder: {
    height: 120,
    backgroundColor: ds.colors.backgroundGray,
    borderRadius: ds.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImageIcon: {
    fontSize: 32,
  },
  storyBadge: {
    position: 'absolute',
    top: ds.spacing.sm,
    left: ds.spacing.sm,
    paddingHorizontal: ds.spacing.sm,
    paddingVertical: ds.spacing.xs,
    borderRadius: ds.borderRadius.small,
  },
  storyBadgeText: {
    ...ds.typography.caption,
    fontWeight: 'bold',
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    ...ds.typography.h4,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.sm,
  },
  storySummary: {
    ...ds.typography.body,
    color: ds.colors.textSecondary,
    marginBottom: ds.spacing.sm,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyMetaText: {
    ...ds.typography.bodySmall,
    color: ds.colors.textLight,
  },
  
  // Videos
  screenHeader: {
    marginBottom: ds.spacing.lg,
  },
  screenTitle: {
    ...ds.typography.h1,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.xs,
  },
  screenSubtitle: {
    ...ds.typography.body,
    color: ds.colors.textSecondary,
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoCard: {
    width: (width - 60) / 2, // 2 columns
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.md,
    marginBottom: ds.spacing.md,
    ...ds.shadows.medium,
  },
  videoThumbnail: {
    height: 100,
    backgroundColor: ds.colors.backgroundGray,
    borderRadius: ds.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: ds.spacing.sm,
  },
  videoIcon: {
    fontSize: 24,
  },
  playButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: ds.borderRadius.circle,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: ds.colors.textWhite,
    fontSize: 16,
  },
  videoDuration: {
    position: 'absolute',
    bottom: ds.spacing.xs,
    right: ds.spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: ds.spacing.xs,
    paddingVertical: 2,
    borderRadius: ds.borderRadius.small,
  },
  videoDurationText: {
    ...ds.typography.caption,
    color: ds.colors.textWhite,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    ...ds.typography.bodySmall,
    color: ds.colors.textPrimary,
    fontWeight: '600',
    marginBottom: ds.spacing.xs,
  },
  videoMeta: {
    ...ds.typography.caption,
    color: ds.colors.textLight,
  },
  
  // Library
  libraryTabs: {
    flexDirection: 'row',
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.xs,
    marginBottom: ds.spacing.lg,
    ...ds.shadows.soft,
  },
  libraryTab: {
    flex: 1,
    paddingVertical: ds.spacing.md,
    alignItems: 'center',
    borderRadius: ds.borderRadius.medium,
  },
  libraryTabActive: {
    backgroundColor: ds.colors.accentPink,
  },
  libraryTabText: {
    ...ds.typography.bodySmall,
    color: ds.colors.textSecondary,
    fontWeight: '600',
  },
  libraryTabTextActive: {
    color: ds.colors.textWhite,
  },
  tabContent: {
    flex: 1,
  },
  achievementCard: {
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.lg,
    marginBottom: ds.spacing.md,
    alignItems: 'center',
    ...ds.shadows.soft,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: ds.spacing.sm,
  },
  achievementTitle: {
    ...ds.typography.h4,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.xs,
  },
  achievementDescription: {
    ...ds.typography.body,
    color: ds.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Profile
  profileSection: {
    marginBottom: ds.spacing.xl,
  },
  profileSectionTitle: {
    ...ds.typography.h3,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.md,
  },
  profileItem: {
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.large,
    padding: ds.spacing.lg,
    marginBottom: ds.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...ds.shadows.soft,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    fontSize: 20,
    marginRight: ds.spacing.md,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    ...ds.typography.body,
    color: ds.colors.textPrimary,
    fontWeight: '600',
  },
  profileItemSubtitle: {
    ...ds.typography.bodySmall,
    color: ds.colors.textSecondary,
    marginTop: 2,
  },
  profileItemArrow: {
    ...ds.typography.h2,
    color: ds.colors.textLight,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: ds.colors.backgroundGray,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: ds.colors.primaryBlue,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ds.colors.backgroundWhite,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: ds.spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: ds.spacing.md,
  },
  emptyStateTitle: {
    ...ds.typography.h3,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.xs,
  },
  emptyStateSubtitle: {
    ...ds.typography.body,
    color: ds.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Bottom Navigation
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ds.colors.backgroundWhite,
    flexDirection: 'row',
    paddingTop: ds.spacing.md,
    paddingBottom: ds.spacing.xl,
    paddingHorizontal: ds.spacing.lg,
    ...ds.shadows.strong,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ds.spacing.sm,
    borderRadius: ds.borderRadius.medium,
  },
  navTabActive: {
    backgroundColor: ds.colors.secondaryOrange,
  },
  navTabIcon: {
    fontSize: 20,
    marginBottom: ds.spacing.xs,
  },
  navTabIconActive: {
    fontSize: 22,
  },
  navTabText: {
    ...ds.typography.caption,
    color: ds.colors.textLight,
    fontWeight: '600',
  },
  navTabTextActive: {
    color: ds.colors.textWhite,
  },
});

export default App;