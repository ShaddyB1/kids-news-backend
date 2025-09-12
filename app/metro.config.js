const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Completely disable all caching to avoid AutoCleanFileStore issues
config.cacheStores = [];
config.resetCache = true;

// Disable file watching
config.watchFolders = [];

// Override resolver to avoid problematic modules
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  resolverMainFields: ['react-native', 'browser', 'main'],
};

// Disable transformer cache
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Force disable cache
config.cache = false;

module.exports = config;