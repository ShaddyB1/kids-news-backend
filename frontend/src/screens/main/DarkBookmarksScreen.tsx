import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkCategoryColor } from '../../config/darkNewsDesignSystem';

interface SavedItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  timestamp: string;
  savedDate: string;
  readTime: string;
  type: 'article' | 'video';
  isRead: boolean;
  tags: string[];
}

interface Collection {
  id: string;
  name: string;
  count: number;
  color: string;
  emoji: string;
}

const mockSavedItems: SavedItem[] = [
  {
    id: '1',
    title: 'Young Scientists Create Ocean Cleaning Robot',
    category: 'technology',
    summary: 'Brilliant students develop advanced robot that removes plastic waste from oceans.',
    timestamp: '2 days ago',
    savedDate: 'Saved yesterday',
    readTime: '3 min read',
    type: 'article',
    isRead: false,
    tags: ['robotics', 'ocean', 'environment'],
  },
  {
    id: '2',
    title: 'NASA Kids Mission to Mars Program',
    category: 'science',
    summary: 'Children worldwide can now send their artwork to Mars on upcoming missions.',
    timestamp: '1 week ago',
    savedDate: 'Saved 3 days ago',
    readTime: '4 min read',
    type: 'video',
    isRead: true,
    tags: ['space', 'nasa', 'kids'],
  },
  {
    id: '3',
    title: 'Revolutionary Math Learning App Goes Viral',
    category: 'technology',
    summary: 'Educational app transforms mathematics learning through interactive games.',
    timestamp: '3 days ago',
    savedDate: 'Saved 1 week ago',
    readTime: '2 min read',
    type: 'article',
    isRead: false,
    tags: ['education', 'math', 'apps'],
  },
];

const collections: Collection[] = [
  { id: '1', name: 'Science Adventures', count: 12, color: DarkDS.colors.categories.science, emoji: '🔬' },
  { id: '2', name: 'Tech Innovations', count: 8, color: DarkDS.colors.categories.technology, emoji: '💻' },
  { id: '3', name: 'World Stories', count: 15, color: DarkDS.colors.categories.world, emoji: '🌍' },
  { id: '4', name: 'Reading List', count: 6, color: DarkDS.colors.accent.primary, emoji: '📚' },
];

const DarkBookmarksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const filters = [
    { id: 'all', name: 'All', count: mockSavedItems.length },
    { id: 'unread', name: 'Unread', count: mockSavedItems.filter(item => !item.isRead).length },
    { id: 'articles', name: 'Articles', count: mockSavedItems.filter(item => item.type === 'article').length },
    { id: 'videos', name: 'Videos', count: mockSavedItems.filter(item => item.type === 'video').length },
  ];

  const getFilteredItems = () => {
    return mockSavedItems.filter(item => {
      switch (activeFilter) {
        case 'unread':
          return !item.isRead;
        case 'articles':
          return item.type === 'article';
        case 'videos':
          return item.type === 'video';
        default:
          return true;
      }
    });
  };

  const renderCollection = ({ item }: { item: Collection }) => {
    return (
      <TouchableOpacity 
        style={[styles.collectionCard, { backgroundColor: item.color + '20' }]} 
        activeOpacity={0.8}
        onPress={() => setSelectedCollection(item.id)}
      >
        <View style={[styles.collectionIcon, { backgroundColor: item.color }]}>
          <Text style={styles.collectionEmoji}>{item.emoji}</Text>
        </View>
        <View style={styles.collectionContent}>
          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.collectionCount}>{item.count} items</Text>
        </View>
        <View style={styles.collectionArrow}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSavedItem = ({ item }: { item: SavedItem }) => {
    const categoryColor = getDarkCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.savedItemCard} activeOpacity={0.8}>
        <View style={styles.savedItemHeader}>
          <View style={styles.savedItemMeta}>
            <Text style={[styles.savedItemCategory, { color: categoryColor }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.savedItemType}>
              {item.type === 'video' ? '📹' : '📰'} {item.type.toUpperCase()}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.savedItemTitle, item.isRead && styles.readTitle]}>
          {item.title}
        </Text>
        <Text style={styles.savedItemSummary}>{item.summary}</Text>
        
        <View style={styles.savedItemTags}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.savedItemFooter}>
          <View style={styles.savedItemInfo}>
            <Text style={styles.savedItemTimestamp}>{item.savedDate}</Text>
            <Text style={styles.savedItemReadTime}>{item.readTime}</Text>
          </View>
          <View style={styles.savedItemActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Bookmarks</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Your saved stories and videos</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>
            {mockSavedItems.length} saved • {mockSavedItems.filter(item => !item.isRead).length} unread
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Collections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={collections}
            renderItem={renderCollection}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.collectionsContainer}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>📖</Text>
              <Text style={styles.quickActionText}>Reading List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>⏰</Text>
              <Text style={styles.quickActionText}>Read Later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
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

        {/* Saved Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all' ? 'All Items' : 
               activeFilter === 'unread' ? 'Unread Items' :
               activeFilter === 'articles' ? 'Saved Articles' : 'Saved Videos'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>
          
          {getFilteredItems().length > 0 ? (
            <FlatList
              data={getFilteredItems()}
              renderItem={renderSavedItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: getDarkSpacing('md') }} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📚</Text>
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {activeFilter === 'unread' ? 'All caught up! No unread items.' :
                 activeFilter === 'articles' ? 'No articles saved yet.' :
                 activeFilter === 'videos' ? 'No videos saved yet.' :
                 'Start saving stories you want to read later.'}
              </Text>
            </View>
          )}
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
    paddingBottom: getDarkSpacing('md'),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('xs'),
  },
  headerTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  searchButton: {
    padding: getDarkSpacing('sm'),
  },
  searchIcon: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    marginBottom: getDarkSpacing('sm'),
  },
  headerStats: {
    paddingVertical: getDarkSpacing('sm'),
    paddingHorizontal: getDarkSpacing('md'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
  },
  statsText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
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
  manageText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  sortText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  collectionsContainer: {
    paddingHorizontal: getDarkSpacing('lg'),
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    marginRight: getDarkSpacing('md'),
    padding: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getDarkSpacing('md'),
  },
  collectionEmoji: {
    fontSize: 20,
  },
  collectionContent: {
    flex: 1,
  },
  collectionName: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  collectionCount: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
  },
  collectionArrow: {
    marginLeft: getDarkSpacing('md'),
  },
  arrowIcon: {
    fontSize: 20,
    color: DarkDS.colors.text.tertiary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: getDarkSpacing('lg'),
    gap: getDarkSpacing('md'),
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: getDarkSpacing('sm'),
  },
  quickActionText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
    textAlign: 'center',
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
  savedItemCard: {
    marginHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    padding: getDarkSpacing('lg'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  savedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('sm'),
  },
  savedItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedItemCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
    marginRight: getDarkSpacing('md'),
  },
  savedItemType: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
    fontWeight: DarkDS.typography.weights.medium,
    marginRight: getDarkSpacing('sm'),
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DarkDS.colors.accent.primary,
  },
  moreButton: {
    padding: getDarkSpacing('sm'),
  },
  moreIcon: {
    fontSize: 20,
    color: DarkDS.colors.text.tertiary,
  },
  savedItemTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
    lineHeight: getDarkFontSize('md') * 1.3,
  },
  readTitle: {
    opacity: 0.7,
  },
  savedItemSummary: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
    marginBottom: getDarkSpacing('md'),
  },
  savedItemTags: {
    flexDirection: 'row',
    marginBottom: getDarkSpacing('md'),
    gap: getDarkSpacing('sm'),
  },
  tag: {
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 4,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('xs'),
  },
  tagText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  savedItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getDarkSpacing('md'),
  },
  savedItemTimestamp: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  savedItemReadTime: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  savedItemActions: {
    flexDirection: 'row',
    gap: getDarkSpacing('sm'),
  },
  actionButton: {
    padding: getDarkSpacing('sm'),
  },
  actionIcon: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('xxxxl'),
    paddingHorizontal: getDarkSpacing('lg'),
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: getDarkSpacing('lg'),
  },
  emptyStateTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
  },
  emptyStateSubtitle: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
    lineHeight: getDarkFontSize('md') * 1.4,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkBookmarksScreen;
