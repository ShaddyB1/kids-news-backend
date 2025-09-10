import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';

// Kid-friendly colors from our design system
const colors = {
  cream: '#FFF8E1',
  orange: '#FF8A65',
  coral: '#FF6B6B',
  darkBrown: '#5D4037',
  mediumBrown: '#8D6E63',
  white: '#FFFFFF',
  skyBlue: '#64B5F6',
  lightPeach: '#FFF3E0',
};

// Simple Kid-friendly Character Component
const KidsCharacter: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.characterContainer}>
    <Text style={styles.character}>🦉</Text>
    <View style={styles.speechBubble}>
      <Text style={styles.message}>{message}</Text>
    </View>
  </View>
);

// Simple Kid-friendly Button Component
const KidsButton: React.FC<{ title: string; onPress: () => void; icon?: string }> = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{icon && `${icon} `}{title}</Text>
  </TouchableOpacity>
);

// Simple News Card Component
const NewsCard: React.FC<{ title: string; summary: string; category: string; onPress: () => void }> = ({ 
  title, summary, category, onPress 
}) => (
  <TouchableOpacity style={styles.newsCard} onPress={onPress}>
    <Text style={styles.newsIllustration}>📰</Text>
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>🌟 {category}</Text>
    </View>
    <Text style={styles.newsTitle}>{title}</Text>
    <Text style={styles.newsSummary}>{summary}</Text>
    <View style={styles.newsFooter}>
      <Text style={styles.readTime}>⏱️ 3 min read</Text>
      <View style={styles.playButton}>
        <Text style={styles.playIcon}>▶️</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Simple Bottom Tab Bar Component
const BottomTabBar: React.FC<{ activeTab: string; onTabPress: (tab: string) => void }> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'videos', label: 'Videos', icon: '📹' },
    { id: 'bookmarks', label: 'Saved', icon: '🔖' },
    { id: 'account', label: 'Me', icon: '👤' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Mock news data
const mockNews = [
  {
    id: '1',
    title: 'Young Scientists Create Ocean Cleaning Robot',
    summary: 'Amazing kids built a robot that cleans plastic from the ocean! 🌊',
    category: 'Science',
  },
  {
    id: '2',
    title: 'New Playground Opens with Solar-Powered Swings',
    summary: 'Kids can play while helping the environment with these cool swings! ⚡',
    category: 'Environment',
  },
  {
    id: '3',
    title: 'School Dog Helps Kids Learn to Read',
    summary: 'Friendly dog makes reading fun and helps shy kids feel confident! 📚',
    category: 'Education',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');

  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Good morning! 🌅</Text>
          <Text style={styles.nameText}>Emma</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Character Mascot */}
      <KidsCharacter message="Ready to learn something amazing today?" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to learn about?"
            placeholderTextColor={colors.mediumBrown}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions 🚀</Text>
        <View style={styles.quickActions}>
          <KidsButton title="Today's Quiz" onPress={() => {}} icon="🧩" />
          <KidsButton title="Watch Videos" onPress={() => {}} icon="📹" />
        </View>
      </View>

      {/* News Articles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest News 📰</Text>
        {mockNews.map((news) => (
          <NewsCard
            key={news.id}
            title={news.title}
            summary={news.summary}
            category={news.category}
            onPress={() => console.log('News pressed:', news.title)}
          />
        ))}
      </View>

      {/* Fun Fact */}
      <View style={styles.funFact}>
        <Text style={styles.funFactTitle}>🎉 Fun Fact of the Day!</Text>
        <Text style={styles.funFactText}>
          Did you know that octopuses have three hearts? Two pump blood to their gills, and one pumps blood to the rest of their body! 🐙
        </Text>
      </View>
    </ScrollView>
  );

  const renderOtherScreen = (screenName: string) => (
    <View style={styles.centerContent}>
      <Text style={styles.comingSoonTitle}>🚧 {screenName}</Text>
      <Text style={styles.comingSoonText}>Coming Soon!</Text>
      <Text style={styles.comingSoonEmoji}>🌟</Text>
    </View>
  );

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeScreen();
      case 'videos':
        return renderOtherScreen('Videos');
      case 'bookmarks':
        return renderOtherScreen('Bookmarks');
      case 'account':
        return renderOtherScreen('Account');
      default:
        return renderHomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      {renderCurrentScreen()}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumBrown,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkBrown,
    marginTop: 4,
  },
  notificationButton: {
    backgroundColor: colors.orange,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  character: {
    fontSize: 60,
    marginBottom: 8,
  },
  speechBubble: {
    backgroundColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: 250,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkBrown,
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkBrown,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkBrown,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: colors.orange,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  newsIllustration: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.skyBlue,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkBrown,
    marginBottom: 4,
    lineHeight: 28,
  },
  newsSummary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumBrown,
    lineHeight: 24,
    marginBottom: 16,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mediumBrown,
  },
  playButton: {
    backgroundColor: colors.coral,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
  funFact: {
    backgroundColor: colors.lightPeach,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  funFactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkBrown,
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumBrown,
    lineHeight: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.lightPeach,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mediumBrown,
  },
  activeTabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkBrown,
  },
  comingSoonTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.darkBrown,
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.mediumBrown,
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
});
