#!/usr/bin/env bash
# Install or update the app from the git checkout in /opt/sse-src (run via: sse-deploy).
# The previous version is kept in /opt/sse.prev (roll back: see DEPLOY.md).
set -euo pipefail

SRC=/opt/sse-src
NEW=/opt/sse.new
[[ $EUID -eq 0 ]] || { echo "Run as root." >&2; exit 1; }

echo "==> Preparing version $(git -C "$SRC" log -1 --format='%h %s')"
rm -rf "$NEW"
mkdir -p "$NEW"
git -C "$SRC" archive HEAD | tar -x -C "$NEW"

echo "==> Installing packages and building"
cd "$NEW"
npm ci --no-audit --no-fund
npm run build
chown -R root:root "$NEW"
chmod -R go-w "$NEW"

echo "==> Backing up the database before switching"
/usr/local/sbin/sse-backup || true

echo "==> Switching to the new version"
systemctl stop sse || true
rm -rf /opt/sse.prev
if [[ -d /opt/sse/server ]]; then
  mv /opt/sse /opt/sse.prev
else
  rm -rf /opt/sse # empty folder from setup-server.sh
fi
mv "$NEW" /opt/sse
systemctl start sse

for i in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:5050/api/health >/dev/null 2>&1; then
    echo "App is running."
    if [[ -f /var/lib/sse/ADMIN-FIRST-LOGIN.txt ]]; then
      echo "First admin sign-in details: cat /var/lib/sse/ADMIN-FIRST-LOGIN.txt"
    fi
    exit 0
  fi
  sleep 1
done
echo "The app did not start. Check: journalctl -u sse -n 50" >&2
exit 1
