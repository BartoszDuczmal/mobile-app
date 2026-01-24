const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname),
    },
  },
  // Ensure Metro watches the mapped folders
  watchFolders: [path.resolve(__dirname)],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
