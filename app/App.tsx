import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StatusBar, 
  FlatList,
  Dimensions,
  LinearGradient
} from 'react-native';

// Import quiz app design system
import { QuizDS, QuizColors, QuizTypo, QuizSpacing, QuizComponents, QuizShadows, QuizIcons } from './src/config/quizAppDesignSystem';

// Import API hooks
import { useArticles, useVideos } from './src/hooks/useApi';

const { width: screenWidth } = Dimensions.get('window');

// User Profile Component (based on quiz app)
const UserProfile: React.FC = () => (
  <View style={styles.userProfileContainer}>
    <View style={styles.userAvatar}>
      <Text style={styles.userAvatarText}>👦</Text>
    </View>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>Young Explorer</Text>
      <View style={styles.coinsContainer}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.coinAmount}>12000</Text>
      </View>
    </View>
    <View style={styles.badgesContainer}>
      <View style={[styles.achievementBadge, { backgroundColor: QuizColors.achievements.blue }]}>
        <Text style={styles.badgeIcon}>🏆</Text>
      </View>
      <View style={[styles.achievementBadge, { backgroundColor: QuizColors.achievements.green }]}>
        <Text style={styles.badgeIcon}>⭐</Text>
      </View>
      <View style={[styles.achievementBadge, { backgroundColor: QuizColors.achievements.orange }]}>
        <Text style={styles.badgeIcon}>🎯</Text>
      </View>
    </View>
  </View>
);

// Game Card Component (for stories)
const GameCard: React.FC<{ 
  article: any;
  onPress: () => void;
}> = ({ article, onPress }) => {
  const getCategoryIcon = (category: string) => {
    return QuizIcons.categories[category?.toLowerCase()] || QuizIcons.categories.animals;
  };

  const getCategoryColor = (category: string) => {
    const colors = QuizDS.gamification.achievementColors;
    const index = Math.abs(category?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <TouchableOpacity style={styles.gameCard} onPress={onPress}>
      <View style={[styles.gameCardIllustration, { backgroundColor: getCategoryColor(article.category) }]}>
        <Text style={styles.gameCardIcon}>{getCategoryIcon(article.category)}</Text>
        
        {/* Badges */}
        {(article.is_breaking || article.is_trending) && (
          <View style={styles.gameCardBadges}>
            {article.is_breaking && (
              <View style={[styles.gameCardBadge, { backgroundColor: QuizColors.secondary.coral }]}>
                <Text style={styles.gameCardBadgeText}>🔥</Text>
              </View>
            )}
            {article.is_trending && (
              <View style={[styles.gameCardBadge, { backgroundColor: QuizColors.achievements.green }]}>
                <Text style={styles.gameCardBadgeText}>📈</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.gameCardContent}>
        <Text style={styles.gameCardTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.gameCardSubtitle} numberOfLines={2}>
          {article.summary}
        </Text>
        
        <View style={styles.gameCardFooter}>
          <Text style={styles.gameCardTime}>⏱️ {article.read_time || '3 min'}</Text>
          <TouchableOpacity style={styles.gameCardPlayButton}>
            <Text style={styles.gameCardPlayIcon}>▶️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Category Grid Component
const CategoryGrid: React.FC<{
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}> = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { id: 'all', name: 'All', icon: '🌟', color: QuizColors.primary.blue },
    { id: 'animals', name: 'Animals', icon: '🐾', color: QuizColors.achievements.green },
    { id: 'science', name: 'Science', icon: '🔬', color: QuizColors.achievements.purple },
    { id: 'space', name: 'Space', icon: '🚀', color: QuizColors.achievements.orange },
    { id: 'sports', name: 'Sports', icon: '⚽', color: QuizColors.secondary.teal },
    { id: 'education', name: 'Learning', icon: '📚', color: QuizColors.secondary.pink },
  ];

  return (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryCard,
            selectedCategory === category.id && [
              styles.activeCategoryCard,
              { borderColor: category.color, borderWidth: 3 }
            ]
          ]}
          onPress={() => onCategorySelect(category.id)}
        >
          <View style={[
            styles.categoryIcon,
            { backgroundColor: category.color + '20' }
          ]}>
            <Text style={styles.categoryIconText}>{category.icon}</Text>
          </View>
          <Text style={[
            styles.categoryLabel,
            selectedCategory === category.id && { color: category.color, fontWeight: 'bold' }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Coin Display Component
const CoinDisplay: React.FC = () => (
  <View style={styles.coinDisplay}>
    <Text style={styles.coinDisplayIcon}>🪙</Text>
    <Text style={styles.coinDisplayAmount}>100</Text>
    <TouchableOpacity style={styles.coinBuyButton}>
      <Text style={styles.coinBuyText}>Buy</Text>
    </TouchableOpacity>
  </View>
);

// Enhanced Bottom Navigation
const QuizBottomNav: React.FC<{ 
  activeTab: string; 
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'videos', label: 'Videos', icon: '📹' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.quizTabBarContainer}>
      <View style={styles.quizTabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.quizTab, isActive && styles.activeQuizTab]}
              onPress={() => onTabPress(tab.id)}
            >
              <Text style={[
                styles.quizTabIcon,
                isActive && { color: QuizColors.text.white }
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.quizTabLabel,
                isActive ? { color: QuizColors.text.white } : { color: QuizColors.text.secondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // API hooks for real data
  const { articles, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useArticles();
  const { videos, loading: videosLoading, error: videosError, refetch: refetchVideos } = useVideos();

  // Filter articles
  const filteredArticles = (articles || []).filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category?.toLowerCase() === selectedCategory;
    const matchesSearch = searchText === '' || 
      article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleArticlePress = (article: any) => {
    setSelectedArticle(article);
  };

  const handleVideoPress = (video: any) => {
    setSelectedVideo(video);
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    setSelectedVideo(null);
    setActiveTab('home');
  };

  // Home Screen with Quiz App Design
  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header with User Profile */}
      <View style={styles.header}>
        <UserProfile />
        <CoinDisplay />
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Good Afternoon! 🌅</Text>
        <Text style={styles.greetingSubtitle}>Ready for today's learning adventure?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.quizSearchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What would you like to learn?"
            placeholderTextColor={QuizColors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Topic 🎯</Text>
        <CategoryGrid
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </View>

      {/* Stories Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest Stories' : `${selectedCategory} Stories`} 📖
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {articlesLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🔄 Loading stories...</Text>
          </View>
        )}
        
        {articlesError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>😅 Oops! Something went wrong</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetchArticles}>
              <Text style={styles.retryButtonText}>🔄 Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.gameCardsContainer}>
          {!articlesLoading && !articlesError && filteredArticles.length > 0 && (
            filteredArticles.slice(0, 6).map((article, index) => (
              <GameCard
                key={`${article.id}-${index}`}
                article={article}
                onPress={() => handleArticlePress(article)}
              />
            ))
          )}
        </View>

        {!articlesLoading && !articlesError && filteredArticles.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🌟</Text>
            <Text style={styles.emptyText}>No stories found!</Text>
            <Text style={styles.emptySubtext}>Try selecting a different category</Text>
          </View>
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Videos Screen
  const renderVideosScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📹 Amazing Videos</Text>
      </View>

      <View style={styles.greetingSection}>
        <Text style={styles.greetingSubtitle}>Watch and learn with fun videos!</Text>
      </View>

      {videosLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔄 Loading videos...</Text>
        </View>
      )}

      {videosError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>😅 Oops! Let's try again</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetchVideos}>
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Other Screens
  const renderOtherScreen = (screenName: string, icon: string) => (
    <View style={styles.centerContent}>
      <Text style={styles.comingSoonIcon}>{icon}</Text>
      <Text style={styles.comingSoonTitle}>{screenName}</Text>
      <Text style={styles.comingSoonText}>Coming soon with amazing features!</Text>
      <TouchableOpacity style={styles.comingSoonButton}>
        <Text style={styles.comingSoonButtonText}>Stay Tuned ✨</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentScreen = () => {
    if (selectedArticle) {
      return renderOtherScreen('Article Detail', '📖');
    }
    if (selectedVideo) {
      return renderOtherScreen('Video Player', '🎬');
    }

    switch (activeTab) {
      case 'home':
        return renderHomeScreen();
      case 'videos':
        return renderVideosScreen();
      case 'library':
        return renderOtherScreen('Library', '📚');
      case 'profile':
        return renderOtherScreen('Profile', '👤');
      default:
        return renderHomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={QuizColors.backgrounds.primary} />
      {renderCurrentScreen()}
      {!selectedArticle && !selectedVideo && (
        <QuizBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QuizColors.backgrounds.primary,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: QuizSpacing.xl,
  },

  // Header & User Profile
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: QuizSpacing.lg,
    paddingTop: QuizSpacing.lg,
    paddingBottom: QuizSpacing.md,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: QuizColors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: QuizSpacing.md,
    ...QuizShadows.soft,
  },
  userAvatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: QuizTypo.sizes.title,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  coinAmount: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.primary.blue,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: QuizSpacing.sm,
  },
  achievementBadge: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...QuizShadows.subtle,
  },
  badgeIcon: {
    fontSize: 16,
  },

  // Coin Display
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: QuizDS.borderRadius.large,
    paddingHorizontal: QuizSpacing.md,
    paddingVertical: QuizSpacing.sm,
    ...QuizShadows.subtle,
  },
  coinDisplayIcon: {
    fontSize: 18,
    marginRight: QuizSpacing.sm,
  },
  coinDisplayAmount: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.bold,
    color: '#FF8C00',
    marginRight: QuizSpacing.sm,
  },
  coinBuyButton: {
    backgroundColor: QuizColors.primary.blue,
    borderRadius: QuizDS.borderRadius.medium,
    paddingHorizontal: QuizSpacing.md,
    paddingVertical: 4,
  },
  coinBuyText: {
    fontSize: QuizTypo.sizes.caption,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.white,
  },

  // Greeting Section
  greetingSection: {
    paddingHorizontal: QuizSpacing.lg,
    marginBottom: QuizSpacing.xl,
  },
  greetingTitle: {
    fontSize: QuizTypo.sizes.heroTitle,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
    marginBottom: QuizSpacing.xs,
  },
  greetingSubtitle: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.secondary,
  },
  screenTitle: {
    fontSize: QuizTypo.sizes.heroTitle,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
  },

  // Search
  searchSection: {
    paddingHorizontal: QuizSpacing.lg,
    marginBottom: QuizSpacing.xl,
  },
  quizSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: QuizColors.backgrounds.secondary,
    borderRadius: QuizDS.borderRadius.large,
    paddingHorizontal: QuizSpacing.lg,
    paddingVertical: QuizSpacing.md,
    ...QuizShadows.soft,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: QuizSpacing.md,
    color: QuizColors.text.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.primary,
  },

  // Sections
  section: {
    marginBottom: QuizSpacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: QuizSpacing.lg,
    marginBottom: QuizSpacing.lg,
  },
  sectionTitle: {
    fontSize: QuizTypo.sizes.title,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
  },
  seeAllText: {
    fontSize: QuizTypo.sizes.caption,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.primary.blue,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: QuizSpacing.lg,
    gap: QuizSpacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: QuizColors.backgrounds.secondary,
    borderRadius: QuizDS.borderRadius.large,
    padding: QuizSpacing.lg,
    alignItems: 'center',
    width: (screenWidth - (QuizSpacing.lg * 2) - (QuizSpacing.md * 2)) / 3,
    minHeight: 90,
    ...QuizShadows.soft,
  },
  activeCategoryCard: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: QuizSpacing.sm,
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: QuizTypo.sizes.caption,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.primary,
    textAlign: 'center',
  },

  // Game Cards
  gameCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: QuizSpacing.lg,
    gap: QuizSpacing.md,
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: QuizColors.backgrounds.secondary,
    borderRadius: QuizDS.borderRadius.large,
    width: (screenWidth - (QuizSpacing.lg * 2) - QuizSpacing.md) / 2,
    ...QuizShadows.soft,
    overflow: 'hidden',
  },
  gameCardIllustration: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gameCardIcon: {
    fontSize: 32,
  },
  gameCardBadges: {
    position: 'absolute',
    top: QuizSpacing.sm,
    left: QuizSpacing.sm,
    flexDirection: 'row',
    gap: QuizSpacing.xs,
  },
  gameCardBadge: {
    borderRadius: QuizDS.borderRadius.small,
    paddingHorizontal: QuizSpacing.sm,
    paddingVertical: 2,
  },
  gameCardBadgeText: {
    fontSize: 12,
  },
  gameCardContent: {
    padding: QuizSpacing.md,
  },
  gameCardTitle: {
    fontSize: QuizTypo.sizes.subtitle,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
    marginBottom: QuizSpacing.xs,
    lineHeight: QuizTypo.lineHeights.tight * QuizTypo.sizes.subtitle,
  },
  gameCardSubtitle: {
    fontSize: QuizTypo.sizes.caption,
    fontWeight: QuizTypo.weights.regular,
    color: QuizColors.text.secondary,
    marginBottom: QuizSpacing.md,
    lineHeight: QuizTypo.lineHeights.normal * QuizTypo.sizes.caption,
  },
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameCardTime: {
    fontSize: QuizTypo.sizes.small,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.secondary,
  },
  gameCardPlayButton: {
    backgroundColor: QuizColors.secondary.pink,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameCardPlayIcon: {
    fontSize: 12,
  },

  // Bottom Navigation
  quizTabBarContainer: {
    paddingHorizontal: QuizSpacing.lg,
    paddingBottom: QuizSpacing.lg,
    backgroundColor: QuizColors.backgrounds.primary,
  },
  quizTabBar: {
    flexDirection: 'row',
    backgroundColor: QuizColors.backgrounds.secondary,
    borderRadius: 25,
    paddingVertical: QuizSpacing.sm,
    paddingHorizontal: QuizSpacing.sm,
    ...QuizShadows.medium,
    height: 60,
  },
  quizTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: QuizSpacing.sm,
    borderRadius: 20,
  },
  activeQuizTab: {
    backgroundColor: QuizColors.primary.blue,
  },
  quizTabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  quizTabLabel: {
    fontSize: QuizTypo.sizes.small,
    fontWeight: QuizTypo.weights.medium,
  },

  // States
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: QuizSpacing.huge,
  },
  loadingText: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: QuizSpacing.huge,
    paddingHorizontal: QuizSpacing.lg,
  },
  errorText: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.secondary,
    textAlign: 'center',
    marginBottom: QuizSpacing.lg,
  },
  retryButton: {
    backgroundColor: QuizColors.primary.blue,
    borderRadius: QuizDS.borderRadius.large,
    paddingHorizontal: QuizSpacing.xl,
    paddingVertical: QuizSpacing.md,
  },
  retryButtonText: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.white,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: QuizSpacing.huge,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: QuizSpacing.lg,
  },
  emptyText: {
    fontSize: QuizTypo.sizes.title,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
    marginBottom: QuizSpacing.xs,
  },
  emptySubtext: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.regular,
    color: QuizColors.text.secondary,
    textAlign: 'center',
  },

  // Coming Soon
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: QuizSpacing.xl,
  },
  comingSoonTitle: {
    fontSize: QuizTypo.sizes.heroTitle,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.primary,
    marginBottom: QuizSpacing.lg,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.medium,
    color: QuizColors.text.secondary,
    marginBottom: QuizSpacing.xl,
    textAlign: 'center',
    lineHeight: QuizTypo.lineHeights.relaxed * QuizTypo.sizes.body,
  },
  comingSoonButton: {
    backgroundColor: QuizColors.primary.blue,
    borderRadius: QuizDS.borderRadius.large,
    paddingHorizontal: QuizSpacing.xl,
    paddingVertical: QuizSpacing.lg,
    ...QuizShadows.soft,
  },
  comingSoonButtonText: {
    fontSize: QuizTypo.sizes.body,
    fontWeight: QuizTypo.weights.bold,
    color: QuizColors.text.white,
  },
});