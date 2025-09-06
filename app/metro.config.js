const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
