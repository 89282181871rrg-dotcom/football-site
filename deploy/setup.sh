#!/usr/bin/env bash
# Установка сайта на чистый сервер Ubuntu 24.04 (Timeweb Cloud VPS).
# Запуск от root:  bash setup.sh futbolki-russia.ru
# Без домена (проверка на IP сервера):  bash setup.sh
set -euo pipefail

DOMAIN="${1:-}"
APP_DIR=/opt/futbolki
REPO=https://github.com/89282181871rrg-dotcom/football-site.git

echo "== 1. Системные пакеты"
apt-get update -y
apt-get install -y cron curl git ca-certificates gnupg debian-keyring debian-archive-keyring apt-transport-https

echo "== 1b. Подкачка 2 ГБ (на сервере 1 ГБ памяти, сборке сайта нужно больше)"
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

echo "== 2. Node.js 24"
if ! node -v 2>/dev/null | grep -q '^v24'; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi

echo "== 3. Caddy (веб-сервер, сам выпускает https-сертификат)"
if ! command -v caddy >/dev/null; then
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi

echo "== 4. Код сайта"
if [ ! -d "$APP_DIR/.git" ]; then git clone "$REPO" "$APP_DIR"; fi
cd "$APP_DIR" && git pull --ff-only

if [ ! -f "$APP_DIR/.env.local" ]; then
  echo "MOYSKLAD_TOKEN=" > "$APP_DIR/.env.local"
  chmod 600 "$APP_DIR/.env.local"
  echo "!! Впиши токен МойСклада в $APP_DIR/.env.local и запусти: bash $APP_DIR/deploy/update.sh --force"
fi

echo "== 5. Сборка"
npm ci && npm run build

echo "== 6. Автозапуск сайта"
cat > /etc/systemd/system/futbolki.service <<UNIT
[Unit]
Description=futbolki-russia.ru (Next.js)
After=network.target

[Service]
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm start -- -p 3000 -H 127.0.0.1
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now futbolki
systemctl restart futbolki

echo "== 7. Веб-сервер"
if [ -n "$DOMAIN" ]; then
  printf '%s, www.%s {\n  encode gzip\n  reverse_proxy 127.0.0.1:3000\n}\n' "$DOMAIN" "$DOMAIN" > /etc/caddy/Caddyfile
else
  printf ':80 {\n  encode gzip\n  reverse_proxy 127.0.0.1:3000\n}\n' > /etc/caddy/Caddyfile
fi
systemctl reload caddy || systemctl restart caddy

echo "== 8. Автообновление из GitHub каждые 5 минут"
systemctl enable --now cron
echo "*/5 * * * * root bash $APP_DIR/deploy/update.sh >> /var/log/futbolki-update.log 2>&1" > /etc/cron.d/futbolki-update

echo "== Готово. Проверка:"
sleep 5
curl -s -o /dev/null -w "сайт отвечает: %{http_code}\n" http://127.0.0.1:3000/
