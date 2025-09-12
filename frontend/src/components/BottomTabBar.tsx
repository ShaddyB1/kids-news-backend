import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { DS, getSpacing, getFontSize } from '../config/designSystem';

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'videos', label: 'Videos', icon: '🎬' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
  { id: 'saved', label: 'Saved', icon: '🔖' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.icon,
              activeTab === tab.id && styles.iconActive
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.label,
              activeTab === tab.id && styles.labelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DS.colors.background.elevated,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: getSpacing('sm'),
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getSpacing('xs'),
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: getFontSize('xs'),
    color: DS.colors.text.secondary,
    fontWeight: DS.typography.weights.medium,
  },
  labelActive: {
    color: DS.colors.primary.main,
    fontWeight: DS.typography.weights.bold,
  },
});

export default BottomTabBar;
