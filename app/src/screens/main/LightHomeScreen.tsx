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
import { LightDS, getLightShadow, getLightSpacing, getLightFontSize, getLightBorderRadius, getLightCategoryColor, getLightStatusColor } from '../../config/lightNewsDesignSystem';
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

interface LightHomeScreenProps {
  onArticlePress?: (articleId: string) => void;
}

const LightHomeScreen: React.FC<LightHomeScreenProps> = ({ onArticlePress }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('breaking');
  const { articles, loading, error, refetch } = useArticles();

  const categories = [
    { id: 'breaking', name: 'Breaking', color: LightDS.accent.red },
    { id: 'trending', name: 'Trending', color: LightDS.accent.orange },
    { id: 'hot', name: 'Hot', color: LightDS.accent.yellow },
    { id: 'science', name: 'Science', color: LightDS.accent.blue },
    { id: 'technology', name: 'Tech', color: LightDS.accent.purple },
    { id: 'environment', name: 'Environment', color: LightDS.accent.green },
  ];

  const topics = [
    { id: '1', name: 'Space', emoji: '🚀', color: LightDS.accent.blue },
    { id: '2', name: 'Animals', emoji: '🐾', color: LightDS.accent.green },
    { id: '3', name: 'Science', emoji: '🔬', color: LightDS.accent.purple },
    { id: '4', name: 'Sports', emoji: '⚽', color: LightDS.accent.orange },
    { id: '5', name: 'Art', emoji: '🎨', color: LightDS.accent.pink },
    { id: '6', name: 'Music', emoji: '🎵', color: LightDS.accent.teal },
  ];

  const renderStatusBadge = (item: NewsItem) => {
    if (item.is_breaking) return { text: '🔴 BREAKING', color: LightDS.accent.red };
    if (item.is_trending) return { text: '🔥 TRENDING', color: LightDS.accent.orange };
    if (item.is_hot) return { text: '⚡ HOT', color: LightDS.accent.yellow };
    return { text: '📰 NEWS', color: LightDS.text.secondary };
  };

  const renderFeaturedCard = ({ item }: { item: NewsItem }) => {
    const status = renderStatusBadge(item);
    const categoryColor = getLightCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={styles.featuredCard}
        activeOpacity={0.8}
        onPress={() => onArticlePress?.(item.id)}
      >
        <View style={[styles.featuredImage, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.featuredImageText, { color: categoryColor }]}>
            {item.category.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
          </View>
          
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.featuredSummary} numberOfLines={2}>
            {item.summary}
          </Text>
          
          <View style={styles.featuredFooter}>
            <Text style={styles.featuredAuthor}>{item.author}</Text>
            <Text style={styles.featuredTime}>{item.read_time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStandardCard = ({ item }: { item: NewsItem }) => {
    const status = renderStatusBadge(item);
    const categoryColor = getLightCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={styles.standardCard}
        activeOpacity={0.8}
        onPress={() => onArticlePress?.(item.id)}
      >
        <View style={styles.standardContent}>
          <View style={styles.standardHeader}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.standardCategory, { color: categoryColor }]}>
              {item.category}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
          </View>
          
          <Text style={styles.standardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.standardSummary} numberOfLines={3}>
            {item.summary}
          </Text>
          
          <View style={styles.standardFooter}>
            <Text style={styles.standardAuthor}>{item.author}</Text>
            <View style={styles.standardMeta}>
              <Text style={styles.standardTime}>{item.read_time}</Text>
              <Text style={styles.standardStats}>👁️ {item.views} • ❤️ {item.likes}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.standardImage, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.standardImageText, { color: categoryColor }]}>
            {item.category[0].toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && { backgroundColor: item.color + '20', borderColor: item.color }
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.categoryChipText,
        selectedCategory === item.id && { color: item.color, fontWeight: '600' }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTopicCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.topicCard, { backgroundColor: item.color + '15' }]}
      activeOpacity={0.8}
    >
      <Text style={styles.topicEmoji}>{item.emoji}</Text>
      <Text style={[styles.topicName, { color: item.color }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={LightDS.background.main} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 🌅</Text>
            <Text style={styles.subtitle}>Ready for today's amazing stories?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search amazing stories..."
              placeholderTextColor={LightDS.text.secondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured News</Text>
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
          <Text style={styles.sectionTitle}>Explore Topics</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topics}
            renderItem={renderTopicCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.topicsList}
          />
        </View>

        {/* All News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={articles || []}
            renderItem={renderStandardCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: getLightSpacing('md') }} />}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LightDS.background.main,
  },
  container: {
    flex: 1,
    backgroundColor: LightDS.background.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getLightSpacing('lg'),
    paddingTop: getLightSpacing('md'),
    paddingBottom: getLightSpacing('lg'),
  },
  greeting: {
    fontSize: getLightFontSize('xl'),
    fontWeight: 'bold',
    color: LightDS.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.text.secondary,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LightDS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...getLightShadow('sm'),
  },
  profileEmoji: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('lg'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightDS.background.secondary,
    borderRadius: getLightBorderRadius('lg'),
    paddingHorizontal: getLightSpacing('md'),
    paddingVertical: getLightSpacing('sm'),
    ...getLightShadow('sm'),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: getLightSpacing('sm'),
  },
  searchInput: {
    flex: 1,
    fontSize: getLightFontSize('md'),
    color: LightDS.text.primary,
  },
  section: {
    marginBottom: getLightSpacing('xl'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('md'),
  },
  sectionTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: 'bold',
    color: LightDS.text.primary,
  },
  sectionTime: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.text.secondary,
  },
  seeAllText: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.accent.blue,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  categoryChip: {
    paddingHorizontal: getLightSpacing('md'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('full'),
    backgroundColor: LightDS.background.secondary,
    marginRight: getLightSpacing('sm'),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.text.secondary,
  },
  featuredList: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  featuredCard: {
    width: screenWidth * 0.8,
    backgroundColor: LightDS.background.secondary,
    borderRadius: getLightBorderRadius('lg'),
    marginRight: getLightSpacing('md'),
    overflow: 'hidden',
    ...getLightShadow('md'),
  },
  featuredImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImageText: {
    fontSize: getLightFontSize('lg'),
    fontWeight: 'bold',
  },
  featuredContent: {
    padding: getLightSpacing('md'),
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getLightSpacing('xs'),
  },
  statusBadge: {
    paddingHorizontal: getLightSpacing('xs'),
    paddingVertical: 2,
    borderRadius: getLightBorderRadius('sm'),
  },
  statusText: {
    fontSize: getLightFontSize('xs'),
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: getLightFontSize('md'),
    fontWeight: 'bold',
    color: LightDS.text.primary,
    marginBottom: getLightSpacing('xs'),
    lineHeight: 20,
  },
  featuredSummary: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.text.secondary,
    marginBottom: getLightSpacing('sm'),
    lineHeight: 18,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.text.tertiary,
  },
  featuredTime: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.text.tertiary,
  },
  topicsList: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  topicCard: {
    width: 80,
    height: 80,
    borderRadius: getLightBorderRadius('lg'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('sm'),
  },
  topicEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  topicName: {
    fontSize: getLightFontSize('xs'),
    fontWeight: '600',
  },
  standardCard: {
    flexDirection: 'row',
    backgroundColor: LightDS.background.secondary,
    borderRadius: getLightBorderRadius('lg'),
    marginHorizontal: getLightSpacing('lg'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
  },
  standardContent: {
    flex: 1,
    marginRight: getLightSpacing('sm'),
  },
  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getLightSpacing('xs'),
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: getLightSpacing('xs'),
  },
  standardCategory: {
    fontSize: getLightFontSize('xs'),
    fontWeight: '600',
    marginRight: getLightSpacing('xs'),
    flex: 1,
  },
  standardTitle: {
    fontSize: getLightFontSize('md'),
    fontWeight: 'bold',
    color: LightDS.text.primary,
    marginBottom: getLightSpacing('xs'),
    lineHeight: 20,
  },
  standardSummary: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.text.secondary,
    marginBottom: getLightSpacing('sm'),
    lineHeight: 18,
  },
  standardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standardAuthor: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.text.tertiary,
  },
  standardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  standardTime: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.text.tertiary,
    marginRight: getLightSpacing('xs'),
  },
  standardStats: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.text.tertiary,
  },
  standardImage: {
    width: 80,
    height: 80,
    borderRadius: getLightBorderRadius('md'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  standardImageText: {
    fontSize: getLightFontSize('xl'),
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default LightHomeScreen;