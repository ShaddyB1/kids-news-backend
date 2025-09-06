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
import { LightDS, getLightShadow, getLightSpacing, getLightFontSize, getLightBorderRadius } from '../../config/lightNewsDesignSystem';
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

const LightAccountScreen: React.FC = () => {
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
          subtitle: 'Get notified about new stories',
          icon: '🔔',
          type: 'toggle' as const,
          value: notificationsEnabled,
          action: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'autoplay',
          title: 'Auto-play Videos',
          subtitle: 'Videos start automatically',
          icon: '▶️',
          type: 'toggle' as const,
          value: autoPlayEnabled,
          action: () => setAutoPlayEnabled(!autoPlayEnabled),
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
          id: 'text-size',
          title: 'Text Size',
          subtitle: 'Adjust reading comfort',
          icon: '📝',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          id: 'downloads',
          title: 'Downloaded Content',
          subtitle: '12 articles saved offline',
          icon: '📱',
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
          id: 'parental-controls',
          title: 'Parental Controls',
          subtitle: 'Safety settings and restrictions',
          icon: '👨‍👩‍👧‍👦',
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
          id: 'security',
          title: 'Privacy & Security',
          subtitle: 'Manage your data and privacy',
          icon: '🔒',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get support and answers',
          icon: '❓',
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
        activeOpacity={0.8}
        onPress={item.action}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <Text style={styles.settingEmoji}>{item.icon}</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{
                false: LightDS.colors.interactive.disabled,
                true: LightDS.colors.accent.primary + '40',
              }}
              thumbColor={
                item.value ? LightDS.colors.accent.primary : LightDS.colors.backgrounds.card
              }
              ios_backgroundColor={LightDS.colors.interactive.disabled}
            />
          )}
          {item.type === 'navigation' && (
            <Text style={styles.navigationArrow}>›</Text>
          )}
          {item.type === 'action' && (
            <TouchableOpacity style={styles.actionButton} onPress={item.action}>
              <Text style={styles.actionButtonText}>→</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={LightDS.colors.backgrounds.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👦</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex.j@email.com</Text>
              <Text style={styles.memberSince}>Member since Jan 2024</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>📊 Your Learning Journey</Text>
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
            </View>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementSection}>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Learning Champion!</Text>
              <Text style={styles.achievementDescription}>
                You've read 127 articles this month. Keep up the great work!
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        {settingSections.map((section, index) => (
          <View key={index} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} activeOpacity={0.8}>
            <Text style={styles.signOutText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Junior News Digest v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for young learners</Text>
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
    backgroundColor: LightDS.colors.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: getLightSpacing('lg'),
    backgroundColor: LightDS.colors.backgrounds.primary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    ...getLightShadow('md'),
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LightDS.colors.accent.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('md'),
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: getLightFontSize('xl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  userEmail: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    marginBottom: getLightSpacing('xs'),
  },
  memberSince: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    ...getLightShadow('sm'),
  },
  editButtonText: {
    fontSize: getLightFontSize('lg'),
  },
  statsSection: {
    padding: getLightSpacing('lg'),
  },
  statsTitle: {
    fontSize: getLightFontSize('xl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('md'),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: LightDS.colors.backgrounds.card,
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    alignItems: 'center',
    marginBottom: getLightSpacing('md'),
    ...getLightShadow('sm'),
  },
  statNumber: {
    fontSize: getLightFontSize('xxl'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.accent.primary,
    marginBottom: getLightSpacing('xs'),
  },
  statLabel: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
    textAlign: 'center',
  },
  achievementSection: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('lg'),
  },
  achievementBadge: {
    flexDirection: 'row',
    backgroundColor: LightDS.colors.accent.success + '10',
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    borderWidth: 2,
    borderColor: LightDS.colors.accent.success + '30',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: getLightSpacing('md'),
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.accent.success,
    marginBottom: getLightSpacing('xs'),
  },
  achievementDescription: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.secondary,
    lineHeight: getLightFontSize('md') * 1.4,
  },
  settingSection: {
    marginBottom: getLightSpacing('lg'),
  },
  sectionTitle: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('md'),
    paddingHorizontal: getLightSpacing('lg'),
  },
  sectionContent: {
    backgroundColor: LightDS.colors.backgrounds.card,
    marginHorizontal: getLightSpacing('lg'),
    borderRadius: getLightBorderRadius('card'),
    ...getLightShadow('sm'),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getLightSpacing('lg'),
    borderBottomWidth: 1,
    borderBottomColor: LightDS.colors.borders.secondary,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: getLightBorderRadius('md'),
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getLightSpacing('md'),
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: getLightFontSize('md'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.text.primary,
    marginBottom: getLightSpacing('xs'),
  },
  settingSubtitle: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.secondary,
    fontWeight: LightDS.typography.weights.medium,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationArrow: {
    fontSize: getLightFontSize('xl'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.bold,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LightDS.colors.backgrounds.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: getLightFontSize('md'),
    color: LightDS.colors.text.primary,
    fontWeight: LightDS.typography.weights.bold,
  },
  signOutSection: {
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('lg'),
  },
  signOutButton: {
    backgroundColor: LightDS.colors.accent.error + '10',
    borderRadius: getLightBorderRadius('card'),
    padding: getLightSpacing('lg'),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LightDS.colors.accent.error + '30',
  },
  signOutText: {
    fontSize: getLightFontSize('lg'),
    fontWeight: LightDS.typography.weights.bold,
    color: LightDS.colors.accent.error,
  },
  versionSection: {
    alignItems: 'center',
    paddingHorizontal: getLightSpacing('lg'),
    marginBottom: getLightSpacing('lg'),
  },
  versionText: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
    marginBottom: getLightSpacing('xs'),
  },
  versionSubtext: {
    fontSize: getLightFontSize('sm'),
    color: LightDS.colors.text.tertiary,
    fontWeight: LightDS.typography.weights.medium,
  },
  bottomSpacing: {
    height: getLightSpacing('xxxxl'),
  },
});

export default LightAccountScreen;
