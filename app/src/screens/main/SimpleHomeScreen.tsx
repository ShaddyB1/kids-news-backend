import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@constants/theme';

const SimpleHomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('for-you');

  const categories = [
    { id: 'for-you', name: 'For You', color: '#4A90E2' },
    { id: 'environment', name: 'Environment', color: '#27AE60' },
    { id: 'tech', name: 'Tech', color: '#F39C12' },
    { id: 'science', name: 'Science', color: '#9B59B6' },
    { id: 'space', name: 'Space', color: '#E74C3C' },
  ];

  const sampleStories = [
    {
      id: '1',
      title: 'Ocean Robot Saves Marine Life',
      summary: 'Young inventors create an amazing robot that helps clean our oceans and protects sea creatures.',
      duration: '7:30',
      category: 'environment',
    },
    {
      id: '2',
      title: 'Space Telescope Discovers New Planets',
      summary: 'Scientists use advanced telescopes to find incredible new worlds beyond our solar system.',
      duration: '8:15',
      category: 'space',
    },
    {
      id: '3',
      title: 'Solar-Powered School Bus',
      summary: 'A school district switches to solar-powered buses, showing how clean energy works.',
      duration: '6:45',
      category: 'tech',
    },
  ];

  const handleStoryPress = (story: any) => {
    Alert.alert(
      story.title,
      `${story.summary}\n\nDuration: ${story.duration}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watch Video', onPress: () => Alert.alert('Video Coming Soon!') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Junior News Digest</Text>
          <Text style={styles.headerSubtitle}>News for Kids, Ages 6-12</Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category.id ? category.color : '#F8F9FA',
                  borderColor: category.color,
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? '#FFFFFF' : category.color,
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stories */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Featured Stories</Text>
          
          {sampleStories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => handleStoryPress(story)}
            >
              <View style={styles.storyContent}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: categories.find(c => c.id === story.category)?.color || '#6C7B7F' }
                ]}>
                  <Text style={styles.categoryBadgeText}>
                    {story.category.toUpperCase()}
                  </Text>
                </View>
                
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storySummary}>{story.summary}</Text>
                
                <View style={styles.storyFooter}>
                  <Text style={styles.duration}>{story.duration}</Text>
                  <View style={styles.playButton}>
                    <Text style={styles.playText}>▶</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>🎉 Welcome to Junior News!</Text>
          <Text style={styles.welcomeText}>
            Discover amazing stories about science, technology, and the world around us. 
            All stories are written especially for kids aged 6-12!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  storiesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  storyContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  storySummary: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#4A90E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 2,
  },
  welcomeSection: {
    margin: 16,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SimpleHomeScreen;
