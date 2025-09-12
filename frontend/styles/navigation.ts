import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { COLORS, SHADOWS } from '@constants/theme';

export const tabNavigatorScreenOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: '#8E8E93',
  headerShown: false,
  tabBarStyle: {
    backgroundColor: COLORS.card,
    borderTopWidth: 0,
    elevation: 20,
    ...SHADOWS.large,
    paddingBottom: 8,
    paddingTop: 8,
    height: 80,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarIconStyle: {
    marginTop: 4,
  },
};
