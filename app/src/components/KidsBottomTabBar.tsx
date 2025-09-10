import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { kidsFriendlyDesignSystem } from '../config/kidsFriendlyDesignSystem';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
}

interface KidsBottomTabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', activeIcon: '🏡' },
  { id: 'videos', label: 'Videos', icon: '📹', activeIcon: '🎬' },
  { id: 'bookmarks', label: 'Saved', icon: '🔖', activeIcon: '📚' },
  { id: 'account', label: 'Me', icon: '👤', activeIcon: '👦' },
];

const KidsBottomTabBar: React.FC<KidsBottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.activeTab,
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer,
              ]}>
                <Text style={[
                  styles.icon,
                  isActive && styles.activeIcon,
                ]}>
                  {isActive ? tab.activeIcon : tab.icon}
                </Text>
              </View>
              <Text style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.md,
    paddingBottom: kidsFriendlyDesignSystem.spacing.md,
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.cream,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.neutrals.white,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.extraLarge,
    paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.xs,
    ...kidsFriendlyDesignSystem.shadows.medium,
    shadowColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
    shadowOpacity: 0.1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: kidsFriendlyDesignSystem.spacing.sm,
    paddingHorizontal: kidsFriendlyDesignSystem.spacing.xs,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.large,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.backgrounds.lightPeach,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: kidsFriendlyDesignSystem.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: kidsFriendlyDesignSystem.spacing.xs,
  },
  activeIconContainer: {
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.orange,
    ...kidsFriendlyDesignSystem.shadows.soft,
  },
  icon: {
    fontSize: 20,
  },
  activeIcon: {
    fontSize: 22,
  },
  label: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.small,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.medium.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.mediumBrown,
    textAlign: 'center',
  },
  activeLabel: {
    fontSize: kidsFriendlyDesignSystem.typography.fontSizes.caption,
    fontWeight: kidsFriendlyDesignSystem.typography.fontWeights.bold.toString(),
    color: kidsFriendlyDesignSystem.colorPalette.neutrals.darkBrown,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: kidsFriendlyDesignSystem.colorPalette.primary.coral,
  },
});

export default KidsBottomTabBar;
