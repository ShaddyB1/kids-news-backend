import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { DarkDS, getDarkSpacing, getDarkFontSize, getDarkBorderRadius } from '../config/darkNewsDesignSystem';

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

interface DarkBottomTabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'videos', label: 'Videos', icon: '📹' },
  { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
  { id: 'account', label: 'Account', icon: '👤' },
];

const DarkBottomTabBar: React.FC<DarkBottomTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.icon,
                  isActive && styles.iconActive
                ]}>
                  {tab.icon}
                </Text>
                <Text style={[
                  styles.label,
                  isActive && styles.labelActive
                ]}>
                  {tab.label}
                </Text>
              </View>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
      <SafeAreaView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkDS.colors.backgrounds.secondary,
    borderTopWidth: 1,
    borderTopColor: DarkDS.colors.backgrounds.elevated,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: getDarkSpacing('sm'),
    paddingTop: getDarkSpacing('sm'),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  labelActive: {
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.semibold,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: DarkDS.colors.accent.primary,
  },
});

export default DarkBottomTabBar;
