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
import { kidsFriendlyDesignSystem } from '../../config/kidsFriendlyDesignSystem';
import { useArticles } from '../../hooks/useApi';
import KidsCharacterMascot from '../../components/KidsCharacterMascot';
import KidsPlayfulButton from '../../components/KidsPlayfulButton';
import KidsNewsCard from '../../components/KidsNewsCard';

interface KidsHomeScreenProps {
  onArticlePress: (articleId: string) => void;
}

interface NewsCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const newsCategories: NewsCategory[] = [
  { id: 'animals', name: 'Animals', icon: '🐾', color: '#81C784' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#4DB6AC' },
  { id: 'space', name: 'Space', icon: '🚀', color: '#BA68C8' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#64B5F6' },
  { id: 'environment', name: 'Nature', icon: '🌱', color: '#66BB6A' },
  { id: 'technology', name: 'Tech', icon: '💻', color: '#FFB74D' },
];

const KidsHomeScreen: React.FC<KidsHomeScreenProps> = ({ onArticlePress }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const { articles, loading, error, refetch } = useArticles();

  const filteredArticles = (articles || []).filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchText === '' || 
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCategory = ({ item }: { item: NewsCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: selectedCategory === item.id ? item.color : kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
        }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        {
          color: selectedCategory === item.id 
            ? kidsFriendlyDesignSystem.colorPalette.neutrals.white 
            : kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown
        }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderNewsCard = ({ item }: { item: any }) => (
    <KidsNewsCard
      title={item.title}
      summary={item.summary}
      category={item.category}
      readTime={item.read_time || '3 min'}
      isBreaking={item.is_breaking}
      isTrending={item.is_trending}
      onPress={() => onArticlePress(item.id)}
      illustration={getIllustrationForCategory(item.category)}
    />
  );

  const getIllustrationForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'animals': return '🦁';
      case 'science': return '🧪';
      case 'space': return '🌟';
      case 'sports': return '🏆';
      case 'environment': return '🌍';
      case 'technology': return '🤖';
      default: return '📰';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={kidsFriendlyDesignSystem.colorPalette.backgrounds.cream} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Good morning! 🌅</Text>
            <Text style={styles.nameText}>Emma</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Character Mascot */}
        <KidsCharacterMascot
          message="Ready to learn something amazing today?"
          character="owl"
          size="medium"
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="What do you want to learn about?"
              placeholderTextColor={kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>What interests you? 🎯</Text>
          <TouchableOpacity
            style={[
              styles.categoryItem,
              {
                backgroundColor: selectedCategory === 'all' 
                  ? kidsFriendlyDesignSystem.colorPalette.primary.orange 
                  : kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
                marginRight: kidsFriendlyDesignSystem.spacing.sm,
              }
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={styles.categoryIcon}>🌟</Text>
            <Text style={[
              styles.categoryText,
              {
                color: selectedCategory === 'all'
                  ? kidsFriendlyDesignSystem.colorPalette.neutrals.white
                  : kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown
              }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <FlatList
            data={newsCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions 🚀</Text>
          <View style={styles.quickActions}>
            <KidsPlayfulButton
              title="Today's Quiz"
              onPress={() => {}}
              variant="secondary"
              size="medium"
              icon="🧩"
              style={styles.quickActionButton}
            />
            <KidsPlayfulButton
              title="Watch Videos"
              onPress={() => {}}
              variant="play"
              size="medium"
              icon="📹"
              style={styles.quickActionButton}
            />
          </View>
        </View>

        {/* News Articles */}
        <View style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest News' : `${newsCategories.find(cat => cat.id === selectedCategory)?.name} News`} 📰
          </Text>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🔄 Loading amazing stories...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>😅 Oops! Let's try again</Text>
              <KidsPlayfulButton
                title="Retry"
                onPress={refetch}
                variant="primary"
                size="small"
                icon="🔄"
              />
            </View>
          )}
          
          {!loading && !error && (
            <FlatList
              data={filteredArticles}
              renderItem={renderNewsCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Fun Fact */}
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactTitle}>🎉 Fun Fact of the Day!</Text>
          <Text style={styles.funFactText}>
            Did you know that octopuses have three hearts? Two pump blood to their gills, and one pumps blood to the rest of their body! 🐙
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingTop: kidsFriendlyDesignSystem.spacing.md,
    paddingBottom: kidsFriendlyDesignSystem.spacing.sm,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
  },
  nameText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.hero,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
    marginTop: kidsFriendlyDesignSystem.spacing.xs,
  },
  notificationButton: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.pill,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    marginBottom: kidsFriendlyDesignSystem.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: kidsFriendlyDesignSystem.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
  },
  categoriesContainer: {
    marginBottom: kidsFriendlyDesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.title,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
    marginHorizontal: kidsFriendlyDesignSystem.spacing.md,
    marginBottom: kidsFriendlyDesignSystem.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    gap: kidsFriendlyDesignSystem.spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
    marginRight: kidsFriendlyDesignSystem.spacing.sm,
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: kidsFriendlyDesignSystem.spacing.xs,
  },
  categoryText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
  },
  quickActionsContainer: {
    marginBottom: kidsFriendlyDesignSystem.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    gap: kidsFriendlyDesignSystem.spacing.md,
  },
  quickActionButton: {
    flex: 1,
  },
  newsContainer: {
    marginBottom: kidsFriendlyDesignSystem.spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: kidsFriendlyDesignSystem.spacing.xl,
  },
  loadingText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: kidsFriendlyDesignSystem.spacing.xl,
    gap: kidsFriendlyDesignSystem.spacing.md,
  },
  errorText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
    textAlign: 'center',
  },
  funFactContainer: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.lightPeach,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
    padding: kidsFriendlyDesignSystem.spacing.lg,
    marginHorizontal: kidsFriendlyDesignSystem.spacing.md,
    marginBottom: kidsFriendlyDesignSystem.spacing.xl,
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  funFactTitle: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.subtitle,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
    marginBottom: kidsFriendlyDesignSystem.spacing.sm,
  },
  funFactText: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.body,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
    lineHeight: kidsFriendlyDesignSystem.contentPresentation.text.lineHeight * kidsFriendlyDesignSystem.typography.fontSizes.body,
  },
});

export default KidsHomeScreen;
