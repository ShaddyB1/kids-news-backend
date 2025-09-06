import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { DarkDS, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkShadow } from '../../config/darkNewsDesignSystem';

const SavedScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔖 Saved Stories</Text>
        <Text style={styles.headerSubtitle}>Your bookmarked articles and videos</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No saved stories yet</Text>
          <Text style={styles.emptyText}>
            Tap the bookmark icon on any story or video to save it here for later!
          </Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Stories</Text>
          </TouchableOpacity>
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: getDarkSpacing('xxxxl'),
    paddingHorizontal: getDarkSpacing('xl'),
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: getDarkSpacing('lg'),
  },
  emptyTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
  },
  emptyText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
    lineHeight: getDarkFontSize('md') * 1.5,
    marginBottom: getDarkSpacing('xl'),
  },
  exploreButton: {
    backgroundColor: DarkDS.colors.accent.primary,
    paddingHorizontal: getDarkSpacing('xl'),
    paddingVertical: getDarkSpacing('md'),
    borderRadius: getDarkBorderRadius('md'),
    ...getDarkShadow('sm'),
  },
  exploreButtonText: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
});

export default SavedScreen;
