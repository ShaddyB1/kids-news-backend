import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@constants/theme';
import { haptics } from '@utils/helpers/haptics';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import type { DashboardData } from '../types/parent';

const mockDashboardData: DashboardData = {
  progress: {
    storiesRead: 1,
    totalStories: 3,
    quizzesPassed: 1,
    totalQuizzes: 3,
    screenTime: '15 min today',
  },
  settings: {
    notificationDays: ['Tue', 'Wed', 'Fri'],
    notificationTime: '8:00 AM',
    parentalControls: true,
  },
};

interface ProgressBarProps {
  value: number;
  total: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  total, 
  color = COLORS.primary.main 
}) => {
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value / total,
      useNativeDriver: false,
      tension: 20,
      friction: 7,
    }).start();
  }, [value, total]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {value} of {total}
      </Text>
    </View>
  );
};

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const scale = new Animated.Value(1);

  const handlePress = () => {
    haptics.light();
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.statCard,
          { transform: [{ scale }], backgroundColor: `${color}10` },
        ]}
      >
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={COLORS.text.inverse} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ParentScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePinAccess = () => {
    haptics.medium();
    Alert.alert(
      '🔐 Parent Dashboard',
      `Demo:\nStories read: ${dashboardData.progress.storiesRead}/${dashboardData.progress.totalStories}\nQuizzes passed: ${dashboardData.progress.quizzesPassed}/${dashboardData.progress.totalQuizzes}\nScreen time: ${dashboardData.progress.screenTime}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Parent Dashboard 👨‍👩‍👧‍👦</Text>

          <View style={styles.statsGrid}>
            <StatCard
              icon="book"
              title="Stories"
              value={`${dashboardData.progress.storiesRead}/${dashboardData.progress.totalStories}`}
              color={COLORS.primary.main}
            />
            <StatCard
              icon="brain"
              title="Quizzes"
              value={`${dashboardData.progress.quizzesPassed}/${dashboardData.progress.totalQuizzes}`}
              color="#8B5CF6"
            />
            <StatCard
              icon="time"
              title="Screen Time"
              value={dashboardData.progress.screenTime}
              color="#EC4899"
            />
          </View>

          <Card style={styles.progressCard}>
            <Text style={styles.sectionTitle}>📊 Weekly Progress</Text>
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Stories Completed</Text>
              <ProgressBar
                value={dashboardData.progress.storiesRead}
                total={dashboardData.progress.totalStories}
                color={COLORS.primary.main}
              />
            </View>
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Quizzes Passed</Text>
              <ProgressBar
                value={dashboardData.progress.quizzesPassed}
                total={dashboardData.progress.totalQuizzes}
                color="#8B5CF6"
              />
            </View>
          </Card>

          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>⚙️ Settings</Text>
            <View style={styles.settingRow}>
              <Ionicons name="notifications" size={20} color={COLORS.text.primary} />
              <Text style={styles.settingText}>
                Notifications: {dashboardData.settings.notificationDays.join('/')} @ {dashboardData.settings.notificationTime}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.text.primary} />
              <Text style={styles.settingText}>
                Parental controls: {dashboardData.settings.parentalControls ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </Card>

          <Button
            title="🔒 Access Full Dashboard"
            onPress={handlePinAccess}
            variant="primary"
            style={styles.accessButton}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.layout.screenPadding,
  },
  title: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statTitle: {
    fontFamily: TYPOGRAPHY.fonts?.medium,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: COLORS.text.primary,
  },
  progressCard: {
    marginBottom: SPACING.lg,
  },
  settingsCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fonts?.bold,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontFamily: TYPOGRAPHY.fonts?.medium,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    width: '100%',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.card.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  settingText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fonts?.regular,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.primary,
  },
  accessButton: {
    marginTop: SPACING.md,
  },
});