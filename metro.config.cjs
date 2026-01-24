const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Pobieramy domyślną konfigurację Expo
const config = getDefaultConfig(__dirname);

// Dodajemy aliasy do resolvera
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

// Wymuszamy śledzenie całego folderu projektu
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;