import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { DarkDS, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkShadow } from '../../config/darkNewsDesignSystem';

const categories = [
  { id: 'space', name: 'Space', icon: '🚀', color: '#1E90FF' },
  { id: 'environment', name: 'Environment', icon: '🌍', color: '#32CD32' },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#FF4500' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#FF69B4' },
  { id: 'history', name: 'History', icon: '📚', color: '#8A2BE2' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#FFD700' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#00CED1' },
  { id: 'arts', name: 'Arts', icon: '🎨', color: '#FF1493' },
];

const ExploreScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Explore</Text>
        <Text style={styles.headerSubtitle}>Discover news by category</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: DarkDS.colors.backgrounds.elevated,
  },
  headerTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    marginTop: getDarkSpacing('xs'),
  },
  content: {
    flex: 1,
    padding: getDarkSpacing('lg'),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    justifyContent: 'center',
    alignItems: 'center',
    ...getDarkShadow('md'),
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: getDarkSpacing('sm'),
  },
  categoryName: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
});

export default ExploreScreen;
