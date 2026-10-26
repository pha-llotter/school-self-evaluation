#!/usr/bin/env bash
# One-time preparation of a fresh Ubuntu 24.04 / Debian 12 VPS for School Self-Evaluation.
# Run as root:   bash setup-server.sh sse.yourschool.co.za
set -euo pipefail

DOMAIN="${1:-}"
if [[ -z "$DOMAIN" ]]; then
  echo "Usage: bash setup-server.sh <domain>   e.g. bash setup-server.sh sse.yourschool.co.za" >&2
  exit 1
fi
[[ $EUID -eq 0 ]] || { echo "Run as root (sudo -i)." >&2; exit 1; }
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> System updates and basic tools"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y upgrade
apt-get install -y curl ca-certificates gnupg ufw sqlite3 unattended-upgrades debian-keyring debian-archive-keyring apt-transport-https
timedatectl set-timezone Africa/Johannesburg || true
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Node.js 24"
if ! node -v 2>/dev/null | grep -q '^v24\.'; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi
node -v

echo "==> Caddy (web server with automatic HTTPS)"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
fi

echo "==> Service user and folders"
id sse >/dev/null 2>&1 || useradd --system --home-dir /var/lib/sse --shell /usr/sbin/nologin sse
[[ -d /opt/sse-src/.git ]] || { echo "Clone the repository to /opt/sse-src first (see DEPLOY.md)." >&2; exit 1; }
install -d -o root -g root -m 755 /opt/sse
install -d -o sse -g sse -m 700 /var/lib/sse
install -d -o root -g root -m 750 /var/backups/sse
install -d -o root -g sse -m 750 /etc/sse
if [[ ! -f /etc/sse/sse.env ]]; then
  install -o root -g sse -m 640 "$HERE/sse.env.example" /etc/sse/sse.env
fi

echo "==> systemd service"
install -m 644 "$HERE/sse.service" /etc/systemd/system/sse.service
systemctl daemon-reload
systemctl enable sse

echo "==> Caddy site for $DOMAIN"
sed "s/__DOMAIN__/$DOMAIN/" "$HERE/Caddyfile.template" > /etc/caddy/Caddyfile
install -d -o caddy -g caddy /var/log/caddy
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy || systemctl restart caddy

echo "==> Firewall (SSH, HTTP, HTTPS only)"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

echo "==> Nightly database backup (02:30, kept 30 days)"
install -m 755 "$HERE/backup.sh" /usr/local/sbin/sse-backup
echo "30 2 * * * root /usr/local/sbin/sse-backup >/dev/null 2>&1" > /etc/cron.d/sse-backup
chmod 644 /etc/cron.d/sse-backup

# sse-deploy: fetch the latest pushed version, then install it
cat > /usr/local/sbin/sse-deploy <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
git -C /opt/sse-src pull --ff-only
exec bash /opt/sse-src/deploy/deploy.sh
EOF
chmod 755 /usr/local/sbin/sse-deploy

echo
echo "Server ready. Next: run   sse-deploy"
