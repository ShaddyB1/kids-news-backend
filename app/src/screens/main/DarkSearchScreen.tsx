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
  StatusBar,
} from 'react-native';
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkCategoryColor } from '../../config/darkNewsDesignSystem';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  summary: string;
  timestamp: string;
  views: string;
  type: 'article' | 'video' | 'topic';
}

interface TrendingTopic {
  id: string;
  name: string;
  count: string;
  category: string;
  trending: boolean;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Young Inventors Create Solar-Powered Water Purifier',
    category: 'technology',
    summary: 'Students from Kenya develop innovative water purification system using solar energy.',
    timestamp: '2 hours ago',
    views: '1.2K',
    type: 'article',
  },
  {
    id: '2',
    title: 'Space Adventure: Kids Mission to Mars',
    category: 'science',
    summary: 'NASA announces new program allowing children to send messages to Mars.',
    timestamp: '5 hours ago',
    views: '2.8K',
    type: 'video',
  },
];

const trendingTopics: TrendingTopic[] = [
  { id: '1', name: 'Climate Heroes', count: '12.5K', category: 'environment', trending: true },
  { id: '2', name: 'Space Exploration', count: '8.9K', category: 'science', trending: true },
  { id: '3', name: 'Young Inventors', count: '15.2K', category: 'technology', trending: false },
  { id: '4', name: 'Ocean Conservation', count: '6.7K', category: 'environment', trending: true },
  { id: '5', name: 'Educational Games', count: '9.4K', category: 'technology', trending: false },
  { id: '6', name: 'Animal Rescue', count: '11.1K', category: 'world', trending: true },
];

const recentSearches = ['Ocean robots', 'Space missions', 'Climate change', 'Educational apps'];

const DarkSearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All', count: '24' },
    { id: 'articles', name: 'Articles', count: '18' },
    { id: 'videos', name: 'Videos', count: '6' },
    { id: 'topics', name: 'Topics', count: '12' },
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
    setIsSearching(text.length > 0);
  };

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.trendingItem} activeOpacity={0.8}>
        <View style={styles.trendingContent}>
          <View style={styles.trendingHeader}>
            <Text style={styles.trendingName}>{item.name}</Text>
            {item.trending && (
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingBadgeText}>📈 TRENDING</Text>
              </View>
            )}
          </View>
          <View style={styles.trendingMeta}>
            <Text style={[styles.trendingCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.trendingCount}>{item.count} posts</Text>
          </View>
        </View>
        <View style={styles.trendingArrow}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.searchResultCard} activeOpacity={0.8}>
        <View style={styles.searchResultHeader}>
          <View style={styles.searchResultMeta}>
            <Text style={[styles.searchResultCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.searchResultType}>
              {item.type === 'video' ? '📹' : '📰'} {item.type.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.searchResultTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultSummary}>{item.summary}</Text>
        <View style={styles.searchResultFooter}>
          <Text style={styles.searchResultViews}>👁 {item.views} views</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSubtitle}>Discover amazing stories</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search news, topics, videos..."
            placeholderTextColor={DarkDS.colors.text.tertiary}
            value={searchText}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        // Search Results View
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  activeFilter === filter.id && styles.filterTabActive
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === filter.id && styles.filterTabTextActive
                ]}>
                  {filter.name} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search Results */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Results for "{searchText}"</Text>
              <Text style={styles.sectionSubtitle}>Found 24 results</Text>
            </View>
            <FlatList
              data={mockSearchResults}
              renderItem={renderSearchResult}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: getDarkSpacing('md') }} />}
            />
          </View>
        </ScrollView>
      ) : (
        // Discovery View
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentSearchesContainer}
              >
                {recentSearches.map((search, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.recentSearchChip}
                    onPress={() => handleSearch(search)}
                  >
                    <Text style={styles.recentSearchText}>🕐 {search}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Trending Topics */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Topics</Text>
              <Text style={styles.sectionSubtitle}>What kids are reading about</Text>
            </View>
            <FlatList
              data={trendingTopics}
              renderItem={renderTrendingTopic}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: getDarkSpacing('sm') }} />}
            />
          </View>

          {/* Popular Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <View style={styles.categoriesGrid}>
              {Object.entries(DarkDS.colors.categories).slice(0, 6).map(([category, color]) => (
                <TouchableOpacity 
                  key={category}
                  style={[styles.categoryCard, { backgroundColor: color + '20' }]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: color }]}>
                    <Text style={styles.categoryEmoji}>
                      {category === 'technology' ? '💻' : 
                       category === 'science' ? '🔬' : 
                       category === 'world' ? '🌍' : 
                       category === 'sports' ? '⚽' : 
                       category === 'health' ? '🏥' : '🎭'}
                    </Text>
                  </View>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>120+ stories</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
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
  headerTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  headerSubtitle: {
    fontSize: getDarkFontSize('md'),
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
    height: 48,
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
  clearButton: {
    padding: getDarkSpacing('sm'),
  },
  clearIcon: {
    fontSize: 16,
    color: DarkDS.colors.text.tertiary,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingBottom: getDarkSpacing('md'),
  },
  filterTab: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('sm'),
    marginRight: getDarkSpacing('md'),
    borderRadius: getDarkBorderRadius('chip'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  filterTabActive: {
    backgroundColor: DarkDS.colors.accent.primary,
  },
  filterTabText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.secondary,
  },
  filterTabTextActive: {
    color: DarkDS.colors.text.primary,
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
  clearAllText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  recentSearchesContainer: {
    paddingHorizontal: getDarkSpacing('lg'),
  },
  recentSearchChip: {
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    marginRight: getDarkSpacing('sm'),
    borderRadius: getDarkBorderRadius('chip'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  recentSearchText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    padding: getDarkSpacing('lg'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  trendingContent: {
    flex: 1,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getDarkSpacing('xs'),
  },
  trendingName: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
    marginRight: getDarkSpacing('md'),
  },
  trendingBadge: {
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 2,
    borderRadius: getDarkBorderRadius('xs'),
    backgroundColor: DarkDS.colors.status.trending,
  },
  trendingBadgeText: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    letterSpacing: 0.5,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
    marginRight: getDarkSpacing('md'),
  },
  trendingCount: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  trendingArrow: {
    marginLeft: getDarkSpacing('md'),
  },
  arrowIcon: {
    fontSize: 20,
    color: DarkDS.colors.text.tertiary,
  },
  searchResultCard: {
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    padding: getDarkSpacing('lg'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('sm'),
  },
  searchResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
    marginRight: getDarkSpacing('md'),
  },
  searchResultType: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  searchResultTimestamp: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  searchResultTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
    lineHeight: getDarkFontSize('md') * 1.3,
  },
  searchResultSummary: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
    marginBottom: getDarkSpacing('md'),
  },
  searchResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultViews: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: getDarkSpacing('lg'),
    gap: getDarkSpacing('md'),
  },
  categoryCard: {
    width: '47%',
    padding: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getDarkSpacing('md'),
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
    textTransform: 'capitalize',
  },
  categoryCount: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkSearchScreen;
