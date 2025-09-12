import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageKeys {
  USER_PREFERENCES: 'user_preferences';
  STORY_PROGRESS: 'story_progress';
  QUIZ_SCORES: 'quiz_scores';
  AUDIO_SETTINGS: 'audio_settings';
  THEME_SETTINGS: 'theme_settings';
  PARENT_SETTINGS: 'parent_settings';
}

export const STORAGE_KEYS: StorageKeys = {
  USER_PREFERENCES: 'user_preferences',
  STORY_PROGRESS: 'story_progress',
  QUIZ_SCORES: 'quiz_scores',
  AUDIO_SETTINGS: 'audio_settings',
  THEME_SETTINGS: 'theme_settings',
  PARENT_SETTINGS: 'parent_settings'
};

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async setItem<T>(key: keyof StorageKeys, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEYS[key], serializedValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: keyof StorageKeys): Promise<T | null> {
    try {
      const serializedValue = await AsyncStorage.getItem(STORAGE_KEYS[key]);
      if (serializedValue === null) return null;
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: keyof StorageKeys): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  async multiGet(keys: (keyof StorageKeys)[]): Promise<{ [key: string]: any }> {
    try {
      const storageKeys = keys.map(key => STORAGE_KEYS[key]);
      const results = await AsyncStorage.multiGet(storageKeys);
      
      const parsed: { [key: string]: any } = {};
      results.forEach(([key, value]) => {
        if (value !== null) {
          try {
            parsed[key] = JSON.parse(value);
          } catch {
            parsed[key] = value;
          }
        }
      });
      
      return parsed;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  }

  async multiSet(keyValuePairs: Array<[keyof StorageKeys, any]>): Promise<void> {
    try {
      const storageKeyValuePairs = keyValuePairs.map(([key, value]) => [
        STORAGE_KEYS[key],
        JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(storageKeyValuePairs as [string, string][]);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw error;
    }
  }
}

export default StorageService.getInstance();
