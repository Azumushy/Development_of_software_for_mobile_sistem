#!/bin/bash

# Увеличиваем лимит открытых файлов для текущей сессии
ulimit -n 65536

# Настраиваем окружение для использования watchman
export WATCHMAN_DISABLE_SINCE=0
export USE_WATCHMAN=1

# Переходим в директорию проекта
cd "$(dirname "$0")"

# Очищаем кэш watchman
watchman watch-del-all 2>/dev/null || true

# Запускаем Expo с правильными настройками
npx expo start --ios --clear

