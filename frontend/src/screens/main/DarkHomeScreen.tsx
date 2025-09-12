import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkCategoryColor, getDarkStatusColor } from '../../config/darkNewsDesignSystem';
import { useArticles } from '../../hooks/useApi';

const { width: screenWidth } = Dimensions.get('window');

interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  read_time: string;
  published_date: string;
  author?: string;
  likes?: number;
  comments?: number;
  views?: number;
  is_breaking?: boolean;
  is_trending?: boolean;
  is_hot?: boolean;
}

const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Young Scientists Create Revolutionary Ocean Cleaning Robot',
    category: 'technology',
    summary: 'Brilliant students develop advanced robot that removes plastic waste from oceans with unprecedented efficiency.',
    readTime: '3 min read',
    timestamp: '10 minutes ago',
    author: 'Sarah Johnson',
    likes: 1200,
    comments: 89,
    views: '2.1K',
    isBreaking: true,
  },
  {
    id: '2',
    title: 'NASA Announces Kids Mission to Mars Program',
    category: 'science',
    summary: 'Children worldwide can now send their artwork and messages to Mars on upcoming rover missions.',
    readTime: '4 min read',
    timestamp: '1 hour ago',
    author: 'Mike Chen',
    likes: 856,
    comments: 45,
    views: '1.8K',
    isTrending: true,
  },
  {
    id: '3',
    title: 'Revolutionary Math Learning App Goes Viral',
    category: 'technology',
    summary: 'Educational app transforms mathematics learning through interactive games and personalized rewards system.',
    readTime: '2 min read',
    timestamp: '2 hours ago',
    likes: 1456,
    comments: 123,
    views: '3.2K',
    isLive: true,
  },
  {
    id: '4',
    title: 'Adorable Panda Twins Born at Conservation Center',
    category: 'world',
    summary: 'Conservation efforts succeed as rare panda twins are born, bringing hope for species recovery.',
    readTime: '3 min read',
    timestamp: '5 hours ago',
    author: 'Emma Davis',
    likes: 2340,
    comments: 167,
    views: '4.5K',
    isHot: true,
  },
];

const categories = [
  { id: 'breaking', name: 'Breaking News', color: DarkDS.colors.status.breaking },
  { id: 'trending', name: 'Trending', color: DarkDS.colors.status.trending },
  { id: 'technology', name: 'Tech', color: DarkDS.colors.categories.technology },
  { id: 'science', name: 'Science', color: DarkDS.colors.categories.science },
  { id: 'world', name: 'World', color: DarkDS.colors.categories.world },
  { id: 'sports', name: 'Sports', color: DarkDS.colors.categories.sports },
];

const topics = ['#Phone', '#Stocks', '#Tech', '#MacBook', '#Bullying', '#Science'];

interface DarkHomeScreenProps {
  onArticlePress?: (articleId: string) => void;
}

const DarkHomeScreen: React.FC<DarkHomeScreenProps> = ({ onArticlePress }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('breaking');
  const { articles, loading, error, refetch } = useArticles();

  const renderStatusBadge = (item: NewsItem) => {
    if (item.isBreaking) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: getDarkStatusColor('breaking') }]}>
          <Text style={styles.statusBadgeText}>BREAKING</Text>
        </View>
      );
    }
    if (item.isLive) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: getDarkStatusColor('live') }]}>
          <View style={styles.liveIndicator} />
          <Text style={styles.statusBadgeText}>LIVE</Text>
        </View>
      );
    }
    if (item.isTrending) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: getDarkStatusColor('trending') }]}>
          <Text style={styles.statusBadgeText}>TRENDING 📈</Text>
        </View>
      );
    }
    if (item.isHot) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: getDarkStatusColor('hot') }]}>
          <Text style={styles.statusBadgeText}>HOT 🔥</Text>
        </View>
      );
    }
    return null;
  };

  const renderFeaturedCard = ({ item }: { item: NewsItem }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.featuredCard} 
        activeOpacity={0.8}
        onPress={() => onArticlePress?.(item.id)}
      >
        <View style={styles.featuredImageContainer}>
          <View style={[styles.featuredImagePlaceholder, { backgroundColor: categoryColor }]}>
            <Text style={styles.featuredEmoji}>📰</Text>
          </View>
          <View style={styles.featuredOverlay}>
            {renderStatusBadge(item)}
          </View>
          <View style={styles.featuredGradientOverlay} />
        </View>
        <View style={styles.featuredContent}>
          <View style={styles.featuredMeta}>
            <Text style={[styles.featuredCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.featuredTimestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.featuredSummary} numberOfLines={2}>{item.summary}</Text>
          <View style={styles.featuredFooter}>
            <View style={styles.featuredStats}>
              <Text style={styles.featuredStat}>👁 {item.views}</Text>
              <Text style={styles.featuredStat}>❤️ {item.likes}</Text>
              <Text style={styles.featuredStat}>💬 {item.comments}</Text>
            </View>
            <Text style={styles.featuredReadTime}>{item.readTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStandardCard = ({ item }: { item: NewsItem }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.standardCard} 
        activeOpacity={0.8}
        onPress={() => onArticlePress?.(item.id)}
      >
        <View style={[styles.standardImageContainer, { backgroundColor: categoryColor }]}>
          <Text style={styles.standardEmoji}>📰</Text>
          {renderStatusBadge(item)}
        </View>
        <View style={styles.standardContent}>
          <View style={styles.standardHeader}>
            <Text style={[styles.standardCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.standardTimestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.standardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.standardSummary} numberOfLines={2}>{item.summary}</Text>
          <View style={styles.standardFooter}>
            <View style={styles.standardStats}>
              <Text style={styles.standardStat}>👁 {item.views}</Text>
              <Text style={styles.standardStat}>❤️ {item.likes}</Text>
            </View>
            <Text style={styles.standardReadTime}>{item.readTime}</Text>
          </View>
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
          <Text style={styles.appName}>Junior News Digest</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerDescription}>Trustworthy news from reputable publications.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={DarkDS.colors.text.tertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
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
              selectedCategory === category.id && [styles.categoryTabActive, { backgroundColor: category.color }]
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.id && styles.categoryTabTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hot News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hot News</Text>
            <Text style={styles.sectionSubtitle}>Updated 10 Minutes ago</Text>
            <Text style={styles.sectionTime}>Today, 10 Mar</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={(articles || []).filter(item => item.is_breaking || item.is_trending || item.is_hot)}
            renderItem={renderFeaturedCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Topics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicsContainer}
          >
            {topics.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicChip}>
                <Text style={styles.topicText}>{topic}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.moreTopicsButton}>
              <Text style={styles.moreTopicsText}>More Tags →</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* World News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>World</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={articles || []}
            renderItem={renderStandardCard}
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
    paddingBottom: getDarkSpacing('xl'),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('md'),
  },
  appName: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    position: 'relative',
    padding: getDarkSpacing('sm'),
  },
  headerButtonIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DarkDS.colors.status.breaking,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  headerDescription: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
  },
  searchSection: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingBottom: getDarkSpacing('lg'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('lg'),
    paddingHorizontal: getDarkSpacing('lg'),
    height: 44,
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: getDarkSpacing('md'),
  },
  searchInput: {
    flex: 1,
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.primary,
  },
  filterButton: {
    padding: getDarkSpacing('sm'),
  },
  filterIcon: {
    fontSize: 20,
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
  sectionTime: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.tertiary,
  },
  seeAllText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  featuredList: {
    paddingHorizontal: getDarkSpacing('lg'),
  },
  featuredCard: {
    width: screenWidth * 0.85,
    marginRight: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    overflow: 'hidden',
    ...getDarkShadow('md'),
  },
  featuredImageContainer: {
    height: 160,
    position: 'relative',
  },
  featuredImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredEmoji: {
    fontSize: 48,
  },
  featuredOverlay: {
    position: 'absolute',
    top: getDarkSpacing('md'),
    left: getDarkSpacing('md'),
  },
  featuredGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  featuredContent: {
    padding: getDarkSpacing('lg'),
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('sm'),
  },
  featuredCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  featuredTimestamp: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  featuredTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
    lineHeight: getDarkFontSize('lg') * 1.3,
  },
  featuredSummary: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
    marginBottom: getDarkSpacing('lg'),
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredStats: {
    flexDirection: 'row',
    gap: getDarkSpacing('lg'),
  },
  featuredStat: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  featuredReadTime: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  topicsContainer: {
    paddingHorizontal: getDarkSpacing('lg'),
  },
  topicChip: {
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    marginRight: getDarkSpacing('sm'),
    borderRadius: getDarkBorderRadius('chip'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  topicText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  moreTopicsButton: {
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    marginRight: getDarkSpacing('lg'),
  },
  moreTopicsText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  standardCard: {
    flexDirection: 'row',
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    overflow: 'hidden',
    ...getDarkShadow('sm'),
  },
  standardImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  standardEmoji: {
    fontSize: 32,
  },
  standardContent: {
    flex: 1,
    padding: getDarkSpacing('md'),
  },
  standardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('xs'),
  },
  standardCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  standardTimestamp: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  standardTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
    lineHeight: getDarkFontSize('md') * 1.3,
  },
  standardSummary: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
    marginBottom: getDarkSpacing('sm'),
  },
  standardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standardStats: {
    flexDirection: 'row',
    gap: getDarkSpacing('md'),
  },
  standardStat: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  standardReadTime: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 4,
    borderRadius: getDarkBorderRadius('xs'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    letterSpacing: 0.5,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DarkDS.colors.text.primary,
    marginRight: 4,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkHomeScreen;
