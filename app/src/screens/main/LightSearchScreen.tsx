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
import { LightDS, getLightShadow, getLightSpacing, getLightFontSize, getLightBorderRadius } from '../../config/lightNewsDesignSystem';

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
  {
    id: '3',
    title: 'Ocean Cleanup Heroes Save Marine Life',
    category: 'environment',
    summary: 'Teen volunteers organize beach cleanup that removes 500 pounds of plastic.',
    timestamp: '1 day ago',
    views: '3.5K',
    type: 'article',
  },
  {
    id: '4',
    title: 'Ancient Dinosaur Discovery Amazes Scientists',
    category: 'science',
    summary: 'New dinosaur species found by 12-year-old fossil hunter in Argentina.',
    timestamp: '2 days ago',
    views: '4.1K',
    type: 'video',
  },
  {
    id: '5',
    title: 'Kids Build Robot to Help Elderly Neighbors',
    category: 'technology',
    summary: 'Elementary students create helpful robot to assist senior citizens with daily tasks.',
    timestamp: '3 days ago',
    views: '2.3K',
    type: 'article',
  },
];

const trendingTopics: TrendingTopic[] = [
  {
    id: '1',
    name: 'Climate Heroes',
    count: '156 stories',
    category: 'environment',
    trending: true,
  },
  {
    id: '2',
    name: 'Space Exploration',
    count: '89 stories',
    category: 'science',
    trending: true,
  },
  {
    id: '3',
    name: 'Young Inventors',
    count: '234 stories',
    category: 'technology',
    trending: false,
  },
  {
    id: '4',
    name: 'Animal Rescue',
    count: '67 stories',
    category: 'environment',
    trending: true,
  },
  {
    id: '5',
    name: 'Cultural Exchange',
    count: '45 stories',
    category: 'world',
    trending: false,
  },
  {
    id: '6',
    name: 'Sports Champions',
    count: '78 stories',
    category: 'sports',
    trending: false,
  },
];

const recentSearches = [
  'Ocean cleanup',
  'Space missions',
  'Young inventors',
  'Animal rescue',
  'Climate change',
];

const LightSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All', color: LightDS.colors.accent.primary },
    { id: 'article', name: 'Articles', color: LightDS.colors.accent.info },
    { id: 'video', name: 'Videos', color: LightDS.colors.accent.secondary },
    { id: 'topic', name: 'Topics', color: LightDS.colors.accent.success },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        const filtered = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.summary.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 1000);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return LightDS.colors.accent.primary;
      case 'science': return LightDS.colors.accent.secondary;
      case 'environment': return LightDS.colors.accent.success;
      case 'world': return LightDS.colors.accent.info;
      case 'sports': return LightDS.colors.accent.warning;
      default: return LightDS.colors.accent.primary;
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.searchResultCard} activeOpacity={0.8}>
        <View style={styles.resultHeader}>
          <View style={styles.resultMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {item.type === 'article' ? '📄' : item.type === 'video' ? '📹' : '🏷️'}
              </Text>
            </View>
          </View>
          <Text style={styles.resultTimestamp}>{item.timestamp}</Text>
        </View>
        
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.resultSummary} numberOfLines={2}>
          {item.summary}
        </Text>
        
        <View style={styles.resultFooter}>
          <Text style={styles.resultViews}>👁 {item.views} views</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.trendingTopicCard} activeOpacity={0.8}>
        <View style={styles.trendingHeader}>
          <View style={styles.trendingIcon}>
            <Text style={styles.trendingEmoji}>
              {item.category === 'environment' ? '🌱' :
               item.category === 'science' ? '🔬' :
               item.category === 'technology' ? '⚡' :
               item.category === 'world' ? '🌍' :
               item.category === 'sports' ? '⚽' : '📚'}
            </Text>
          </View>
          <View style={styles.trendingInfo}>
            <View style={styles.trendingTitleRow}>
              <Text style={styles.trendingName}>{item.name}</Text>
              {item.trending && (
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingBadgeText}>🔥 Hot</Text>
                </View>
              )}
            </View>
            <Text style={styles.trendingCount}>{item.count}</Text>
          </View>
        </View>
        
        <View style={[styles.trendingCategoryBar, { backgroundColor: categoryColor }]} />
      </TouchableOpacity>
    );
  };

  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={LightDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search news, videos, topics..."
              placeholderTextColor={LightDS.colors.text.tertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {searchQuery.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  activeFilter === filter.id && styles.activeFilterChip,
                  { borderColor: filter.color }
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === filter.id && styles.activeFilterChipText,
                    { color: filter.color }
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isSearching ? '🔄 Searching...' : `📋 Results (${filteredResults.length})`}
              </Text>
              {!isSearching && filteredResults.length > 0 && (
                <Text style={styles.sectionSubtitle}>
                  Found {filteredResults.length} results for "{searchQuery}"
                </Text>
              )}
            </View>
            
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>⏳ Searching for the best content...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      🤔 No results found for "{searchQuery}"
                    </Text>
                    <Text style={styles.emptySubtext}>
                      Try different keywords or browse trending topics below
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        )}

        {/* Recent Searches */}
        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🕒 Recent Searches</Text>
              <Text style={styles.sectionSubtitle}>Your recent search history</Text>
            </View>
            
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchChip}
                  onPress={() => handleSearch(search)}
                >
                  <Text style={styles.recentSearchText}>{search}</Text>
                  <Text style={styles.recentSearchIcon}>↗️</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trending Topics */}
        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Trending Topics</Text>
              <Text style={styles.sectionSubtitle}>Popular topics kids are exploring</Text>
            </View>
            
            <FlatList
              data={trendingTopics}
              renderItem={renderTrendingTopic}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}

        {/* Quick Categories */}
        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📚 Quick Categories</Text>
              <Text style={styles.sectionSubtitle}>Explore content by category</Text>
            </View>
            
            <View style={styles.quickCategories}>
              {[
                { name: 'Technology', emoji: '⚡', color: LightDS.colors.accent.primary },
                { name: 'Science', emoji: '🔬', color: LightDS.colors.accent.secondary },
                { name: 'Environment', emoji: '🌱', color: LightDS.colors.accent.success },
                { name: 'World News', emoji: '🌍', color: LightDS.colors.accent.info },
                { name: 'Sports', emoji: '⚽', color: LightDS.colors.accent.warning },
                { name: 'Culture', emoji: '🎨', color: LightDS.colors.accent.error },
              ].map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryCard, { borderLeftColor: category.color }]}
                  activeOpacity={0.8}
                  onPress={() => handleSearch(category.name)}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightDS.colors.backgrounds.primary,
  },
  header: {
    backgroundColor: LightDS.colors.backgrounds.primary,
    paddingTop: getLightSpacing('md'),
    paddingHorizontal: getLightSpacing('lg'),
    paddingBottom: getLightSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: LightDS.colors.borders.secondary,
  },
  searchContainer: {
    marginBottom: getLightSpacing('md'),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightDS.colors.backgrounds.elevated,
    borderRadius: getLightBorderRadius('button'),
    paddingHorizontal: getLightSpacing('md'),
    paddingVertical: getLightSpacing('sm'),
    ...getLightShadow('sm'),
  },
  searchIcon: {
    fontSize: getLightFontSize('lg'),
    marginRight: getLightSpacing('sm'),
  },
  searchInput: {
    flex: 1,
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.primary,
    fontWeight: LightDS.typography.weights.medium,
  },
  clearButton: {
    padding: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
    backgroundColor: LightDS.colors.interactive.hover,
  },
  clearButtonText: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.bold,
  },
  filtersContainer: {
    marginTop: getLightSpacing('sm'),
  },
  filterChip: {
    paddingHorizontal: getLightSpacing('md'),
    paddingVertical: getLightSpacing('sm'),
    borderRadius: getLightBorderRadius('button'),
    backgroundColor: LightDS.colors.backgrounds.card,
    borderWidth: 2,
    marginRight: getLightSpacing('sm'),
    ...getLightShadow('sm'),
  },
  activeFilterChip: {
    backgroundColor: LightDS.colors.accent.primary + '20',
  },
  filterChipText: {
    fontSize: getLightFontSize('sm'),
    fontWeight: LightDS.typography.weights.bold,
  },
  activeFilterChipText: {
    fontWeight: LightDS.typography.weights.bold,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: getLightSpacing('xl'),
  },
  sectionHeader: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('md'),
  },
  sectionTitle: {
    fontSize: getLightFontSize('xl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  sectionSubtitle: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  loadingContainer: {
    paddingHorizontal: getLightSpacing('lg'),
    paddingVertical: getLightSpacing('xl'),
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  searchResultCard: {
    backgroundColor: LightDS.colors.backgrounds.card,
    marginHorizontal: getLightSpacing('lg'),
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getLightSpacing('sm'),
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
    marginRight: getLightSpacing('sm'),
  },
  categoryText: {
    fontSize: getLightFontSize('xs'),
    fontWeight: LightDS.typography.weights.bold,
  },
  typeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
  },
  resultTimestamp: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  resultTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    lineHeight: getLightFontSize('lg') * 1.3,
    marginBottom: getLightSpacing('sm'),
  },
  resultSummary: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    lineHeight: getLightFontSize('md') * 1.4,
    marginBottom: getLightSpacing('md'),
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultViews: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  shareButton: {
    padding: getLightSpacing('sm'),
    borderRadius: getLightBorderRadius('sm'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
  },
  shareButtonText: {
    fontSize: getLightFontSize('md'),
  },
  separator: {
    height: getLightSpacing('md'),
  },
  emptyContainer: {
    paddingHorizontal: getLightSpacing('lg'),
    paddingVertical: getLightSpacing('xl'),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getLightFontSize('lg'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
    textAlign: 'center',
    marginBottom: getLightSpacing('sm'),
  },
  emptySubtext: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: getLightFontSize('md') * 1.4,
  },
  recentSearches: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  recentSearchChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LightDS.colors.backgrounds.card,
    padding: getLightSpacing('md'),
    borderRadius: getLightBorderRadius('md'),
    marginBottom: getLightSpacing('sm'),
    ...getLightShadow('sm'),
  },
  recentSearchText: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.primary,
    fontWeight: LightDS.typography.weights.medium,
  },
  recentSearchIcon: {
    fontSize: getLightFontSize('md'),
  },
  trendingTopicCard: {
    backgroundColor: LightDS.colors.backgrounds.card,
    marginHorizontal: getLightSpacing('lg'),
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
    position: 'relative',
    overflow: 'hidden',
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingIcon: {
    width: 48,
    height: 48,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('md'),
  },
  trendingEmoji: {
    fontSize: 24,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getLightSpacing('xs'),
  },
  trendingName: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginRight: getLightSpacing('sm'),
  },
  trendingBadge: {
    backgroundColor: LightDS.colors.status.trending,
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
  },
  trendingBadgeText: {
    fontSize: getLightFontSize('xs'),
    color: '#FFFFFF',
    fontWeight: LightDS.typography.weights.bold,
  },
  trendingCount: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  trendingCategoryBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  quickCategories: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightDS.colors.backgrounds.card,
    padding: getLightSpacing('md'),
    borderRadius: getLightBorderRadius('md'),
    marginBottom: getLightSpacing('sm'),
    borderLeftWidth: 4,
    ...getLightShadow('sm'),
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: getLightSpacing('md'),
  },
  categoryName: {
    flex: 1,
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
  },
  categoryArrow: {
    fontSize: getLightFontSize('lg'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.bold,
  },
  bottomSpacing: {
    height: getLightSpacing('xxxxl'),
  },
});

export default LightSearchScreen;
