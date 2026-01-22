// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ustawienie aliasu @ -> folder app (dopasuj ścieżkę)
config.resolver.extraNodeModules = {
  "@": __dirname + "/app",
};

module.exports = config;
