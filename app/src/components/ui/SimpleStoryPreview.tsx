import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING } from '@constants/theme';

interface SimpleStoryPreview {
  id: string;
  title: string;
  summary: string;
  duration: string;
  category: string;
  isNew?: boolean;
}

interface SimpleStoryPreviewProps {
  stories: SimpleStoryPreview[];
  onStorySelect?: (story: SimpleStoryPreview) => void;
  maxVisible?: number;
}

const SimpleStoryPreviewWidget: React.FC<SimpleStoryPreviewProps> = ({
  stories,
  onStorySelect,
  maxVisible = 5,
}) => {
  const displayStories = stories.slice(0, maxVisible);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'environment':
        return COLORS.category?.environment || '#4A90E2';
      case 'technology':
        return COLORS.category?.tech || '#F39C12';
      case 'science':
        return COLORS.category?.science || '#27AE60';
      case 'space':
        return COLORS.category?.space || '#9B59B6';
      case 'health':
        return COLORS.category?.health || '#E74C3C';
      default:
        return '#6C7B7F';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Stories</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {displayStories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={[
              styles.storyCard,
              { borderLeftColor: getCategoryColor(story.category) }
            ]}
            onPress={() => onStorySelect?.(story)}
          >
            <View style={styles.cardHeader}>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(story.category) }
              ]}>
                <Text style={styles.categoryText}>
                  {story.category.toUpperCase()}
                </Text>
              </View>
              {story.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newText}>NEW</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.storyTitle} numberOfLines={2}>
              {story.title}
            </Text>
            
            <Text style={styles.storySummary} numberOfLines={3}>
              {story.summary}
            </Text>
            
            <View style={styles.cardFooter}>
              <Text style={styles.duration}>{story.duration}</Text>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playText}>▶</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING?.layout?.sectionGap || 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS?.text?.primary || '#2C3E50',
    marginBottom: 12,
    paddingHorizontal: SPACING?.layout?.screenPadding || 16,
  },
  scrollContainer: {
    paddingHorizontal: SPACING?.layout?.screenPadding || 16,
    paddingRight: (SPACING?.layout?.screenPadding || 16) * 2,
  },
  storyCard: {
    width: 280,
    backgroundColor: COLORS?.background?.card || '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS?.text?.primary || '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
  storySummary: {
    fontSize: 13,
    color: COLORS?.text?.secondary || '#7F8C8D',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: COLORS?.text?.secondary || '#7F8C8D',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: COLORS?.primary?.main || '#4A90E2',
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
});

export default SimpleStoryPreviewWidget;
