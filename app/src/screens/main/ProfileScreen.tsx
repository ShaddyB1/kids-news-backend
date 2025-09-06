import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { DarkDS, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkShadow } from '../../config/darkNewsDesignSystem';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Profile</Text>
        <Text style={styles.headerSubtitle}>Your Junior News Digest account</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🦸</Text>
          </View>
          <Text style={styles.userName}>Young Explorer</Text>
          <Text style={styles.userLevel}>Level 5 News Reader</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Stories Read</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Videos Watched</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Days Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementName}>First Story</Text>
            </View>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🌟</Text>
              <Text style={styles.achievementName}>Week Streak</Text>
            </View>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🚀</Text>
              <Text style={styles.achievementName}>Space Expert</Text>
            </View>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🌍</Text>
              <Text style={styles.achievementName}>Earth Hero</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🎨</Text>
            <Text style={styles.settingText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.settingText}>Parent Controls</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>About</Text>
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
  profileCard: {
    backgroundColor: DarkDS.colors.backgrounds.card,
    margin: getDarkSpacing('lg'),
    padding: getDarkSpacing('xl'),
    borderRadius: getDarkBorderRadius('card'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('md'),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DarkDS.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getDarkSpacing('lg'),
  },
  avatarEmoji: {
    fontSize: 48,
  },
  userName: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  userLevel: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    marginBottom: getDarkSpacing('xl'),
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
  },
  statValue: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.accent.primary,
  },
  statLabel: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.secondary,
    marginTop: getDarkSpacing('xs'),
  },
  section: {
    margin: getDarkSpacing('lg'),
  },
  sectionTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('lg'),
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievement: {
    width: '48%',
    backgroundColor: DarkDS.colors.backgrounds.card,
    padding: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    alignItems: 'center',
    marginBottom: getDarkSpacing('md'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: getDarkSpacing('sm'),
  },
  achievementName: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkDS.colors.backgrounds.card,
    padding: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    marginBottom: getDarkSpacing('md'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  settingIcon: {
    fontSize: 24,
    marginRight: getDarkSpacing('lg'),
  },
  settingText: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
  },
});

export default ProfileScreen;
