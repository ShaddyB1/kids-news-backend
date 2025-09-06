import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/archiveStyles';

function ArchiveScreen() {
  const [selectedWeek, setSelectedWeek] = React.useState(0);

  const archivedWeeks = [
    {
      weekOf: 'July 29 - Aug 2, 2024',
      stories: [
        { title: 'Space Robot Builds Moon Base', category: 'Space' },
        { title: 'Kids Create Ocean Cleaner', category: 'Environment' },
        { title: 'Smart Shoes Help Blind Students', category: 'Technology' },
      ],
    },
    {
      weekOf: 'July 22 - July 26, 2024',
      stories: [
        { title: 'Teenage Scientist Cures Plant Disease', category: 'Science' },
        { title: 'Solar Car Wins Global Race', category: 'Technology' },
        { title: 'Kids Plant 1 Million Trees', category: 'Environment' },
      ],
    },
    {
      weekOf: 'July 15 - July 19, 2024',
      stories: [
        { title: 'AI Helper for Homework Created by Kids', category: 'Technology' },
        { title: 'Underwater City Saves Coral Reefs', category: 'Environment' },
        { title: 'Young Artist Paints with Robots', category: 'Art' },
      ],
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={commonStyles.container} contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.archiveTitle}>📚 Story Archive</Text>
        <Text style={styles.archiveSubtitle}>Explore amazing stories from past weeks!</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekTabs}>
          {archivedWeeks.map((week, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.weekTab, selectedWeek === index && styles.weekTabActive]}
              onPress={() => {
                Vibration.vibrate(30);
                setSelectedWeek(index);
              }}
            >
              <Text style={[styles.weekTabText, selectedWeek === index && styles.weekTabTextActive]}>Week {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>{archivedWeeks[selectedWeek].weekOf}</Text>
          {archivedWeeks[selectedWeek].stories.map((story, index) => (
            <TouchableOpacity
              key={index}
              style={styles.archiveStoryCard}
              onPress={() => {
                Vibration.vibrate(40);
                Alert.alert(
                  story.title,
                  `This story was featured the week of ${archivedWeeks[selectedWeek].weekOf}. In the full app, you'd be able to watch the video and read the full story!`
                );
              }}
            >
              <View style={styles.storyCardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.categoryText}>{story.category}</Text>
                </View>
                <Text style={styles.archiveDate}>📅 Week {selectedWeek + 1}</Text>
              </View>
              <Text style={styles.archiveStoryTitle}>{story.title}</Text>
              <Text style={styles.archiveStoryHint}>👆 Tap to view details</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.archiveInfoCard}>
          <Text style={styles.archiveInfoTitle}>🔍 About the Archive</Text>
          <Text style={styles.archiveInfoText}>
            Every week, we add new amazing stories here so you can explore and learn about incredible inventions, discoveries, and young heroes from around the world!
          </Text>
          <Text style={styles.archiveInfoText}>🌟 Total Stories: {archivedWeeks.reduce((total, week) => total + week.stories.length, 0)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ArchiveScreen;


