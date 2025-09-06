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
import { LightDS, getLightShadow, getLightSpacing, getLightFontSize, getLightBorderRadius } from '../../config/lightNewsDesignSystem';

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
    summary: 'Children get chance to send messages and experiments to the Red Planet.',
    timestamp: '1 week ago',
    savedDate: 'Saved 3 days ago',
    readTime: '7 min watch',
    type: 'video',
    isRead: true,
    tags: ['space', 'mars', 'nasa'],
  },
  {
    id: '3',
    title: 'Teen Inventor Helps Blind Students Read',
    category: 'technology',
    summary: '16-year-old creates affordable braille device using 3D printing technology.',
    timestamp: '4 days ago',
    savedDate: 'Saved 1 week ago',
    readTime: '4 min read',
    type: 'article',
    isRead: false,
    tags: ['accessibility', 'invention', '3d-printing'],
  },
  {
    id: '4',
    title: 'Kids Save Endangered Butterfly Species',
    category: 'environment',
    summary: 'Elementary school students create butterfly garden that helps rare species recover.',
    timestamp: '5 days ago',
    savedDate: 'Saved 2 weeks ago',
    readTime: '5 min read',
    type: 'article',
    isRead: true,
    tags: ['butterflies', 'conservation', 'school'],
  },
  {
    id: '5',
    title: 'Young Chef Feeds Homeless with Food Truck',
    category: 'world',
    summary: '12-year-old starts mobile kitchen to provide free meals to people in need.',
    timestamp: '1 week ago',
    savedDate: 'Saved 3 weeks ago',
    readTime: '6 min watch',
    type: 'video',
    isRead: false,
    tags: ['cooking', 'charity', 'community'],
  },
];

const collections: Collection[] = [
  {
    id: 'favorites',
    name: 'My Favorites',
    count: 12,
    color: LightDS.colors.accent.error,
    emoji: '❤️',
  },
  {
    id: 'science',
    name: 'Science Fun',
    count: 8,
    color: LightDS.colors.accent.secondary,
    emoji: '🔬',
  },
  {
    id: 'technology',
    name: 'Cool Tech',
    count: 15,
    color: LightDS.colors.accent.primary,
    emoji: '⚡',
  },
  {
    id: 'environment',
    name: 'Earth Heroes',
    count: 6,
    color: LightDS.colors.accent.success,
    emoji: '🌱',
  },
  {
    id: 'reading-list',
    name: 'Reading List',
    count: 23,
    color: LightDS.colors.accent.warning,
    emoji: '📚',
  },
];

const LightBookmarksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const tabs = [
    { id: 'saved', name: 'Saved', icon: '🔖' },
    { id: 'collections', name: 'Collections', icon: '📁' },
    { id: 'history', name: 'History', icon: '🕒' },
  ];

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

  const renderSavedItem = ({ item }: { item: SavedItem }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.savedItemCard} activeOpacity={0.8}>
        <View style={styles.savedItemHeader}>
          <View style={styles.savedItemMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {item.type === 'article' ? '📄' : '📹'}
              </Text>
            </View>
            {item.isRead && (
              <View style={styles.readBadge}>
                <Text style={styles.readText}>✓</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.savedItemTitle, item.isRead && styles.readTitle]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.savedItemSummary} numberOfLines={2}>
          {item.summary}
        </Text>
        
        <View style={styles.savedItemTags}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.savedItemFooter}>
          <Text style={styles.savedDate}>{item.savedDate}</Text>
          <Text style={styles.readTime}>{item.readTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCollection = ({ item }: { item: Collection }) => {
    return (
      <TouchableOpacity 
        style={styles.collectionCard} 
        activeOpacity={0.8}
        onPress={() => setSelectedCollection(item.id)}
      >
        <View style={[styles.collectionHeader, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.collectionEmoji}>{item.emoji}</Text>
          <View style={styles.collectionCount}>
            <Text style={[styles.collectionCountText, { color: item.color }]}>
              {item.count}
            </Text>
          </View>
        </View>
        
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.collectionDescription}>
            {item.count} {item.count === 1 ? 'item' : 'items'} saved
          </Text>
        </View>
        
        <View style={[styles.collectionIndicator, { backgroundColor: item.color }]} />
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <FlatList
            data={mockSavedItems}
            renderItem={renderSavedItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>📚 No saved items yet</Text>
                <Text style={styles.emptySubtext}>
                  Start bookmarking articles and videos you want to read later!
                </Text>
              </View>
            }
          />
        );
      
      case 'collections':
        return (
          <View style={styles.collectionsGrid}>
            {collections.map((collection) => (
              <View key={collection.id} style={styles.collectionWrapper}>
                {renderCollection({ item: collection })}
              </View>
            ))}
          </View>
        );
      
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>📖 Reading History</Text>
            <Text style={styles.historySubtitle}>
              Your reading activity from the past week
            </Text>
            
            <View style={styles.historyStats}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Articles Read</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Videos Watched</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>45m</Text>
                <Text style={styles.statLabel}>Reading Time</Text>
              </View>
            </View>
            
            <View style={styles.recentActivity}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              {mockSavedItems.filter(item => item.isRead).map((item) => (
                <View key={item.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityEmoji}>
                      {item.type === 'article' ? '📄' : '📹'}
                    </Text>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.activityTime}>Read {item.timestamp}</Text>
                  </View>
                  <TouchableOpacity style={styles.activityButton}>
                    <Text style={styles.activityButtonText}>→</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={LightDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>🔖 Bookmarks</Text>
            <Text style={styles.headerSubtitle}>Your saved content library</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabIcon,
                activeTab === tab.id && styles.activeTabIcon
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        {activeTab === 'saved' && (
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockSavedItems.length}</Text>
              <Text style={styles.statName}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockSavedItems.filter(item => !item.isRead).length}</Text>
              <Text style={styles.statName}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{collections.length}</Text>
              <Text style={styles.statName}>Collections</Text>
            </View>
          </View>
        )}

        {/* Content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getLightSpacing('lg'),
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: getLightFontSize('xxxl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  headerSubtitle: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    ...getLightShadow('sm'),
  },
  headerButtonText: {
    fontSize: getLightFontSize('xl'),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: LightDS.colors.backgrounds.elevated,
    borderRadius: getLightBorderRadius('md'),
    padding: getLightSpacing('xs'),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getLightSpacing('sm'),
    paddingHorizontal: getLightSpacing('md'),
    borderRadius: getLightBorderRadius('sm'),
  },
  activeTab: {
    backgroundColor: LightDS.colors.backgrounds.card,
    ...getLightShadow('sm'),
  },
  tabIcon: {
    fontSize: getLightFontSize('md'),
    marginRight: getLightSpacing('xs'),
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontSize: getLightFontSize('sm'),
    fontWeight: LightDS.typography.weights.medium,
    color: LightDS.colors.text.secondary,
  },
  activeTabText: {
    color: LightDS.colors.text.primary,
    fontWeight: LightDS.typography.weights.bold,
  },
  content: {
    flex: 1,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: LightDS.colors.backgrounds.card,
    marginHorizontal: getLightSpacing('lg'),
    marginVertical: getLightSpacing('md'),
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    ...getLightShadow('sm'),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: LightDS.colors.borders.secondary,
    marginHorizontal: getLightSpacing('md'),
  },
  statValue: {
    fontSize: getLightFontSize('xxl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.accent.primary,
    marginBottom: getLightSpacing('xs'),
  },
  statName: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  tabContent: {
    paddingHorizontal: getLightSpacing('lg'),
  },
  savedItemCard: {
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
  },
  savedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getLightSpacing('sm'),
  },
  savedItemMeta: {
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
    marginRight: getLightSpacing('sm'),
  },
  typeText: {
    fontSize: 12,
  },
  readBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LightDS.colors.accent.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readText: {
    fontSize: 12,
    color: LightDS.colors.accent.success,
    fontWeight: LightDS.typography.weights.bold,
  },
  moreButton: {
    padding: getLightSpacing('sm'),
  },
  moreButtonText: {
    fontSize: getLightFontSize('lg'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.bold,
  },
  savedItemTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    lineHeight: getLightFontSize('lg') * 1.3,
    marginBottom: getLightSpacing('sm'),
  },
  readTitle: {
    color: LightDS.colors.text.secondary,
  },
  savedItemSummary: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    lineHeight: getLightFontSize('md') * 1.4,
    marginBottom: getLightSpacing('md'),
  },
  savedItemTags: {
    flexDirection: 'row',
    marginBottom: getLightSpacing('md'),
  },
  tag: {
    backgroundColor: LightDS.colors.backgrounds.elevated,
    paddingHorizontal: getLightSpacing('sm'),
    paddingVertical: getLightSpacing('xs'),
    borderRadius: getLightBorderRadius('sm'),
    marginRight: getLightSpacing('sm'),
  },
  tagText: {
    fontSize: getLightFontSize('xs'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  savedItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedDate: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  readTime: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.accent.primary,
    fontWeight: LightDS.typography.weights.bold,
  },
  separator: {
    height: getLightSpacing('md'),
  },
  emptyContainer: {
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
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collectionWrapper: {
    width: '48%',
    marginBottom: getLightSpacing('md'),
  },
  collectionCard: {
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('md'),
    ...getLightShadow('sm'),
    position: 'relative',
    overflow: 'hidden',
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: getLightBorderRadius('md'),
    padding: getLightSpacing('md'),
    marginBottom: getLightSpacing('md'),
  },
  collectionEmoji: {
    fontSize: 24,
  },
  collectionCount: {
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('full'),
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionCountText: {
    fontSize: getLightFontSize('sm'),
    fontWeight: LightDS.typography.weights.bold,
  },
  collectionInfo: {
    alignItems: 'center',
  },
  collectionName: {
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    textAlign: 'center',
    marginBottom: getLightSpacing('xs'),
  },
  collectionDescription: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    textAlign: 'center',
  },
  collectionIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  historyContainer: {
    paddingVertical: getLightSpacing('md'),
  },
  historyTitle: {
    fontSize: getLightFontSize('xl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    textAlign: 'center',
    marginBottom: getLightSpacing('xs'),
  },
  historySubtitle: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    textAlign: 'center',
    marginBottom: getLightSpacing('xl'),
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getLightSpacing('xl'),
  },
  statCard: {
    flex: 1,
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    alignItems: 'center',
    marginHorizontal: getLightSpacing('xs'),
    ...getLightShadow('sm'),
  },
  statNumber: {
    fontSize: getLightFontSize('xxl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.accent.primary,
    marginBottom: getLightSpacing('xs'),
  },
  statLabel: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  recentActivity: {
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    ...getLightShadow('sm'),
  },
  activityTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('md'),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getLightSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: LightDS.colors.borders.secondary,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('md'),
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
  },
  activityTime: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
  },
  activityButton: {
    padding: getLightSpacing('sm'),
    borderRadius: getLightBorderRadius('sm'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
  },
  activityButtonText: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.primary,
    fontWeight: LightDS.typography.weights.bold,
  },
  bottomSpacing: {
    height: getLightSpacing('xxxxl'),
  },
});

export default LightBookmarksScreen;
