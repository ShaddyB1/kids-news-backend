import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@constants/theme';
import { archivedWeeks } from '@data/archive';
import { haptics } from '@utils/helpers/haptics';
import { useAnimation } from '@hooks/useAnimation';
import { CategoryBadge } from '@components/ui/CategoryBadge';
import { Card } from '@components/ui/Card';
import type { ScreenNavigationProp } from '../types/navigation';
import type { ArchivedWeek, ArchivedStory } from '../types/story';

interface WeekTabProps {
  week: ArchivedWeek;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const WeekTab: React.FC<WeekTabProps> = ({ week, index, isSelected, onSelect }) => {
  const { animation: scaleAnim, scale } = useAnimation(1);

  const handlePress = () => {
    haptics.light();
    scale();
    onSelect();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.weekTab,
        isSelected && styles.weekTabActive,
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={[styles.weekTabText, isSelected && styles.weekTabTextActive]}>
          Week {index + 1}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface StoryCardProps {
  story: ArchivedStory;
  weekDate: string;
  weekNumber: number;
  onPress: () => void;
}

const ArchivedStoryCard: React.FC<StoryCardProps> = ({
  story,
  weekDate,
  weekNumber,
  onPress,
}) => {
  const { animation: scaleAnim, scale } = useAnimation(1);

  const handlePress = () => {
    haptics.medium();
    scale();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.archiveStoryCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.storyCardHeader}>
          <CategoryBadge category={story.category} color="#8B5CF6" />
          <Text style={styles.archiveDate}>📅 Week {weekNumber}</Text>
        </View>
        <Text style={styles.archiveStoryTitle}>{story.title}</Text>
        <Text style={styles.archiveStoryHint}>👆 Tap to view details</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ArchiveScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  const handleStoryPress = (story: ArchivedStory) => {
    Alert.alert(
      story.title,
      `This story was featured the week of ${archivedWeeks[selectedWeek].weekOf}. In the full app, you'd be able to watch the video and read the full story!`
    );
  };

  const handleWeekSelect = (index: number) => {
    setSelectedWeek(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.archiveTitle}>📚 Story Archive</Text>
        <Text style={styles.archiveSubtitle}>
          Explore amazing stories from past weeks!
        </Text>
      </View>

      {/* Week Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekTabs}
        contentContainerStyle={styles.weekTabsContent}
      >
        {archivedWeeks.map((week, index) => (
          <WeekTab
            key={index}
            week={week}
            index={index}
            isSelected={selectedWeek === index}
            onSelect={() => handleWeekSelect(index)}
          />
        ))}
      </ScrollView>

      {/* Stories List */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setSelectedWeek(newIndex);
        }}
      >
        {archivedWeeks.map((week, weekIndex) => (
          <View key={weekIndex} style={[styles.weekContainer, { width }]}>
            <Card>
              <Text style={styles.weekTitle}>{week.weekOf}</Text>
              <View style={styles.storiesList}>
                {week.stories.map((story, storyIndex) => (
                  <ArchivedStoryCard
                    key={storyIndex}
                    story={story}
                    weekDate={week.weekOf}
                    weekNumber={weekIndex + 1}
                    onPress={() => handleStoryPress(story)}
                  />
                ))}
              </View>
            </Card>

            <Card style={styles.archiveInfoCard}>
              <Text style={styles.archiveInfoTitle}>🔍 About This Week</Text>
              <Text style={styles.archiveInfoText}>
                Every week, we add new amazing stories here so you can explore and learn
                about incredible inventions, discoveries, and young heroes from around
                the world!
              </Text>
              <Text style={styles.archiveInfoText}>
                🌟 Stories this week: {week.stories.length}
              </Text>
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    padding: SPACING.layout.screenPadding,
    paddingBottom: 0,
  },
  archiveTitle: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h1,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  archiveSubtitle: {
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  weekTabs: {
    marginTop: SPACING.lg,
    maxHeight: 60,
  },
  weekTabsContent: {
    paddingHorizontal: SPACING.layout.screenPadding,
    gap: SPACING.md,
  },
  weekTab: {
    backgroundColor: COLORS.card.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    ...SHADOWS.small,
  },
  weekTabActive: {
    backgroundColor: '#8B5CF6',
  },
  weekTabText: {
    fontFamily: TYPOGRAPHY.fonts?.semibold,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.secondary,
  },
  weekTabTextActive: {
    color: COLORS.text.inverse,
  },
  weekContainer: {
    padding: SPACING.layout.screenPadding,
  },
  weekTitle: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  storiesList: {
    gap: SPACING.md,
  },
  archiveStoryCard: {
    backgroundColor: COLORS.background.light,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  storyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  archiveDate: {
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.secondary,
  },
  archiveStoryTitle: {
    fontFamily: TYPOGRAPHY.fonts?.semibold,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  archiveStoryHint: {
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  archiveInfoCard: {
    marginTop: SPACING.lg,
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 6,
    borderLeftColor: '#8B5CF6',
  },
  archiveInfoTitle: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: '#5B21B6',
    marginBottom: SPACING.sm,
  },
  archiveInfoText: {
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.body,
    color: '#6D28D9',
    marginBottom: SPACING.sm,
  },
});