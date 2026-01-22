import { getDefaultConfig } from "expo/metro-config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Pobranie katalogu projektu w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = getDefaultConfig(__dirname);

// ustawienie aliasu @ -> folder app
config.resolver.extraNodeModules = {
  "@": join(__dirname, "app"),
};

export default config;
