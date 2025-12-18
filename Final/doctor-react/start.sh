#!/bin/bash

# Увеличиваем лимит открытых файлов
ulimit -n 65536

# Настраиваем watchman для использования альтернативного пути
export WATCHMAN_SOCKFILE=~/Library/Caches/watchman/watchman.sock
mkdir -p ~/Library/Caches/watchman

# Принудительно указываем использовать watchman
export USE_WATCHMAN=1
export WATCHMAN_DISABLE_SINCE=0

# Переходим в директорию проекта
cd "$(dirname "$0")"

# Запускаем Expo
npx expo start --ios --clear

