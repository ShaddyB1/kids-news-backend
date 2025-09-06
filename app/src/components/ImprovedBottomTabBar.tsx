import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { MDS, getModernSpacing, getModernFontSize, getModernBorderRadius, getModernShadow } from '../config/modernDesignSystem';

const { width: screenWidth } = Dimensions.get('window');

interface TabItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface ImprovedBottomTabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', color: '#6366F1' },
  { id: 'videos', label: 'Videos', icon: '🎬', color: '#EC4899' },
  { id: 'explore', label: 'Explore', icon: '🔍', color: '#10B981' },
  { id: 'saved', label: 'Saved', icon: '🔖', color: '#F59E0B' },
  { id: 'profile', label: 'Profile', icon: '👤', color: '#8B5CF6' },
];

const ImprovedBottomTabBar: React.FC<ImprovedBottomTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && [styles.activeTab, { backgroundColor: tab.color }]
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.8}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.icon,
                  isActive && styles.activeIcon
                ]}>
                  {tab.icon}
                </Text>
                <Text style={[
                  styles.label,
                  isActive && styles.activeLabel
                ]}>
                  {tab.label}
                </Text>
              </View>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: tab.color }]} />}
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
    backgroundColor: MDS.colors.background.elevated,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...getModernShadow('xl'),
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: getModernSpacing('sm'),
    paddingTop: getModernSpacing('md'),
    paddingBottom: getModernSpacing('sm'),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: getModernSpacing('sm'),
    paddingHorizontal: getModernSpacing('xs'),
    borderRadius: getModernBorderRadius('lg'),
    position: 'relative',
    marginHorizontal: 2,
  },
  activeTab: {
    ...getModernShadow('md'),
  },
  tabContent: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: getModernFontSize('xs'),
    color: MDS.colors.text.secondary,
    fontWeight: MDS.typography.weights.medium,
    textAlign: 'center',
  },
  activeLabel: {
    color: MDS.colors.text.inverse,
    fontWeight: MDS.typography.weights.bold,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});

export default ImprovedBottomTabBar;
