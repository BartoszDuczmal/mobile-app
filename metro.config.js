// metro.config.js
import { getDefaultConfig } from "expo/metro-config.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirname w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = getDefaultConfig(__dirname);

// aliasy @ -> folder app
config.resolver.extraNodeModules = {
  "@": join(__dirname, "app"),
};

export default config;

