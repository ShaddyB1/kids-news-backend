import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius } from '../../config/darkNewsDesignSystem';
import { useTheme } from '../../contexts/ThemeContext';

interface UserStats {
  articlesRead: number;
  videosWatched: number;
  bookmarks: number;
  streak: number;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  action?: () => void;
}

const userStats: UserStats = {
  articlesRead: 127,
  videosWatched: 43,
  bookmarks: 18,
  streak: 12,
};

const DarkAccountScreen: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  const settingSections = [
    {
      title: 'Reading Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get notified about breaking news',
          icon: '🔔',
          type: 'toggle' as const,
          value: notificationsEnabled,
          action: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: isDarkMode ? 'Currently active - easy on the eyes' : 'Light theme active',
          icon: isDarkMode ? '🌙' : '☀️',
          type: 'toggle' as const,
          value: isDarkMode,
          action: toggleTheme,
        },
        {
          id: 'autoplay',
          title: 'Auto-play Videos',
          subtitle: 'Automatically play video content',
          icon: '▶️',
          type: 'toggle' as const,
          value: autoPlayEnabled,
          action: () => setAutoPlayEnabled(!autoPlayEnabled),
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          id: 'reading-history',
          title: 'Reading History',
          subtitle: 'View your reading activity',
          icon: '📖',
          type: 'navigation' as const,
        },
        {
          id: 'downloaded',
          title: 'Downloaded Articles',
          subtitle: 'Read offline content',
          icon: '📱',
          type: 'navigation' as const,
        },
        {
          id: 'interests',
          title: 'Manage Interests',
          subtitle: 'Customize your news feed',
          icon: '⭐',
          type: 'navigation' as const,
        },
        {
          id: 'reading-goals',
          title: 'Reading Goals',
          subtitle: 'Set daily reading targets',
          icon: '🎯',
          type: 'navigation' as const,
        },
        {
          id: 'content-filters',
          title: 'Content Filters',
          subtitle: 'Age-appropriate content settings',
          icon: '🛡️',
          type: 'navigation' as const,
        },
        {
          id: 'language',
          title: 'Language & Region',
          subtitle: 'English (US)',
          icon: '🌍',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your information',
          icon: '👤',
          type: 'navigation' as const,
        },
        {
          id: 'parent-controls',
          title: 'Parent Controls',
          subtitle: 'Safety and privacy settings',
          icon: '👨‍👩‍👧‍👦',
          type: 'navigation' as const,
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Control your data',
          icon: '🔒',
          type: 'navigation' as const,
        },
        {
          id: 'data-usage',
          title: 'Data & Storage',
          subtitle: 'Manage offline content',
          icon: '💾',
          type: 'navigation' as const,
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Free account - upgrade available',
          icon: '⭐',
          type: 'navigation' as const,
        },
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help or report issues',
          icon: '❓',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          id: 'about',
          title: 'About Junior News Digest',
          subtitle: 'Version 1.0.0',
          icon: 'ℹ️',
          type: 'navigation' as const,
        },
        {
          id: 'whats-new',
          title: "What's New",
          subtitle: 'Latest features and updates',
          icon: '🆕',
          type: 'navigation' as const,
        },
        {
          id: 'rate-app',
          title: 'Rate Our App',
          subtitle: 'Leave a review on the App Store',
          icon: '⭐',
          type: 'action' as const,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: '💬',
          type: 'action' as const,
        },
        {
          id: 'share',
          title: 'Share App',
          subtitle: 'Tell friends about us',
          icon: '📤',
          type: 'action' as const,
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Legal information',
          icon: '📄',
          type: 'navigation' as const,
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          icon: '🔐',
          type: 'navigation' as const,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.action}
        activeOpacity={0.8}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            <Text style={styles.settingEmoji}>{item.icon}</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{
                false: DarkDS.colors.backgrounds.elevated,
                true: DarkDS.colors.accent.primary,
              }}
              thumbColor={item.value ? '#FFFFFF' : DarkDS.colors.text.tertiary}
              ios_backgroundColor={DarkDS.colors.backgrounds.elevated}
            />
          )}
          {item.type === 'navigation' && (
            <Text style={styles.navigationArrow}>→</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👦</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Johnson</Text>
            <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
            <Text style={styles.profileMember}>Member since March 2024</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Your Reading Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.articlesRead}</Text>
              <Text style={styles.statLabel}>Articles Read</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.videosWatched}</Text>
              <Text style={styles.statLabel}>Videos Watched</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.bookmarks}</Text>
              <Text style={styles.statLabel}>Bookmarks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.streakEmoji}>🔥</Text>
            </View>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementSection}>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>News Explorer</Text>
              <Text style={styles.achievementSubtitle}>
                You've read articles from 5 different categories this week!
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsList}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} activeOpacity={0.8}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Junior News Digest v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for curious minds</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
  },
  editButton: {
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
  },
  editButtonText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.accent.primary,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('xl'),
    paddingHorizontal: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.secondary,
    marginBottom: getDarkSpacing('lg'),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: getDarkSpacing('lg'),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: DarkDS.colors.accent.primary,
  },
  avatarText: {
    fontSize: 36,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DarkDS.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: {
    fontSize: 14,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  profileEmail: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    marginBottom: getDarkSpacing('xs'),
  },
  profileMember: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.tertiary,
  },
  statsSection: {
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('xl'),
  },
  statsTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('lg'),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getDarkSpacing('md'),
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    alignItems: 'center',
    position: 'relative',
    ...getDarkShadow('sm'),
  },
  statNumber: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.accent.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  statLabel: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
  },
  streakEmoji: {
    position: 'absolute',
    top: getDarkSpacing('sm'),
    right: getDarkSpacing('sm'),
    fontSize: 16,
  },
  achievementSection: {
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('xl'),
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.accent.primary + '20',
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.accent.primary + '40',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: getDarkSpacing('md'),
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  achievementSubtitle: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
  },
  settingSection: {
    marginBottom: getDarkSpacing('xl'),
  },
  sectionTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('md'),
  },
  settingsList: {
    backgroundColor: DarkDS.colors.backgrounds.card,
    marginHorizontal: getDarkSpacing('lg'),
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getDarkSpacing('lg'),
    borderBottomWidth: 1,
    borderBottomColor: DarkDS.colors.backgrounds.elevated,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getDarkSpacing('md'),
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  settingSubtitle: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
  },
  settingAction: {
    marginLeft: getDarkSpacing('md'),
  },
  navigationArrow: {
    fontSize: 20,
    color: DarkDS.colors.text.tertiary,
  },
  signOutSection: {
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('xl'),
  },
  signOutButton: {
    padding: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.accent.error + '20',
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 1,
    borderColor: DarkDS.colors.accent.error + '40',
    alignItems: 'center',
  },
  signOutText: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.accent.error,
  },
  versionSection: {
    alignItems: 'center',
    paddingHorizontal: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('xl'),
  },
  versionText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.tertiary,
    marginBottom: getDarkSpacing('xs'),
  },
  versionSubtext: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.tertiary,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkAccountScreen;
