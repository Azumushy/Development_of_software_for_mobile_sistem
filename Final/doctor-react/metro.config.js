const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ограничиваем отслеживание файлов для решения проблемы EMFILE
config.watchFolders = [__dirname];

// Исключаем большие директории из отслеживания
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts],
  blockList: [
    /node_modules\/.*\/node_modules\/react-native\/.*/,
  ],
};

module.exports = config;
