const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  // Removed blacklistRE to allow Metro to resolve all files in node_modules
};

module.exports = defaultConfig;
