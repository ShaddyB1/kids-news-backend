import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playfulKidsDesignSystem as ds } from './src/config/playfulKidsDesignSystem';
import { API_CONFIG, API_ENDPOINTS } from './src/config/api';
import StoryDetailScreen from './src/screens/StoryDetailScreen';

const { width, height } = Dimensions.get('window');

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
  is_breaking?: number;
  is_trending?: number;
  is_hot?: number;
  views?: number;
  likes?: number;
  comments?: number;
}

interface Video {
  id: string;
  article_id?: string;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  duration: string;
  status: string;
  upload_date: string;
}

// Giraffe Mascot Component
const GiraffeMascot: React.FC<{ size?: 'small' | 'medium' | 'large'; mood?: 'happy' | 'excited' | 'thinking' }> = ({ 
  size = 'medium', 
  mood = 'happy' 
}) => {
  const dimensions = {
    small: 60,
    medium: 100,
    large: 150
  }[size];

  const emoji = {
    happy: '🦒',
    excited: '🦒',
    thinking: '🦒'
  }[mood];

  return (
    <View style={[styles.mascotContainer, { width: dimensions, height: dimensions }]}>
      <Text style={{ fontSize: dimensions * 0.8 }}>{emoji}</Text>
    </View>
  );
};

// Category Icon Component
const CategoryIcon: React.FC<{ category: string; size?: number }> = ({ category, size = 24 }) => {
  const icons: { [key: string]: string } = {
    environment: '🌍',
    science: '🔬',
    technology: '💻',
    sports: '⚽',
    health: '🏥',
    education: '📚',
    animals: '🦁',
    space: '🚀',
    art: '🎨',
    music: '🎵',
    all: '✨'
  };

  return <Text style={{ fontSize: size }}>{icons[category] || '📰'}</Text>;
};

// Story Card Component
const StoryCard: React.FC<{ 
  article: Article; 
  onPress: () => void;
  variant?: 'default' | 'featured' | 'compact';
}> = ({ article, onPress, variant = 'default' }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (variant === 'featured') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.featuredCardImage}>
            <CategoryIcon category={article.category} size={60} />
          </View>
          <View style={styles.featuredCardContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{article.category}</Text>
            </View>
            <Text style={styles.featuredCardTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.featuredCardSummary} numberOfLines={2}>
              {article.summary}
            </Text>
            <View style={styles.featuredCardMeta}>
              <Text style={styles.metaText}>📖 {article.read_time}</Text>
              {article.is_trending ? <Text style={styles.trendingBadge}>🔥 Trending</Text> : null}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.compactCardIcon}>
          <CategoryIcon category={article.category} size={32} />
        </View>
        <View style={styles.compactCardContent}>
          <Text style={styles.compactCardTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.compactCardMeta}>{article.read_time} • {article.category}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.storyCard}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.storyCardImage}>
          <CategoryIcon category={article.category} size={40} />
        </View>
        <View style={styles.storyCardContent}>
          <Text style={styles.storyCardCategory}>{article.category}</Text>
          <Text style={styles.storyCardTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.storyCardMeta}>
            <Text style={styles.metaText}>📖 {article.read_time}</Text>
            <Text style={styles.metaText}>👁 {article.views || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Bottom Navigation Component
const BottomNavigation: React.FC<{
  activeTab: string;
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'discover', icon: '🔍', label: 'Discover' },
    { id: 'library', icon: '📚', label: 'Library' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.navItem}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.navItemContent,
            activeTab === tab.id && styles.navItemActive
          ]}>
            <Text style={[
              styles.navIcon,
              activeTab === tab.id && styles.navIconActive
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.navLabel,
              activeTab === tab.id && styles.navLabelActive
            ]}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Home Screen Component
const HomeScreen: React.FC<{
  articles: Article[];
  onArticlePress: (article: Article) => void;
}> = ({ articles, onArticlePress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: '✨' },
    { id: 'environment', name: 'Environment', icon: '🌍' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'health', name: 'Health', icon: '🏥' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles[0];
  const recentArticles = filteredArticles.slice(1, 4);
  const moreArticles = filteredArticles.slice(4);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Mascot */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, Friend! 👋</Text>
            <Text style={styles.headerTitle}>What will you learn today?</Text>
          </View>
          <GiraffeMascot size="small" mood="happy" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stories..."
            placeholderTextColor={ds.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
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
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Story */}
      {featuredArticle && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Story 🌟</Text>
          <StoryCard
            article={featuredArticle}
            onPress={() => onArticlePress(featuredArticle)}
            variant="featured"
          />
        </View>
      )}

      {/* Recent Stories */}
      {recentArticles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Stories 📰</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentArticles.map((article) => (
              <View key={article.id} style={{ marginRight: ds.spacing.md }}>
                <StoryCard
                  article={article}
                  onPress={() => onArticlePress(article)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* More Stories */}
      {moreArticles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More to Explore 🚀</Text>
          {moreArticles.map((article) => (
            <StoryCard
              key={article.id}
              article={article}
              onPress={() => onArticlePress(article)}
              variant="compact"
            />
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// Discover Screen Component
const DiscoverScreen: React.FC<{
  articles: Article[];
  onArticlePress: (article: Article) => void;
}> = ({ articles, onArticlePress }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ds.animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const topics = [
    { id: 'trending', name: 'Trending Now', icon: '🔥', color: ds.colors.accent.coral, description: 'What everyone is reading!' },
    { id: 'new', name: 'New Stories', icon: '✨', color: ds.colors.primary.yellow, description: 'Fresh from today!' },
    { id: 'popular', name: 'Most Popular', icon: '⭐', color: ds.colors.primary.orange, description: 'Top rated stories' },
    { id: 'educational', name: 'Learn & Grow', icon: '🎓', color: ds.colors.accent.mint, description: 'Educational content' },
    { id: 'fun', name: 'Fun & Games', icon: '🎮', color: ds.colors.accent.skyBlue, description: 'Entertainment stories' },
    { id: 'creative', name: 'Be Creative', icon: '🎨', color: ds.colors.accent.pink, description: 'Arts and crafts' },
  ];

  const categories = [
    { id: 'environment', name: 'Nature', emoji: '🌍', gradient: ['#4ECDC4', '#44A08D'] },
    { id: 'science', name: 'Science', emoji: '🔬', gradient: ['#667EEA', '#764BA2'] },
    { id: 'technology', name: 'Tech', emoji: '💻', gradient: ['#F093FB', '#F5576C'] },
    { id: 'sports', name: 'Sports', emoji: '⚽', gradient: ['#4FACFE', '#00F2FE'] },
    { id: 'health', name: 'Health', emoji: '🏥', gradient: ['#43E97B', '#38F9D7'] },
    { id: 'animals', name: 'Animals', emoji: '🦁', gradient: ['#FA709A', '#FEE140'] },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = !selectedTopic || (
      selectedTopic === 'trending' ? article.is_trending :
      selectedTopic === 'new' ? true :
      selectedTopic === 'popular' ? (article.views || 0) > 2000 :
      true
    );
    
    return matchesSearch && matchesTopic;
  });

  const handleTopicPress = (topicId: string) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    Animated.spring(fadeAnim, {
      toValue: 0.8,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.discoverHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.discoverHeaderBg}>
          <View style={styles.discoverHeaderPattern} />
        </View>
        <GiraffeMascot size="large" mood="excited" />
        <Text style={styles.discoverTitle}>Discover Amazing Stories!</Text>
        <Text style={styles.discoverSubtitle}>What interests you today?</Text>
        
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.discoverSearchBar}
          onPress={() => setSearchMode(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.discoverSearchPlaceholder}>
            {searchQuery || 'Search for stories...'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statBubble}>
          <Text style={styles.statNumber}>{articles.length}</Text>
          <Text style={styles.statLabel}>Stories</Text>
        </View>
        <View style={styles.statBubble}>
          <Text style={styles.statNumber}>{articles.filter(a => a.is_trending).length}</Text>
          <Text style={styles.statLabel}>Trending</Text>
        </View>
        <View style={styles.statBubble}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Topics</Text>
        </View>
      </View>

      {/* Topics Carousel */}
      <View style={styles.topicsSection}>
        <Text style={styles.topicsSectionTitle}>Explore Topics 🌟</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsCarousel}
        >
          {topics.map((topic, index) => {
            const isSelected = selectedTopic === topic.id;
            const animatedScale = new Animated.Value(1);
            
            return (
              <Animated.View
                key={topic.id}
                style={{
                  transform: [{ scale: animatedScale }]
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.topicBubble,
                    { backgroundColor: topic.color },
                    isSelected && styles.topicBubbleSelected
                  ]}
                  onPress={() => handleTopicPress(topic.id)}
                  onPressIn={() => {
                    Animated.spring(animatedScale, {
                      toValue: 0.95,
                      useNativeDriver: true,
                    }).start();
                  }}
                  onPressOut={() => {
                    Animated.spring(animatedScale, {
                      toValue: 1,
                      useNativeDriver: true,
                    }).start();
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.topicBubbleIcon}>{topic.icon}</Text>
                  <Text style={styles.topicBubbleName}>{topic.name}</Text>
                  <Text style={styles.topicBubbleDesc}>{topic.description}</Text>
                  {isSelected && (
                    <View style={styles.topicSelectedBadge}>
                      <Text style={styles.topicSelectedText}>Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* Category Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category 📚</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => {
                const categoryArticles = articles.filter(a => a.category === category.id);
                if (categoryArticles.length > 0) {
                  onArticlePress(categoryArticles[0]);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[
                styles.categoryCardBg,
                { backgroundColor: category.gradient[0] }
              ]} />
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>
                {articles.filter(a => a.category === category.id).length} stories
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtered Stories */}
      {(selectedTopic || searchQuery) && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : 'Search Results'}
            </Text>
            <TouchableOpacity onPress={() => {
              setSelectedTopic(null);
              setSearchQuery('');
            }}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredArticles.length > 0 ? (
            <View style={styles.storiesGrid}>
              {filteredArticles.map((article) => (
                <View key={article.id} style={styles.gridItem}>
                  <StoryCard
                    article={article}
                    onPress={() => onArticlePress(article)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No stories found</Text>
              <Text style={styles.emptyText}>Try a different search or topic!</Text>
            </View>
          )}
        </View>
      )}

      {/* Featured Collection */}
      <View style={styles.featuredCollection}>
        <Text style={styles.collectionTitle}>✨ Editor's Picks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {articles.slice(0, 3).map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.collectionCard}
              onPress={() => onArticlePress(article)}
              activeOpacity={0.8}
            >
              <View style={styles.collectionCardImage}>
                <CategoryIcon category={article.category} size={40} />
              </View>
              <Text style={styles.collectionCardTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <View style={styles.collectionCardBadge}>
                <Text style={styles.collectionCardBadgeText}>Editor's Pick</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchMode}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.searchModal}>
          <View style={styles.searchModalContent}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Stories</Text>
              <TouchableOpacity onPress={() => setSearchMode(false)}>
                <Text style={styles.searchModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchModalInput}
              placeholder="Type to search..."
              placeholderTextColor={ds.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              style={styles.searchModalButton}
              onPress={() => setSearchMode(false)}
            >
              <Text style={styles.searchModalButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// Library Screen Component
const LibraryScreen: React.FC<{
  articles: Article[];
  bookmarks: string[];
  onArticlePress: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
}> = ({ articles, bookmarks, onArticlePress, onToggleBookmark }) => {
  const [activeSection, setActiveSection] = useState<'saved' | 'history' | 'achievements'>('saved');

  const savedArticles = articles.filter(a => bookmarks.includes(a.id));
  const recentArticles = articles.slice(0, 3); // Mock recent history

  const achievements = [
    { id: '1', name: 'First Story', icon: '🌟', unlocked: true },
    { id: '2', name: 'Quiz Master', icon: '🏆', unlocked: true },
    { id: '3', name: 'Daily Reader', icon: '📖', unlocked: false },
    { id: '4', name: 'Explorer', icon: '🗺️', unlocked: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.libraryHeader}>
        <Text style={styles.libraryTitle}>My Library</Text>
        <View style={styles.libraryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{savedArticles.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Read</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
        </View>
      </View>

      <View style={styles.librarySections}>
        <TouchableOpacity
          style={[styles.librarySections, activeSection === 'saved' && styles.librarySectionActive]}
          onPress={() => setActiveSection('saved')}
        >
          <Text style={[styles.librarySectionText, activeSection === 'saved' && styles.librarySectionTextActive]}>
            Saved Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.librarySections, activeSection === 'history' && styles.librarySectionActive]}
          onPress={() => setActiveSection('history')}
        >
          <Text style={[styles.librarySectionText, activeSection === 'history' && styles.librarySectionTextActive]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.librarySections, activeSection === 'achievements' && styles.librarySectionActive]}
          onPress={() => setActiveSection('achievements')}
        >
          <Text style={[styles.librarySectionText, activeSection === 'achievements' && styles.librarySectionTextActive]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {activeSection === 'saved' && (
        <View style={styles.section}>
          {savedArticles.length > 0 ? (
            savedArticles.map((article) => (
              <View key={article.id} style={styles.savedItem}>
                <StoryCard
                  article={article}
                  onPress={() => onArticlePress(article)}
                  variant="compact"
                />
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={() => onToggleBookmark(article.id)}
                >
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyTitle}>No saved stories yet</Text>
              <Text style={styles.emptyText}>Save stories to read them later!</Text>
            </View>
          )}
        </View>
      )}

      {activeSection === 'history' && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Recently Read</Text>
          {recentArticles.map((article) => (
            <StoryCard
              key={article.id}
              article={article}
              onPress={() => onArticlePress(article)}
              variant="compact"
            />
          ))}
        </View>
      )}

      {activeSection === 'achievements' && (
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              {!achievement.unlocked && <Text style={styles.lockedText}>Locked</Text>}
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// Profile Screen Component
const ProfileScreen: React.FC = () => {
  const [userName, setUserName] = useState('Emma');
  const [userAge, setUserAge] = useState('8');
  const [editMode, setEditMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('👧');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(5);
  const [experience, setExperience] = useState(450);
  const [nextLevelExp, setNextLevelExp] = useState(600);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: experience / nextLevelExp,
      duration: ds.animations.duration.slow,
      useNativeDriver: false,
    }).start();
  }, [experience]);

  const avatarOptions = ['👧', '👦', '🧒', '👶', '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '👸', '🤴', '🧚‍♀️', '🧚‍♂️'];

  const profileStats = [
    { label: 'Stories Read', value: '23', icon: '📖', color: ds.colors.accent.mint },
    { label: 'Quizzes Taken', value: '15', icon: '🧩', color: ds.colors.accent.skyBlue },
    { label: 'Points Earned', value: experience.toString(), icon: '⭐', color: ds.colors.primary.yellow },
    { label: 'Streak Days', value: '7', icon: '🔥', color: ds.colors.accent.coral },
  ];

  const achievements = [
    { id: '1', name: 'First Story', icon: '🌟', description: 'Read your first story', unlocked: true, date: '2024-01-01' },
    { id: '2', name: 'Quiz Master', icon: '🏆', description: 'Complete 10 quizzes', unlocked: true, date: '2024-01-05' },
    { id: '3', name: 'Daily Reader', icon: '📖', description: '7 day reading streak', unlocked: true, date: '2024-01-07' },
    { id: '4', name: 'Explorer', icon: '🗺️', description: 'Read from all categories', unlocked: false, progress: 4, total: 6 },
    { id: '5', name: 'Super Reader', icon: '🚀', description: 'Read 50 stories', unlocked: false, progress: 23, total: 50 },
    { id: '6', name: 'Knowledge Hero', icon: '🦸', description: 'Reach Level 10', unlocked: false, progress: 5, total: 10 },
  ];

  const interests = [
    { id: 'animals', name: 'Animals', emoji: '🦁', selected: true },
    { id: 'space', name: 'Space', emoji: '🚀', selected: true },
    { id: 'science', name: 'Science', emoji: '🔬', selected: false },
    { id: 'sports', name: 'Sports', emoji: '⚽', selected: true },
    { id: 'art', name: 'Art', emoji: '🎨', selected: false },
    { id: 'music', name: 'Music', emoji: '🎵', selected: false },
  ];

  const settings = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', value: true },
    { id: 'sounds', label: 'Sound Effects', icon: '🔊', value: true },
    { id: 'darkMode', label: 'Dark Mode', icon: '🌙', value: false },
    { id: 'parent', label: 'Parent Zone', icon: '👨‍👩‍👧', value: false },
    { id: 'privacy', label: 'Privacy', icon: '🔒', value: false },
    { id: 'help', label: 'Help & Support', icon: '❓', value: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header with Gradient Background */}
      <View style={styles.profileHeaderGradient}>
        <View style={styles.profileHeaderPattern} />
        
        {/* Avatar Section */}
        <View style={styles.profileAvatarSection}>
          <TouchableOpacity 
            style={styles.profileAvatarContainer}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.8}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarEmoji}>{selectedAvatar}</Text>
            </View>
            <View style={styles.editAvatarButton}>
              <Text style={styles.editAvatarIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            {editMode ? (
              <TextInput
                style={styles.profileNameInput}
                value={userName}
                onChangeText={setUserName}
                onBlur={() => setEditMode(false)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.profileName}>{userName}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.profileAge}>Age: {userAge} years</Text>
            
            {/* Level Progress Bar */}
            <View style={styles.levelContainer}>
              <Text style={styles.profileLevel}>Level {currentLevel} Story Explorer</Text>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{experience} / {nextLevelExp} XP</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Cards with Colors */}
      <View style={styles.profileStatsContainer}>
        {profileStats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.profileStatCard,
              { backgroundColor: stat.color + '20', borderColor: stat.color }
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.profileStatIcon}>{stat.icon}</Text>
            <Text style={[styles.profileStatValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.profileStatLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.achievementBadge,
                !achievement.unlocked && styles.achievementBadgeLocked
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              {achievement.unlocked ? (
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              ) : (
                <View style={styles.achievementProgress}>
                  <View style={styles.achievementProgressBar}>
                    <View 
                      style={[
                        styles.achievementProgressFill,
                        { width: `${(achievement.progress! / achievement.total!) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.achievementProgressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💝 My Interests</Text>
        <View style={styles.interestsGrid}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestChip,
                interest.selected && styles.interestChipSelected
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.interestEmoji}>{interest.emoji}</Text>
              <Text style={[
                styles.interestName,
                interest.selected && styles.interestNameSelected
              ]}>
                {interest.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.id}
            style={styles.settingItem}
            onPress={() => {
              if (setting.id === 'parent') {
                Alert.alert('Parent Zone', 'Enter parent password to continue');
              } else if (setting.id === 'help') {
                Alert.alert('Help & Support', 'Contact us at support@kidsnews.com');
              } else if (setting.id === 'privacy') {
                Alert.alert('Privacy Settings', 'Your data is safe with us!');
              }
            }}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>{setting.icon}</Text>
              <Text style={styles.settingLabel}>{setting.label}</Text>
            </View>
            {setting.value !== false && (
              <View style={styles.settingToggle}>
                <Text style={styles.settingToggleText}>On</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.avatarPickerModal}>
          <View style={styles.avatarPickerContent}>
            <Text style={styles.avatarPickerTitle}>Choose Your Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.avatarOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.avatarPickerClose}
              onPress={() => setShowAvatarPicker(false)}
            >
              <Text style={styles.avatarPickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadContent();
    loadBookmarks();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      console.log('Loading content from:', API_CONFIG.baseUrl);
      
      const [articlesResponse, videosResponse] = await Promise.all([
        fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.articles}`),
        fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.videos}`)
      ]);

      console.log('Articles response status:', articlesResponse.status);
      console.log('Videos response status:', videosResponse.status);

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        console.log('Articles loaded:', articlesData.articles?.length || 0);
        if (articlesData.success && articlesData.articles) {
          setArticles(articlesData.articles);
        }
      }

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        console.log('Videos loaded:', videosData.videos?.length || 0);
        if (videosData.success && videosData.videos) {
          setVideos(videosData.videos);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
      console.log('Falling back to mock data due to network error');
      // Add mock data for testing
      setArticles([
        {
          id: 'story_001',
          title: 'Amazing Ocean Robot Saves Marine Life',
          headline: 'Kids create robot to clean the ocean!',
          summary: 'A group of young scientists built an incredible robot that helps clean plastic from the ocean.',
          content: 'Full story content here...',
          category: 'environment',
          author: 'Ocean News Team',
          published_date: '2024-01-15',
          read_time: '3-5 min',
          is_trending: 1,
          views: 3450,
          likes: 289
        },
        // Add more mock articles as needed
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem('bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    const newBookmarks = bookmarks.includes(articleId)
      ? bookmarks.filter(id => id !== articleId)
      : [...bookmarks, articleId];
    
    setBookmarks(newBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const handleArticlePress = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackFromArticle = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <GiraffeMascot size="large" mood="thinking" />
        <ActivityIndicator size="large" color={ds.colors.primary.orange} />
        <Text style={styles.loadingText}>Loading amazing stories...</Text>
      </View>
    );
  }

  if (selectedArticle) {
    return (
      <StoryDetailScreen
        article={selectedArticle}
        onBack={handleBackFromArticle}
        onToggleBookmark={toggleBookmark}
        isBookmarked={bookmarks.includes(selectedArticle.id)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.mainContent}>
        {activeTab === 'home' && (
          <HomeScreen 
            articles={articles} 
            onArticlePress={handleArticlePress}
          />
        )}
        {activeTab === 'discover' && (
          <DiscoverScreen 
            articles={articles} 
            onArticlePress={handleArticlePress}
          />
        )}
        {activeTab === 'library' && (
          <LibraryScreen 
            articles={articles}
            bookmarks={bookmarks}
            onArticlePress={handleArticlePress}
            onToggleBookmark={toggleBookmark}
          />
        )}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: ds.colors.ui.background,
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: ds.colors.ui.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.background,
  },
  loadingText: {
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.secondary,
    marginTop: ds.spacing.lg,
  },

  // Mascot
  mascotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    backgroundColor: ds.colors.primary.yellow,
    paddingHorizontal: ds.layout.screenPadding,
    paddingTop: ds.spacing.xl,
    paddingBottom: ds.spacing.xxl,
    borderBottomLeftRadius: ds.borderRadius.xxl,
    borderBottomRightRadius: ds.borderRadius.xxl,
    ...ds.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.onPrimary,
    fontWeight: '500' as any,
  },
  headerTitle: {
    fontSize: ds.typography.sizes.xxl,
    color: ds.colors.text.onPrimary,
    fontWeight: '700' as any,
    marginTop: ds.spacing.xs,
  },

  // Search
  searchContainer: {
    paddingHorizontal: ds.layout.screenPadding,
    marginTop: -ds.spacing.xl,
    marginBottom: ds.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.pill,
    paddingHorizontal: ds.spacing.lg,
    paddingVertical: ds.spacing.md,
    ...ds.shadows.md,
  },
  searchIcon: {
    fontSize: ds.icons.size.md,
    marginRight: ds.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.primary,
  },

  // Categories
  categoriesContainer: {
    paddingHorizontal: ds.layout.screenPadding,
    marginBottom: ds.spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.pill,
    paddingHorizontal: ds.spacing.lg,
    paddingVertical: ds.spacing.sm,
    marginRight: ds.spacing.sm,
    borderWidth: 2,
    borderColor: ds.colors.ui.border,
  },
  categoryChipActive: {
    backgroundColor: ds.colors.primary.orange,
    borderColor: ds.colors.primary.orange,
  },
  categoryChipIcon: {
    fontSize: ds.icons.size.sm,
    marginRight: ds.spacing.xs,
  },
  categoryChipText: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.primary,
    fontWeight: '500' as any,
  },
  categoryChipTextActive: {
    color: ds.colors.text.onPrimary,
  },

  // Sections
  section: {
    paddingHorizontal: ds.layout.screenPadding,
    marginBottom: ds.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ds.spacing.lg,
  },
  sectionTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.lg,
  },
  subsectionTitle: {
    fontSize: ds.typography.sizes.lg,
    fontWeight: '600' as any,
    color: ds.colors.text.secondary,
    marginBottom: ds.spacing.md,
  },
  clearButton: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.primary.orange,
    fontWeight: '500' as any,
  },

  // Story Cards
  storyCard: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xl,
    padding: ds.spacing.lg,
    width: width * 0.7,
    ...ds.shadows.md,
  },
  storyCardImage: {
    width: '100%',
    height: 120,
    backgroundColor: ds.colors.secondary.cream,
    borderRadius: ds.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ds.spacing.md,
  },
  storyCardContent: {
    flex: 1,
  },
  storyCardCategory: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.primary.orange,
    fontWeight: '600' as any,
    textTransform: 'uppercase',
    marginBottom: ds.spacing.xs,
  },
  storyCardTitle: {
    fontSize: ds.typography.sizes.lg,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.sm,
  },
  storyCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.secondary,
  },

  // Featured Card
  featuredCard: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xxl,
    overflow: 'hidden',
    ...ds.shadows.lg,
  },
  featuredCardImage: {
    width: '100%',
    height: 200,
    backgroundColor: `linear-gradient(135deg, ${ds.colors.primary.yellow}, ${ds.colors.primary.orange})`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCardContent: {
    padding: ds.spacing.xl,
  },
  featuredCardTitle: {
    fontSize: ds.typography.sizes.xxl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.sm,
  },
  featuredCardSummary: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.secondary,
    marginBottom: ds.spacing.md,
    lineHeight: ds.typography.sizes.md * ds.typography.lineHeights.normal,
  },
  featuredCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: ds.colors.primary.orange,
    borderRadius: ds.borderRadius.sm,
    paddingHorizontal: ds.spacing.sm,
    paddingVertical: ds.spacing.xs,
    marginBottom: ds.spacing.sm,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.onPrimary,
    fontWeight: '600' as any,
    textTransform: 'uppercase',
  },
  trendingBadge: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.accent.coral,
    fontWeight: '600' as any,
    marginLeft: ds.spacing.md,
  },

  // Compact Card
  compactCard: {
    flexDirection: 'row',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    padding: ds.spacing.md,
    marginBottom: ds.spacing.sm,
    ...ds.shadows.sm,
  },
  compactCardIcon: {
    width: 50,
    height: 50,
    backgroundColor: ds.colors.secondary.cream,
    borderRadius: ds.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ds.spacing.md,
  },
  compactCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  compactCardTitle: {
    fontSize: ds.typography.sizes.md,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.xs,
  },
  compactCardMeta: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.secondary,
  },

  // Discover Screen
  discoverHeader: {
    paddingTop: ds.spacing.xxl,
    paddingBottom: ds.spacing.xxxl,
    paddingHorizontal: ds.layout.screenPadding,
    alignItems: 'center',
    position: 'relative',
  },
  discoverHeaderBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ds.colors.primary.yellow,
    borderBottomLeftRadius: ds.borderRadius.xxl,
    borderBottomRightRadius: ds.borderRadius.xxl,
  },
  discoverHeaderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: ds.colors.primary.orange,
  },
  discoverTitle: {
    fontSize: ds.typography.sizes.xxxl,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
    marginTop: ds.spacing.lg,
    textAlign: 'center',
  },
  discoverSubtitle: {
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.onPrimary,
    marginTop: ds.spacing.sm,
    textAlign: 'center',
    opacity: 0.9,
  },
  discoverSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.pill,
    paddingHorizontal: ds.spacing.lg,
    paddingVertical: ds.spacing.md,
    marginTop: ds.spacing.lg,
    width: width - ds.layout.screenPadding * 2,
    ...ds.shadows.md,
  },
  discoverSearchPlaceholder: {
    flex: 1,
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.tertiary,
    marginLeft: ds.spacing.sm,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: ds.layout.screenPadding,
    marginTop: -ds.spacing.xl,
    marginBottom: ds.spacing.xl,
  },
  statBubble: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    paddingVertical: ds.spacing.md,
    paddingHorizontal: ds.spacing.lg,
    alignItems: 'center',
    ...ds.shadows.sm,
  },
  statNumber: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.primary.orange,
  },
  statLabel: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.secondary,
    marginTop: ds.spacing.xs,
  },
  topicsSection: {
    marginBottom: ds.spacing.xxl,
  },
  topicsSectionTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.lg,
    paddingHorizontal: ds.layout.screenPadding,
  },
  topicsCarousel: {
    paddingHorizontal: ds.layout.screenPadding,
  },
  topicBubble: {
    width: 150,
    height: 180,
    borderRadius: ds.borderRadius.xl,
    padding: ds.spacing.lg,
    marginRight: ds.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...ds.shadows.md,
  },
  topicBubbleSelected: {
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
    borderColor: ds.colors.ui.surface,
  },
  topicBubbleIcon: {
    fontSize: 48,
    marginBottom: ds.spacing.sm,
  },
  topicBubbleName: {
    fontSize: ds.typography.sizes.md,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
    textAlign: 'center',
    marginBottom: ds.spacing.xs,
  },
  topicBubbleDesc: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  topicSelectedBadge: {
    position: 'absolute',
    top: ds.spacing.sm,
    right: ds.spacing.sm,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.sm,
    paddingHorizontal: ds.spacing.sm,
    paddingVertical: ds.spacing.xs,
  },
  topicSelectedText: {
    fontSize: ds.typography.sizes.xs,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - ds.layout.screenPadding * 2 - ds.spacing.md * 2) / 3,
    aspectRatio: 1,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    padding: ds.spacing.md,
    marginBottom: ds.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...ds.shadows.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryCardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: ds.spacing.xs,
  },
  categoryName: {
    fontSize: ds.typography.sizes.sm,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.secondary,
    marginTop: ds.spacing.xs,
  },
  featuredCollection: {
    paddingVertical: ds.spacing.xxl,
    backgroundColor: ds.colors.secondary.cream,
    marginTop: ds.spacing.xxl,
  },
  collectionTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.lg,
    paddingHorizontal: ds.layout.screenPadding,
  },
  collectionCard: {
    width: 200,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xl,
    padding: ds.spacing.lg,
    marginRight: ds.spacing.md,
    marginLeft: ds.spacing.md,
    ...ds.shadows.md,
  },
  collectionCardImage: {
    width: '100%',
    height: 100,
    backgroundColor: ds.colors.primary.yellow + '20',
    borderRadius: ds.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ds.spacing.md,
  },
  collectionCardTitle: {
    fontSize: ds.typography.sizes.md,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.sm,
  },
  collectionCardBadge: {
    backgroundColor: ds.colors.accent.coral,
    borderRadius: ds.borderRadius.sm,
    paddingHorizontal: ds.spacing.sm,
    paddingVertical: ds.spacing.xs,
    alignSelf: 'flex-start',
  },
  collectionCardBadgeText: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.onPrimary,
    fontWeight: '600' as any,
  },
  searchModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalContent: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xxl,
    padding: ds.spacing.xxl,
    width: width - ds.spacing.xxxl * 2,
    ...ds.shadows.xl,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ds.spacing.lg,
  },
  searchModalTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
  },
  searchModalClose: {
    fontSize: ds.typography.sizes.xl,
    color: ds.colors.text.secondary,
  },
  searchModalInput: {
    backgroundColor: ds.colors.ui.surfaceAlt,
    borderRadius: ds.borderRadius.lg,
    paddingVertical: ds.spacing.md,
    paddingHorizontal: ds.spacing.lg,
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.lg,
  },
  searchModalButton: {
    backgroundColor: ds.colors.primary.orange,
    borderRadius: ds.borderRadius.pill,
    paddingVertical: ds.spacing.md,
    alignItems: 'center',
    ...ds.shadows.md,
  },
  searchModalButtonText: {
    fontSize: ds.typography.sizes.lg,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: ds.spacing.md,
  },

  // Library Screen
  libraryHeader: {
    paddingHorizontal: ds.layout.screenPadding,
    paddingVertical: ds.spacing.xxl,
    backgroundColor: ds.colors.primary.yellow,
    borderBottomLeftRadius: ds.borderRadius.xxl,
    borderBottomRightRadius: ds.borderRadius.xxl,
  },
  libraryTitle: {
    fontSize: ds.typography.sizes.xxxl,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
    marginBottom: ds.spacing.lg,
  },
  libraryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: ds.typography.sizes.xxl,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
  },
  librarySections: {
    flexDirection: 'row',
    paddingHorizontal: ds.layout.screenPadding,
    marginTop: ds.spacing.xl,
    marginBottom: ds.spacing.lg,
  },
  librarySectionActive: {
    borderBottomColor: ds.colors.primary.orange,
  },
  librarySectionText: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.secondary,
    fontWeight: '500' as any,
  },
  librarySectionTextActive: {
    color: ds.colors.primary.orange,
    fontWeight: '600' as any,
  },
  savedItem: {
    position: 'relative',
  },
  bookmarkButton: {
    position: 'absolute',
    top: ds.spacing.sm,
    right: ds.spacing.sm,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.round,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...ds.shadows.sm,
  },
  bookmarkIcon: {
    fontSize: ds.icons.size.sm,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ds.layout.screenPadding,
  },
  achievementCard: {
    width: (width - ds.layout.screenPadding * 2 - ds.spacing.md * 2) / 3,
    aspectRatio: 1,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ds.spacing.md,
    marginBottom: ds.spacing.md,
    ...ds.shadows.sm,
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: ds.typography.sizes.xs,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
    textAlign: 'center',
  },
  lockedText: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.tertiary,
    marginTop: ds.spacing.xs,
  },

  // Profile Screen
  profileHeaderGradient: {
    paddingTop: ds.spacing.xxl,
    paddingBottom: ds.spacing.xxxl,
    backgroundColor: ds.colors.primary.yellow,
    borderBottomLeftRadius: ds.borderRadius.xxl,
    borderBottomRightRadius: ds.borderRadius.xxl,
    position: 'relative',
    ...ds.shadows.lg,
  },
  profileHeaderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ds.colors.primary.orange,
    opacity: 0.1,
    borderBottomLeftRadius: ds.borderRadius.xxl,
    borderBottomRightRadius: ds.borderRadius.xxl,
  },
  profileAvatarSection: {
    alignItems: 'center',
  },
  profileAvatarContainer: {
    position: 'relative',
    marginBottom: ds.spacing.lg,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ds.colors.ui.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: ds.colors.ui.surface,
    ...ds.shadows.xl,
  },
  profileAvatarEmoji: {
    fontSize: 70,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: ds.colors.primary.orange,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: ds.colors.ui.surface,
    ...ds.shadows.md,
  },
  editAvatarIcon: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: ds.typography.sizes.xxxl,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
    marginBottom: ds.spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileNameInput: {
    fontSize: ds.typography.sizes.xxxl,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
    borderBottomWidth: 2,
    borderBottomColor: ds.colors.text.onPrimary,
    paddingHorizontal: ds.spacing.md,
    marginBottom: ds.spacing.xs,
    minWidth: 150,
    textAlign: 'center',
  },
  profileAge: {
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.onPrimary,
    opacity: 0.9,
  },
  profileLevel: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '600' as any,
    color: ds.colors.text.onPrimary,
    marginTop: ds.spacing.sm,
  },
  levelContainer: {
    alignItems: 'center',
    marginTop: ds.spacing.md,
    width: width - ds.spacing.xxxl * 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: ds.colors.ui.surface + '40',
    borderRadius: 6,
    width: '100%',
    marginTop: ds.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ds.colors.accent.mint,
    borderRadius: 6,
  },
  progressText: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.onPrimary,
    marginTop: ds.spacing.xs,
    opacity: 0.9,
  },
  profileStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ds.layout.screenPadding,
    marginTop: -ds.spacing.xl,
    marginBottom: ds.spacing.xxl,
  },
  profileStatCard: {
    width: (width - ds.layout.screenPadding * 2 - ds.spacing.md) / 2,
    borderRadius: ds.borderRadius.xl,
    padding: ds.spacing.lg,
    marginRight: ds.spacing.md,
    marginBottom: ds.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    ...ds.shadows.sm,
  },
  profileStatIcon: {
    fontSize: 36,
    marginBottom: ds.spacing.sm,
  },
  profileStatValue: {
    fontSize: ds.typography.sizes.xxl,
    fontWeight: '700' as any,
  },
  profileStatLabel: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.secondary,
    marginTop: ds.spacing.xs,
  },
  achievementBadge: {
    width: 140,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xl,
    padding: ds.spacing.lg,
    marginRight: ds.spacing.md,
    alignItems: 'center',
    ...ds.shadows.md,
  },
  achievementBadgeLocked: {
    opacity: 0.6,
    backgroundColor: ds.colors.ui.surfaceAlt,
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: ds.spacing.sm,
  },
  achievementDate: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.tertiary,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  achievementProgressBar: {
    width: '80%',
    height: 6,
    backgroundColor: ds.colors.ui.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: ds.spacing.xs,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: ds.colors.primary.orange,
  },
  achievementProgressText: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.secondary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.pill,
    paddingVertical: ds.spacing.sm,
    paddingHorizontal: ds.spacing.lg,
    marginRight: ds.spacing.sm,
    marginBottom: ds.spacing.sm,
    borderWidth: 2,
    borderColor: ds.colors.ui.border,
  },
  interestChipSelected: {
    backgroundColor: ds.colors.primary.yellow,
    borderColor: ds.colors.primary.yellow,
  },
  interestEmoji: {
    fontSize: ds.icons.size.md,
    marginRight: ds.spacing.xs,
  },
  interestName: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.primary,
    fontWeight: '500' as any,
  },
  interestNameSelected: {
    color: ds.colors.text.onPrimary,
    fontWeight: '600' as any,
  },
  avatarPickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPickerContent: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xxl,
    padding: ds.spacing.xxl,
    width: width - ds.spacing.xxxl,
    maxHeight: height * 0.7,
    ...ds.shadows.xl,
  },
  avatarPickerTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '700' as any,
    color: ds.colors.text.primary,
    textAlign: 'center',
    marginBottom: ds.spacing.xl,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ds.colors.ui.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    margin: ds.spacing.sm,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: ds.colors.primary.orange,
    backgroundColor: ds.colors.primary.yellow + '20',
  },
  avatarOptionEmoji: {
    fontSize: 50,
  },
  avatarPickerClose: {
    backgroundColor: ds.colors.primary.orange,
    borderRadius: ds.borderRadius.pill,
    paddingVertical: ds.spacing.md,
    marginTop: ds.spacing.xl,
    alignItems: 'center',
  },
  avatarPickerCloseText: {
    fontSize: ds.typography.sizes.lg,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    padding: ds.spacing.lg,
    marginBottom: ds.spacing.sm,
    ...ds.shadows.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: ds.icons.size.md,
    marginRight: ds.spacing.md,
  },
  settingLabel: {
    fontSize: ds.typography.sizes.lg,
    color: ds.colors.text.primary,
    fontWeight: '500' as any,
  },
  settingToggle: {
    backgroundColor: ds.colors.status.success,
    borderRadius: ds.borderRadius.pill,
    paddingHorizontal: ds.spacing.md,
    paddingVertical: ds.spacing.xs,
  },
  settingToggleText: {
    fontSize: ds.typography.sizes.sm,
    color: ds.colors.text.onPrimary,
    fontWeight: '600' as any,
  },
  signOutButton: {
    backgroundColor: ds.colors.accent.coral,
    borderRadius: ds.borderRadius.pill,
    paddingVertical: ds.spacing.lg,
    marginHorizontal: ds.layout.screenPadding,
    marginTop: ds.spacing.xxl,
    alignItems: 'center',
    ...ds.shadows.md,
  },
  signOutButtonText: {
    fontSize: ds.typography.sizes.lg,
    fontWeight: '700' as any,
    color: ds.colors.text.onPrimary,
  },

  // Empty States
  emptyState: {
    alignItems: 'center',
    paddingVertical: ds.spacing.huge,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: ds.spacing.lg,
  },
  emptyTitle: {
    fontSize: ds.typography.sizes.xl,
    fontWeight: '600' as any,
    color: ds.colors.text.primary,
    marginBottom: ds.spacing.sm,
  },
  emptyText: {
    fontSize: ds.typography.sizes.md,
    color: ds.colors.text.secondary,
    textAlign: 'center',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: ds.colors.ui.surface,
    borderTopLeftRadius: ds.borderRadius.xxl,
    borderTopRightRadius: ds.borderRadius.xxl,
    paddingVertical: ds.spacing.md,
    paddingHorizontal: ds.spacing.lg,
    ...ds.shadows.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemContent: {
    alignItems: 'center',
    paddingVertical: ds.spacing.sm,
    paddingHorizontal: ds.spacing.md,
    borderRadius: ds.borderRadius.lg,
  },
  navItemActive: {
    backgroundColor: ds.colors.primary.yellow + '20',
  },
  navIcon: {
    fontSize: ds.icons.size.lg,
    marginBottom: ds.spacing.xs,
  },
  navIconActive: {
    fontSize: ds.icons.size.lg,
  },
  navLabel: {
    fontSize: ds.typography.sizes.xs,
    color: ds.colors.text.secondary,
    fontWeight: '500' as any,
  },
  navLabelActive: {
    color: ds.colors.primary.orange,
    fontWeight: '600' as any,
  },
});

export default App;