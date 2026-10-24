#!/usr/bin/env bash
# Обновление сайта, если в GitHub появились изменения.
# Запускается cron'ом каждые 5 минут. --force — пересобрать в любом случае.
#
# Безопасно: старая сборка сохраняется, и если новая не собралась
# (например, не скачались шрифты Google), сайт остаётся на старой версии.
set -uo pipefail
cd /opt/futbolki
exec 9>/tmp/futbolki-update.lock
flock -n 9 || exit 0   # предыдущее обновление ещё идёт

git fetch -q origin master || exit 0
if [ "${1:-}" != "--force" ] && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ]; then
  exit 0
fi
echo "$(date) обновление до $(git rev-parse --short origin/master)"
git reset -q --hard origin/master
npm ci --silent || { echo "npm ci не прошёл"; exit 1; }

rm -rf .next.prev && { [ -d .next ] && cp -a .next .next.prev; }
for try in 1 2 3; do
  if npm run build; then
    systemctl restart futbolki
    rm -rf .next.prev
    echo "$(date) готово"
    exit 0
  fi
  echo "сборка не удалась (попытка $try), повтор через 20 с"
  sleep 20
done

echo "$(date) сборка не удалась 3 раза — возвращаю прошлую версию"
rm -rf .next && [ -d .next.prev ] && mv .next.prev .next
systemctl restart futbolki
exit 1
