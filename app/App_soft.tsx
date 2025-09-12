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
import { softKidszooDesignSystem } from './src/config/softKidszooDesignSystem';
import { API_CONFIG, API_ENDPOINTS } from './src/config/api';
import StoryDetailScreen from './src/screens/StoryDetailScreen';

const { width } = Dimensions.get('window');
const ds = softKidszooDesignSystem;

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

// Soft Logo Component with pastel colors
const SoftLogo: React.FC = () => {
  const logoColors = [
    ds.colors.accentPurple,   // K
    ds.colors.accentPink,     // i
    ds.colors.accentBlue,     // d
    ds.colors.accentGreen,    // s
    ds.colors.accentOrange,   // z
    ds.colors.accentPink,     // o
    ds.colors.accentOrange,   // o
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

// Soft Profile Header Component
const SoftProfileHeader: React.FC = () => {
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

// Soft Category Card Component
const SoftCategoryCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor }]} onPress={onPress}>
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categorySubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

// Soft Story Card Component
const SoftStoryCard: React.FC<{
  article: Article;
  onPress: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}> = ({ article, onPress, onBookmark, isBookmarked }) => {
  const getBadgeStyle = () => {
    if (article.is_breaking) return { backgroundColor: ds.colors.accentCoral };
    if (article.is_trending) return { backgroundColor: ds.colors.accentMint };
    if (article.is_hot) return { backgroundColor: ds.colors.accentPeach };
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

// Soft Learning Categories Component
const SoftLearningCategories: React.FC<{ onCategoryPress: (category: string) => void }> = ({ onCategoryPress }) => {
  const categories = [
    { 
      icon: '🔢', 
      title: 'Numbers', 
      subtitle: '(números)', 
      backgroundColor: ds.colors.accentSky,
      key: 'numbers' 
    },
    { 
      icon: '📖', 
      title: 'Reading', 
      subtitle: 'Stories & Books', 
      backgroundColor: ds.colors.accentLime,
      key: 'reading' 
    },
    { 
      icon: '🔺', 
      title: 'Shapes', 
      subtitle: 'Geometry Fun', 
      backgroundColor: ds.colors.accentRose,
      key: 'shapes' 
    },
    { 
      icon: '📝', 
      title: 'Vocab & Letters', 
      subtitle: 'Words & Language', 
      backgroundColor: ds.colors.accentAqua,
      key: 'vocabulary' 
    },
    { 
      icon: '📊', 
      title: 'Learning Analysis', 
      subtitle: 'Progress Tracking', 
      backgroundColor: ds.colors.accentLilac,
      key: 'analysis' 
    },
    { 
      icon: '⚙️', 
      title: 'Settings', 
      subtitle: 'App Preferences', 
      backgroundColor: ds.colors.accentCream,
      key: 'settings' 
    },
  ];

  return (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <View key={category.key} style={styles.categoryGridItem}>
          <SoftCategoryCard
            icon={category.icon}
            title={category.title}
            subtitle={category.subtitle}
            backgroundColor={category.backgroundColor}
            onPress={() => onCategoryPress(category.key)}
          />
        </View>
      ))}
    </View>
  );
};

// Soft Bottom Navigation Component
const SoftBottomNavigation: React.FC<{
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
      // Add mock data when backend is not available
      setArticles([
        {
          id: '1',
          title: 'Amazing Ocean Robot Saves Marine Life',
          headline: 'Kids create robot to clean the ocean!',
          summary: 'A group of young scientists built an incredible robot that helps clean plastic from the ocean and saves sea animals.',
          content: 'In an amazing story of innovation, a team of kids aged 10-12 created a special robot called "Ocean Helper" that swims through the ocean collecting plastic bottles, bags, and other trash that hurts sea creatures. The robot looks like a friendly whale and has been working for 6 months, cleaning over 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes thanks to these amazing young inventors.',
          category: 'science',
          author: 'Ocean News Team',
          published_date: '2024-01-15',
          read_time: '3 min read',
          is_breaking: 1,
          is_trending: 0,
          is_hot: 0,
          views: 1250,
          likes: 89,
          comments: 23
        },
        {
          id: '2',
          title: 'Young Scientists Discover New Butterfly Species',
          headline: 'Kids find new butterfly in Amazon rainforest!',
          summary: 'Elementary school students discovered a beautiful new species of butterfly during their nature walk in the Amazon.',
          content: 'During a school trip to the Amazon rainforest, students from Green Valley Elementary made an incredible discovery! They found a new species of butterfly with bright purple and gold wings. Their teacher, Ms. Lily, said the students showed amazing observation skills. This discovery helps scientists understand more about our planet\'s amazing biodiversity and shows that anyone can make important scientific discoveries!',
          category: 'science',
          author: 'Nature Discovery Team',
          published_date: '2024-01-14',
          read_time: '2 min read',
          is_breaking: 0,
          is_trending: 1,
          is_hot: 0,
          views: 980,
          likes: 67,
          comments: 15
        },
        {
          id: '3',
          title: 'Kids Build Solar-Powered School Bus',
          headline: 'Students create eco-friendly transportation!',
          summary: 'Elementary students designed and built a mini solar-powered school bus that runs entirely on sunlight.',
          content: 'Students from Sunshine Elementary have built something amazing - a mini school bus that runs entirely on solar power! The bus can carry up to 5 children and was designed to show how renewable energy can be used for transportation. The project took 6 months and involved learning about engineering, solar technology, and environmental science. It\'s a bright idea for a greener future!',
          category: 'technology',
          author: 'Green Tech Kids',
          published_date: '2024-01-13',
          read_time: '4 min read',
          is_breaking: 0,
          is_trending: 0,
          is_hot: 1,
          views: 2100,
          likes: 156,
          comments: 42
        },
        {
          id: '4',
          title: 'Students Plant 50,000 Trees to Fight Climate Change',
          headline: 'Kids lead massive tree-planting campaign!',
          summary: 'Elementary school students organized a community tree-planting event that resulted in 50,000 new trees being planted.',
          content: 'Students from Forest Elementary School organized the biggest tree-planting event in their city\'s history! Over 500 kids, parents, and community members came together to plant 50,000 trees in local parks and neighborhoods. The students learned about how trees help fight climate change by absorbing carbon dioxide and producing oxygen. This amazing project shows how kids can make a real difference in protecting our planet!',
          category: 'environment',
          author: 'Green Earth Kids',
          published_date: '2024-01-12',
          read_time: '3 min read',
          is_breaking: 1,
          is_trending: 1,
          is_hot: 0,
          views: 3200,
          likes: 234,
          comments: 67
        },
        {
          id: '5',
          title: 'Young Athletes Start Inclusive Sports Program',
          headline: 'Kids create sports program for everyone!',
          summary: 'A group of young athletes launched a new sports program to ensure all children can play together, including those with disabilities.',
          content: 'A group of young athletes in London has launched an amazing new sports program called "Unity Games"! The program offers adapted sports like wheelchair basketball and sensory-friendly soccer to ensure all children, including those with disabilities, can play together. The founders, aged 9 to 11, believe everyone deserves a chance to play and have fun. It\'s a heartwarming example of teamwork, kindness, and inclusion!',
          category: 'sports',
          author: 'Unity Sports Crew',
          published_date: '2024-01-11',
          read_time: '3 min read',
          is_breaking: 0,
          is_trending: 0,
          is_hot: 0,
          views: 890,
          likes: 78,
          comments: 19
        }
      ]);
      setVideos([
        {
          id: 'video_1',
          article_id: '1',
          title: 'Amazing Ocean Robot Saves Marine Life',
          description: 'Watch the incredible story of kids who built a robot to clean the ocean!',
          file_path: '/videos/1.mp4',
          thumbnail_path: '/thumbnails/1.jpg',
          duration: '5:30',
          status: 'ready',
          upload_date: '2024-01-15'
        },
        {
          id: 'video_2',
          article_id: '2',
          title: 'Young Scientists Discover New Butterfly Species',
          description: 'See how kids discovered a new butterfly species in the Amazon!',
          file_path: '/videos/2.mp4',
          thumbnail_path: '/thumbnails/2.jpg',
          duration: '4:45',
          status: 'ready',
          upload_date: '2024-01-14'
        }
      ]);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ds.colors.accentBlue} />
        <Text style={styles.loadingText}>Loading amazing content...</Text>
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    if (showStoryDetail && selectedArticle) {
      return <StoryDetailScreen article={selectedArticle} onBack={handleBackFromStory} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <SoftLogo />
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest Stories 📖</Text>
                <TouchableOpacity onPress={() => Alert.alert('See All Stories', `Showing all ${articles.length} stories!`)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {articles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>⭐</Text>
                  <Text style={styles.emptyStateTitle}>No stories found!</Text>
                  <Text style={styles.emptyStateSubtitle}>Check back later for new amazing stories!</Text>
                </View>
              ) : (
                articles.slice(0, 5).map((article) => (
                  <SoftStoryCard
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
              
              <SoftLearningCategories onCategoryPress={handleCategoryPress} />
              
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
                    <SoftStoryCard
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
            <SoftProfileHeader />
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
      {!showStoryDetail && <SoftBottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: ds.colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: ds.colors.backgroundPrimary,
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
    backgroundColor: ds.colors.backgroundPrimary,
  },
  loadingText: {
    ...ds.typography.body,
    marginTop: ds.spacing.md,
    color: ds.colors.textSecondary,
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
    fontSize: 24,
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
    fontSize: 16,
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
    ...ds.components.badge,
  },
  badgeText: {
    ...ds.components.badgeText,
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
    ...ds.typography.bodySmall,
    color: ds.colors.textSecondary,
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
    ...ds.components.libraryTabs,
  },
  libraryTab: {
    ...ds.components.libraryTab,
  },
  libraryTabText: {
    ...ds.components.libraryTabText,
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
