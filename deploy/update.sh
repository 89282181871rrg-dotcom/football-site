#!/usr/bin/env bash
# Обновление сайта, если в GitHub появились изменения.
# Запускается cron'ом каждые 5 минут. --force — пересобрать в любом случае.
set -euo pipefail
cd /opt/futbolki
git fetch -q origin master
if [ "${1:-}" != "--force" ] && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ]; then
  exit 0
fi
echo "$(date) обновление до $(git rev-parse --short origin/master)"
git reset -q --hard origin/master
npm ci --silent
npm run build
systemctl restart futbolki
