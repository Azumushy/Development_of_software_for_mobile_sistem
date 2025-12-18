#!/bin/bash

# Увеличиваем лимит открытых файлов
ulimit -n 65536

# Убеждаемся, что watchman используется
export WATCHMAN_DISABLE_SINCE=0

# Запускаем Expo
cd "$(dirname "$0")"
npx expo start --ios --clear

