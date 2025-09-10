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
  ImageBackground
} from 'react-native';

// Import comprehensive design system
import { DS, Colors, Typography, Spacing, Components, Layouts, Icons } from './src/config/comprehensiveDesignSystem';

// Import API hooks
import { useArticles, useVideos } from './src/hooks/useApi';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced Character Mascot Component
const EnhancedMascot: React.FC<{ 
  message: string; 
  character?: string; 
  emotion?: string;
}> = ({ message, character = '🦉', emotion = 'happy' }) => (
  <View style={styles.mascotContainer}>
    <View style={styles.mascotCharacter}>
      <Text style={styles.mascotEmoji}>{character}</Text>
      <Text style={styles.emotionIndicator}>{Icons.emotions[emotion]}</Text>
    </View>
    <View style={styles.enhancedSpeechBubble}>
      <Text style={styles.speechText}>{message}</Text>
      <View style={styles.speechTail} />
    </View>
  </View>
);

// Enhanced Story Card Component
const EnhancedStoryCard: React.FC<{ 
  article: any;
  onPress: () => void;
}> = ({ article, onPress }) => {
  const getCategoryIcon = (category: string) => {
    return Icons.categories[category?.toLowerCase()] || Icons.categories.animals;
  };

  const getCategoryColor = (category: string) => {
    return Colors.categoryColors[category?.toLowerCase()] || Colors.primary.orange;
  };

  return (
    <TouchableOpacity style={styles.enhancedStoryCard} onPress={onPress}>
      {/* Story Illustration */}
      <View style={[styles.storyIllustration, { backgroundColor: Colors.backgrounds.lightPeach }]}>
        <Text style={styles.storyIllustrationIcon}>{getCategoryIcon(article.category)}</Text>
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {article.is_breaking && (
            <View style={[styles.badge, { backgroundColor: Colors.accents.error }]}>
              <Text style={styles.badgeText}>🔥 Breaking</Text>
            </View>
          )}
          {article.is_trending && (
            <View style={[styles.badge, { backgroundColor: Colors.accents.success }]}>
              <Text style={styles.badgeText}>📈 Hot</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.storyContent}>
        {/* Category */}
        <View style={[styles.categoryChip, { backgroundColor: getCategoryColor(article.category) }]}>
          <Text style={styles.categoryChipText}>
            {getCategoryIcon(article.category)} {article.category}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.storyTitle} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Summary */}
        <Text style={styles.storySummary} numberOfLines={3}>
          {article.summary}
        </Text>

        {/* Footer */}
        <View style={styles.storyFooter}>
          <Text style={styles.readTime}>⏱️ {article.read_time || '3 min'}</Text>
          <TouchableOpacity style={styles.enhancedPlayButton}>
            <Text style={styles.playButtonText}>▶️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Enhanced Category Selector
const EnhancedCategorySelector: React.FC<{
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}> = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { id: 'all', name: 'All Stories', icon: '🌟', color: Colors.primary.orange },
    { id: 'animals', name: 'Animals', icon: '🐾', color: Colors.categoryColors.animals },
    { id: 'science', name: 'Science', icon: '🔬', color: Colors.categoryColors.science },
    { id: 'space', name: 'Space', icon: '🚀', color: Colors.categoryColors.space },
    { id: 'adventure', name: 'Adventure', icon: '🗺️', color: Colors.categoryColors.adventure },
    { id: 'magic', name: 'Magic', icon: '✨', color: Colors.categoryColors.magic },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesScrollContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.enhancedCategoryCard,
            selectedCategory === category.id && [
              styles.activeCategoryCard,
              { backgroundColor: category.color }
            ]
          ]}
          onPress={() => onCategorySelect(category.id)}
        >
          <View style={[
            styles.categoryIconContainer,
            selectedCategory === category.id && styles.activeCategoryIcon
          ]}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </View>
          <Text style={[
            styles.categoryName,
            selectedCategory === category.id && styles.activeCategoryName
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Enhanced Bottom Navigation
const EnhancedBottomNav: React.FC<{ 
  activeTab: string; 
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', activeIcon: '🏡' },
    { id: 'videos', label: 'Videos', icon: '📹', activeIcon: '🎬' },
    { id: 'bookmarks', label: 'Library', icon: '📚', activeIcon: '📖' },
    { id: 'account', label: 'Profile', icon: '👤', activeIcon: '👦' },
  ];

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.enhancedTabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.enhancedTab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab.id)}
            >
              <View style={[
                styles.tabIconWrapper,
                isActive && styles.activeTabIcon
              ]}>
                <Text style={styles.tabIcon}>
                  {isActive ? tab.activeIcon : tab.icon}
                </Text>
              </View>
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
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

  // Home Screen
  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header */}
      <View style={styles.enhancedHeader}>
        <View>
          <Text style={styles.greetingText}>Good morning! 🌅</Text>
          <Text style={styles.userNameText}>Young Explorer</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Enhanced Mascot */}
      <EnhancedMascot 
        message="Ready to discover amazing stories today?" 
        character="🦉" 
        emotion="excited"
      />

      {/* Enhanced Search */}
      <View style={styles.searchSection}>
        <View style={styles.enhancedSearchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What adventure shall we explore?"
            placeholderTextColor={Colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.voiceSearchButton}>
            <Text style={styles.voiceIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Adventure 🎯</Text>
        <EnhancedCategorySelector
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Adventures 🚀</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors.secondary.mint }]}>
            <Text style={styles.quickActionIcon}>🧩</Text>
            <Text style={styles.quickActionText}>Daily Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors.secondary.skyBlue }]}>
            <Text style={styles.quickActionIcon}>🎬</Text>
            <Text style={styles.quickActionText}>Watch Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors.secondary.lavender }]}>
            <Text style={styles.quickActionIcon}>📚</Text>
            <Text style={styles.quickActionText}>My Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors.primary.coral }]}>
            <Text style={styles.quickActionIcon}>🏆</Text>
            <Text style={styles.quickActionText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest Adventures' : `${selectedCategory} Stories`} 📖
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {articlesLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🔄 Loading amazing stories...</Text>
          </View>
        )}
        
        {articlesError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>😅 Oops! Let's try again</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetchArticles}>
              <Text style={styles.retryButtonText}>🔄 Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!articlesLoading && !articlesError && filteredArticles.length > 0 && (
          filteredArticles.map((article, index) => (
            <EnhancedStoryCard
              key={`${article.id}-${index}`}
              article={article}
              onPress={() => handleArticlePress(article)}
            />
          ))
        )}

        {!articlesLoading && !articlesError && filteredArticles.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🌟</Text>
            <Text style={styles.emptyText}>No stories found!</Text>
            <Text style={styles.emptySubtext}>Try a different category or search term</Text>
          </View>
        )}
      </View>

      {/* Fun Fact */}
      <View style={styles.funFactCard}>
        <Text style={styles.funFactTitle}>🎉 Amazing Fact!</Text>
        <Text style={styles.funFactText}>
          Did you know that octopuses have three hearts? Two pump blood to their gills, and one pumps blood to the rest of their body! 🐙
        </Text>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Videos Screen
  const renderVideosScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.enhancedHeader}>
        <Text style={styles.screenTitle}>🎬 Amazing Videos</Text>
      </View>

      <EnhancedMascot 
        message="Let's watch some incredible videos together!" 
        character="🎭" 
        emotion="excited"
      />

      {videosLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔄 Loading awesome videos...</Text>
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
      <EnhancedMascot 
        message={`${screenName} coming soon! 🚧`} 
        character={icon} 
        emotion="curious"
      />
      <Text style={styles.comingSoonTitle}>{screenName}</Text>
      <Text style={styles.comingSoonText}>We're working hard to bring you amazing features!</Text>
      <Text style={styles.comingSoonEmoji}>✨</Text>
    </View>
  );

  const renderCurrentScreen = () => {
    if (selectedArticle) {
      // Article detail screen would go here
      return renderOtherScreen('Article Detail', '📖');
    }
    if (selectedVideo) {
      // Video player screen would go here
      return renderOtherScreen('Video Player', '🎬');
    }

    switch (activeTab) {
      case 'home':
        return renderHomeScreen();
      case 'videos':
        return renderVideosScreen();
      case 'bookmarks':
        return renderOtherScreen('Library', '📚');
      case 'account':
        return renderOtherScreen('Profile', '👤');
      default:
        return renderHomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgrounds.cream} />
      {renderCurrentScreen()}
      {!selectedArticle && !selectedVideo && (
        <EnhancedBottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.cream,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  // Enhanced Header
  enhancedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greetingText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  userNameText: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: 4,
  },
  screenTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  notificationButton: {
    backgroundColor: Colors.primary.orange,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...DS.shadows.soft,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accents.error,
  },

  // Enhanced Mascot
  mascotContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  mascotCharacter: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  mascotEmoji: {
    fontSize: 64,
  },
  emotionIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: 20,
  },
  enhancedSpeechBubble: {
    backgroundColor: Colors.backgrounds.softWhite,
    borderRadius: DS.borderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: screenWidth - 64,
    ...DS.shadows.soft,
    position: 'relative',
  },
  speechText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.body,
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.backgrounds.softWhite,
  },

  // Enhanced Search
  searchSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  enhancedSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgrounds.softWhite,
    borderRadius: DS.borderRadius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...DS.shadows.soft,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    color: Colors.text.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
  },
  voiceSearchButton: {
    backgroundColor: Colors.primary.orange,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 16,
  },

  // Sections
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.primary.orange,
  },

  // Enhanced Categories
  categoriesScrollContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  enhancedCategoryCard: {
    backgroundColor: Colors.backgrounds.softWhite,
    borderRadius: DS.borderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginRight: Spacing.sm,
    minWidth: 80,
    ...DS.shadows.soft,
  },
  activeCategoryCard: {
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgrounds.lightPeach,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  activeCategoryIcon: {
    backgroundColor: Colors.backgrounds.softWhite,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  activeCategoryName: {
    color: Colors.backgrounds.softWhite,
    fontWeight: Typography.weights.bold,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    minWidth: (screenWidth - 64) / 2 - 8,
    backgroundColor: Colors.primary.orange,
    borderRadius: DS.borderRadius.medium,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...DS.shadows.soft,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.text.white,
  },

  // Enhanced Story Cards
  enhancedStoryCard: {
    backgroundColor: Colors.backgrounds.softWhite,
    borderRadius: DS.borderRadius.large,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...DS.shadows.soft,
  },
  storyIllustration: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  storyIllustrationIcon: {
    fontSize: 48,
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
    color: Colors.text.white,
  },
  storyContent: {
    padding: Spacing.md,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: Spacing.sm,
  },
  categoryChipText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
    color: Colors.text.white,
  },
  storyTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.subtitle,
  },
  storySummary: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.body,
    marginBottom: Spacing.md,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  enhancedPlayButton: {
    backgroundColor: Colors.primary.coral,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...DS.shadows.soft,
  },
  playButtonText: {
    fontSize: 16,
  },

  // Enhanced Bottom Navigation
  bottomNavContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.backgrounds.cream,
  },
  enhancedTabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.backgrounds.softWhite,
    borderRadius: DS.borderRadius.xlarge,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
    ...DS.shadows.soft,
    height: 70,
  },
  enhancedTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: DS.borderRadius.large,
  },
  activeTab: {
    backgroundColor: Colors.backgrounds.lightPeach,
  },
  tabIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeTabIcon: {
    backgroundColor: Colors.primary.orange,
    ...DS.shadows.soft,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  activeTabLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  // States
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary.orange,
    borderRadius: DS.borderRadius.large,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  retryButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.text.white,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Fun Fact
  funFactCard: {
    backgroundColor: Colors.backgrounds.lightPeach,
    borderRadius: DS.borderRadius.large,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    ...DS.shadows.soft,
  },
  funFactTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  funFactText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.body,
  },

  // Coming Soon
  comingSoonTitle: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.body,
  },
  comingSoonEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
});