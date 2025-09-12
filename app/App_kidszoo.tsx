import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { kidszooDesignSystem } from './src/config/kidszooDesignSystem';
import { API_CONFIG, API_ENDPOINTS } from './src/config/api';

const { width } = Dimensions.get('window');
const ds = kidszooDesignSystem;

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
  article_id: string;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  duration: string;
  status: string;
  upload_date: string;
}

// Logo Component with Kidszoo-style colors
const KidszooLogo: React.FC = () => {
  const logoColors = [
    ds.colors.logoPurple,   // K
    ds.colors.logoPink,     // i
    ds.colors.logoOrange,   // d
    ds.colors.logoGreen,    // s
    ds.colors.logoBlue,     // z
    ds.colors.logoPink,     // o
    ds.colors.logoOrange,   // o
  ];
  
  const letters = ['K', 'i', 'd', 's', 'z', 'o', 'o'];
  
  return (
    <View style={styles.logoContainer}>
      {letters.map((letter, index) => (
        <Text key={index} style={[styles.logoLetter, { color: logoColors[index] }]}>
          {letter}
        </Text>
      ))}
    </View>
  );
};

// Profile Header Component
const ProfileHeader: React.FC = () => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileAvatarText}>👧</Text>
      </View>
      <Text style={styles.profileName}>Hello Charmie!</Text>
      <Text style={styles.profileSubtitle}>Ready to learn something amazing?</Text>
      <View style={styles.coinDisplay}>
        <Text style={styles.coinIcon}>💰</Text>
        <Text style={styles.coinText}>1,250 Coins</Text>
      </View>
    </View>
  );
};

// Category Card Component
const CategoryCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <Text style={[styles.categoryIcon, { color }]}>{icon}</Text>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categorySubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

// Story Card Component
const StoryCard: React.FC<{
  article: Article;
  onPress: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}> = ({ article, onPress, onBookmark, isBookmarked }) => {
  const getBadgeStyle = () => {
    if (article.is_breaking) return { backgroundColor: ds.colors.errorRed };
    if (article.is_trending) return { backgroundColor: ds.colors.successGreen };
    if (article.is_hot) return { backgroundColor: ds.colors.warningOrange };
    return null;
  };

  const getBadgeText = () => {
    if (article.is_breaking) return '🔥 Breaking';
    if (article.is_trending) return '📈 Trending';
    if (article.is_hot) return '🔥 Hot';
    return null;
  };

  return (
    <TouchableOpacity style={styles.storyCard} onPress={onPress}>
      {getBadgeStyle() && (
        <View style={[styles.badge, getBadgeStyle()]}>
          <Text style={styles.badgeText}>{getBadgeText()}</Text>
        </View>
      )}
      
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.storySummary} numberOfLines={2}>{article.summary}</Text>
        
        <View style={styles.storyMeta}>
          <View style={styles.storyMetaLeft}>
            <Text style={styles.storyMetaText}>{article.read_time}</Text>
            <Text style={styles.storyMetaText}>👀 {article.views}</Text>
            <Text style={styles.storyMetaText}>❤️ {article.likes}</Text>
          </View>
          <TouchableOpacity onPress={onBookmark} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '📖'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Learning Categories Component
const LearningCategories: React.FC<{ onCategoryPress: (category: string) => void }> = ({ onCategoryPress }) => {
  const categories = [
    { icon: '🔢', title: 'Numbers', subtitle: 'Math & Counting', color: ds.colors.accentBlue, key: 'numbers' },
    { icon: '📖', title: 'Reading', subtitle: 'Stories & Books', color: ds.colors.accentGreen, key: 'reading' },
    { icon: '🔺', title: 'Shapes', subtitle: 'Geometry Fun', color: ds.colors.accentPink, key: 'shapes' },
    { icon: '📝', title: 'Vocabulary', subtitle: 'Words & Letters', color: ds.colors.accentPurple, key: 'vocabulary' },
    { icon: '📊', title: 'Analysis', subtitle: 'Learning Progress', color: ds.colors.accentOrange, key: 'analysis' },
    { icon: '⚙️', title: 'Settings', subtitle: 'App Preferences', color: ds.colors.accentTeal, key: 'settings' },
  ];

  return (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <View key={category.key} style={styles.categoryGridItem}>
          <CategoryCard
            icon={category.icon}
            title={category.title}
            subtitle={category.subtitle}
            color={category.color}
            onPress={() => onCategoryPress(category.key)}
          />
        </View>
      ))}
    </View>
  );
};

// Bottom Navigation Component
const BottomNavigation: React.FC<{
  activeTab: string;
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'learn', icon: '🎓', label: 'Learn' },
    { id: 'library', icon: '📚', label: 'Library' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.navTab, activeTab === tab.id && styles.navTabActive]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={styles.navTabIcon}>{tab.icon}</Text>
          <Text style={[
            styles.navTabText,
            activeTab === tab.id ? styles.navTabTextActive : styles.navTabTextInactive
          ]}>
            {tab.label}
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [articlesResponse, videosResponse] = await Promise.all([
        fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.articles}`),
        fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.videos}`)
      ]);

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.articles || []);
      }

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.videos || []);
      }
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
        { 
          text: 'Read Now', 
          onPress: () => {
            setSelectedArticle(article);
            setShowStoryDetail(true);
          }
        }
      ]
    );
  };

  const handleBackFromStory = () => {
    setShowStoryDetail(false);
    setSelectedArticle(null);
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      if (prev.includes(articleId)) {
        Alert.alert('Bookmark Removed', 'Story removed from your bookmarks!');
        return prev.filter(id => id !== articleId);
      } else {
        Alert.alert('Bookmark Added', 'Story saved to your bookmarks!');
        return [...prev, articleId];
      }
    });
  };

  const handleVideoPress = (video: Video) => {
    Alert.alert(
      video.title,
      video.description,
      [
        { text: 'Watch Later', style: 'cancel' },
        { 
          text: 'Watch Now', 
          onPress: () => {
            const relatedArticle = articles.find(article => article.id === video.article_id);
            if (relatedArticle) {
              setSelectedArticle(relatedArticle);
              setShowStoryDetail(true);
            } else {
              Alert.alert('Video Ready!', 'This video is ready to watch!');
            }
          }
        }
      ]
    );
  };

  const handleCategoryPress = (category: string) => {
    const categoryNames = {
      numbers: 'Numbers & Math',
      reading: 'Reading & Stories',
      shapes: 'Shapes & Geometry',
      vocabulary: 'Vocabulary & Letters',
      analysis: 'Learning Analysis',
      settings: 'App Settings'
    };
    
    Alert.alert(
      categoryNames[category] || category,
      `Welcome to ${categoryNames[category] || category}! This feature is coming soon with interactive lessons and activities.`,
      [{ text: 'Awesome!', onPress: () => console.log(`Selected ${category}`) }]
    );
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category.toLowerCase() === selectedCategory);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ds.colors.accentBlue} />
        <Text style={styles.loadingText}>Loading amazing content...</Text>
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <KidszooLogo />
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest Stories 📖</Text>
                <TouchableOpacity onPress={() => Alert.alert('See All Stories', `Showing all ${filteredArticles.length} stories!`)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {filteredArticles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>⭐</Text>
                  <Text style={styles.emptyStateTitle}>No stories found!</Text>
                  <Text style={styles.emptyStateSubtitle}>Check back later for new amazing stories!</Text>
                </View>
              ) : (
                filteredArticles.slice(0, 5).map((article) => (
                  <StoryCard
                    key={article.id}
                    article={article}
                    onPress={() => handleArticlePress(article)}
                    onBookmark={() => toggleBookmark(article.id)}
                    isBookmarked={bookmarkedArticles.includes(article.id)}
                  />
                ))
              )}
            </View>
          </ScrollView>
        );

      case 'learn':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Learning Hub 🎓</Text>
                <Text style={styles.sectionSubtitle}>Choose your adventure!</Text>
              </View>
              
              <Text style={styles.instructionText}>
                Pick a learning category to start your educational journey!
              </Text>
              
              <LearningCategories onCategoryPress={handleCategoryPress} />
              
              <View style={styles.achievementSection}>
                <Text style={styles.sectionTitle}>🏆 Your Achievements</Text>
                <View style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>🌟</Text>
                  <Text style={styles.achievementTitle}>Story Explorer</Text>
                  <Text style={styles.achievementDescription}>Read 5 amazing stories!</Text>
                </View>
                <View style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>🎯</Text>
                  <Text style={styles.achievementTitle}>Quiz Master</Text>
                  <Text style={styles.achievementDescription}>Completed 3 quizzes perfectly!</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'library':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Library 📚</Text>
              </View>
              
              <View style={styles.libraryTabs}>
                <TouchableOpacity style={styles.libraryTab}>
                  <Text style={styles.libraryTabText}>🔖 Bookmarks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.libraryTab}>
                  <Text style={styles.libraryTabText}>📖 History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.libraryTab}>
                  <Text style={styles.libraryTabText}>🏆 Achievements</Text>
                </TouchableOpacity>
              </View>
              
              {bookmarkedArticles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🔖</Text>
                  <Text style={styles.emptyStateTitle}>No bookmarks yet!</Text>
                  <Text style={styles.emptyStateSubtitle}>Save stories you love to read later</Text>
                  <TouchableOpacity 
                    style={styles.generateButton} 
                    onPress={() => Alert.alert('Bookmarks', 'Tap the bookmark icon on any story to save it here!')}
                  >
                    <Text style={styles.generateButtonText}>💡 How to Bookmark</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                articles
                  .filter(article => bookmarkedArticles.includes(article.id))
                  .map((article) => (
                    <StoryCard
                      key={article.id}
                      article={article}
                      onPress={() => handleArticlePress(article)}
                      onBookmark={() => toggleBookmark(article.id)}
                      isBookmarked={true}
                    />
                  ))
              )}
            </View>
          </ScrollView>
        );

      case 'profile':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ProfileHeader />
            <View style={styles.content}>
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <View style={styles.profileItem}>
                  <View style={styles.profileItemLeft}>
                    <Text style={styles.profileItemIcon}>🔔</Text>
                    <View style={styles.profileItemText}>
                      <Text style={styles.profileItemTitle}>Notifications</Text>
                      <Text style={styles.profileItemSubtitle}>Get updates about new stories</Text>
                    </View>
                  </View>
                  <Text style={styles.profileItemRight}>▶️</Text>
                </View>
                
                <View style={styles.profileItem}>
                  <View style={styles.profileItemLeft}>
                    <Text style={styles.profileItemIcon}>🎨</Text>
                    <View style={styles.profileItemText}>
                      <Text style={styles.profileItemTitle}>Theme</Text>
                      <Text style={styles.profileItemSubtitle}>Light mode</Text>
                    </View>
                  </View>
                  <Text style={styles.profileItemRight}>▶️</Text>
                </View>
                
                <View style={styles.profileItem}>
                  <View style={styles.profileItemLeft}>
                    <Text style={styles.profileItemIcon}>⭐</Text>
                    <View style={styles.profileItemText}>
                      <Text style={styles.profileItemTitle}>Rate Us</Text>
                      <Text style={styles.profileItemSubtitle}>Help us improve</Text>
                    </View>
                  </View>
                  <Text style={styles.profileItemRight}>▶️</Text>
                </View>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Help & Support</Text>
                <View style={styles.profileItem}>
                  <View style={styles.profileItemLeft}>
                    <Text style={styles.profileItemIcon}>❓</Text>
                    <View style={styles.profileItemText}>
                      <Text style={styles.profileItemTitle}>Help Center</Text>
                      <Text style={styles.profileItemSubtitle}>Get help and support</Text>
                    </View>
                  </View>
                  <Text style={styles.profileItemRight}>▶️</Text>
                </View>
                
                <View style={styles.profileItem}>
                  <View style={styles.profileItemLeft}>
                    <Text style={styles.profileItemIcon}>📧</Text>
                    <View style={styles.profileItemText}>
                      <Text style={styles.profileItemTitle}>Contact Us</Text>
                      <Text style={styles.profileItemSubtitle}>Send us feedback</Text>
                    </View>
                  </View>
                  <Text style={styles.profileItemRight}>▶️</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.app}>
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

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
    flex: 1,
    paddingHorizontal: ds.spacing.lg,
    paddingVertical: ds.spacing.md,
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
    color: ds.colors.secondaryText,
  },
  
  // Logo Styles
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ds.spacing.xl,
  },
  logoLetter: {
    ...ds.typography.logo,
    marginHorizontal: 2,
  },
  
  // Profile Header
  profileHeader: {
    ...ds.components.profileHeader,
  },
  profileAvatar: {
    ...ds.components.profileAvatar,
  },
  profileAvatarText: {
    fontSize: 32,
  },
  profileName: {
    ...ds.components.profileName,
  },
  profileSubtitle: {
    ...ds.components.profileSubtitle,
  },
  coinDisplay: {
    ...ds.components.coinDisplay,
  },
  coinIcon: {
    fontSize: 20,
  },
  coinText: {
    ...ds.components.coinText,
  },
  
  // Category Components
  categoryGrid: {
    ...ds.components.categoryGrid,
  },
  categoryGridItem: {
    ...ds.components.categoryGridItem,
  },
  categoryCard: {
    ...ds.components.categoryCard,
  },
  categoryIcon: {
    ...ds.components.categoryIcon,
  },
  categoryTitle: {
    ...ds.components.categoryTitle,
  },
  categorySubtitle: {
    ...ds.components.categorySubtitle,
  },
  
  // Story Components
  storyCard: {
    ...ds.components.storyCard,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    ...ds.components.storyTitle,
  },
  storySummary: {
    ...ds.components.storySummary,
  },
  storyMeta: {
    ...ds.components.storyMeta,
  },
  storyMetaLeft: {
    ...ds.components.storyMetaLeft,
  },
  storyMetaText: {
    ...ds.components.storyMetaText,
  },
  bookmarkButton: {
    ...ds.components.bookmarkButton,
  },
  bookmarkIcon: {
    ...ds.components.bookmarkIcon,
  },
  badge: {
    position: 'absolute',
    top: ds.spacing.sm,
    right: ds.spacing.sm,
    paddingHorizontal: ds.spacing.sm,
    paddingVertical: ds.spacing.xs,
    borderRadius: ds.borderRadius.small,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Navigation
  bottomNavigation: {
    ...ds.components.bottomNavigation,
  },
  navTab: {
    ...ds.components.navTab,
  },
  navTabActive: {
    ...ds.components.navTabActive,
  },
  navTabIcon: {
    ...ds.components.navTabIcon,
  },
  navTabText: {
    ...ds.components.navTabText,
  },
  navTabTextActive: {
    ...ds.components.navTabTextActive,
  },
  navTabTextInactive: {
    ...ds.components.navTabTextInactive,
  },
  
  // Section Headers
  sectionHeader: {
    ...ds.components.sectionHeader,
  },
  sectionTitle: {
    ...ds.components.sectionTitle,
  },
  sectionSubtitle: {
    ...ds.typography.body,
    color: ds.colors.secondaryText,
    marginTop: ds.spacing.xs,
  },
  seeAllButton: {
    ...ds.components.seeAllButton,
  },
  seeAllText: {
    ...ds.components.seeAllText,
  },
  
  // Empty States
  emptyState: {
    ...ds.components.emptyState,
  },
  emptyStateIcon: {
    ...ds.components.emptyStateIcon,
  },
  emptyStateTitle: {
    ...ds.components.emptyStateTitle,
  },
  emptyStateSubtitle: {
    ...ds.components.emptyStateSubtitle,
  },
  
  // Learning Components
  instructionText: {
    ...ds.components.instructionText,
  },
  achievementSection: {
    marginTop: ds.spacing.xl,
  },
  achievementCard: {
    ...ds.components.achievementCard,
  },
  achievementIcon: {
    ...ds.components.achievementIcon,
  },
  achievementTitle: {
    ...ds.components.achievementTitle,
  },
  achievementDescription: {
    ...ds.components.achievementDescription,
  },
  
  // Library Components
  libraryTabs: {
    flexDirection: 'row',
    marginBottom: ds.spacing.lg,
    backgroundColor: ds.colors.backgroundWhite,
    borderRadius: ds.borderRadius.medium,
    padding: ds.spacing.xs,
    ...ds.shadows.soft,
  },
  libraryTab: {
    flex: 1,
    paddingVertical: ds.spacing.sm,
    alignItems: 'center',
    borderRadius: ds.borderRadius.small,
  },
  libraryTabText: {
    ...ds.typography.small,
    fontWeight: '600',
    color: ds.colors.primaryText,
  },
  
  // Profile Components
  profileSection: {
    marginBottom: ds.spacing.xl,
  },
  profileItem: {
    ...ds.components.profileItem,
  },
  profileItemLeft: {
    ...ds.components.profileItemLeft,
  },
  profileItemIcon: {
    ...ds.components.profileItemIcon,
  },
  profileItemText: {
    ...ds.components.profileItemText,
  },
  profileItemTitle: {
    ...ds.components.profileItemTitle,
  },
  profileItemSubtitle: {
    ...ds.components.profileItemSubtitle,
  },
  profileItemRight: {
    ...ds.components.profileItemRight,
  },
  
  // Buttons
  generateButton: {
    ...ds.components.generateButton,
  },
  generateButtonText: {
    ...ds.components.generateButtonText,
  },
});

export default App;
