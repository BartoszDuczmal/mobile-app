const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname), // Wskazuje na główny folder "native"
};

// To wymusza na Metro, by śledziło pliki w Twoim projekcie pod kątem tych aliasów
config.watchFolders = [path.resolve(__dirname)];

// Dodajemy obsługę rozszerzeń, aby Metro wiedziało, że config może być .js lub .ts
config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx'];

module.exports = config; // Upewnij się, że używasz module.exports, a nie export default