import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

import HomeScreen from './screens/HomeScreen';
import StoriesScreen from './screens/StoriesScreen';
import QuizScreen from './screens/QuizScreen';
import ArchiveScreen from './screens/ArchiveScreen';
import ParentScreen from './screens/ParentScreen';
import AccountScreen from './screens/AccountScreen';

import commonStyles from './styles/commonStyles';
import { tabNavigatorScreenOptions } from './styles/navigation';

const Tab = createBottomTabNavigator();

export default function App() {
  // Check for updates on app start
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Handle update errors silently
        console.log('Update check failed:', e);
      }
    }
    checkForUpdates();
  }, []);

  // Initialize RevenueCat
  useEffect(() => {
    const rc = Constants.expoConfig?.extra?.revenuecat || Constants.manifest?.extra?.revenuecat;
    if (rc?.apiKeyAndroid) {
      const apiKey = Platform.select({ ios: rc.apiKeyIos, android: rc.apiKeyAndroid });
      if (apiKey) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.WARN);
        Purchases.configure({ apiKey });
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" translucent={false} />
      <NavigationContainer>
        <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>🏠</Text> }}
        />
        <Tab.Screen 
          name="Stories" 
          component={StoriesScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>📚</Text> }}
        />

        <Tab.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>🧠</Text> }}
        />
        <Tab.Screen 
          name="Archive" 
          component={ArchiveScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>📚</Text> }}
        />
        <Tab.Screen 
          name="Parents" 
          component={ParentScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>👨‍👩‍👧‍👦</Text> }}
        />
        <Tab.Screen 
          name="Account" 
          component={AccountScreen}
          options={{ tabBarIcon: () => <Text style={commonStyles.tabIcon}>👤</Text> }}
        />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
// Screens and styles moved into dedicated files under ./screens and ./styles