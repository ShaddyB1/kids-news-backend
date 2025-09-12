import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

export const FEATURES = {
  // Disable native features in Expo Go and for testing
  AUTH_ENABLED: false, // Disabled for testing - was !isExpoGo
  PURCHASES_ENABLED: false, // Disabled for testing - was !isExpoGo
  NOTIFICATIONS_ENABLED: false, // Disabled for testing - was !isExpoGo
  UPDATES_ENABLED: false, // Disabled for testing - was !isExpoGo
} as const;

// Mock data for when features are disabled
export const MOCK_AUTH = {
  user: null,
  entitled: true, // Set to true to see premium content in Expo Go
};

export const isMockMode = isExpoGo;
