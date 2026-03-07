#!/bin/bash
# Deploy MLS Photo Tools to a DigitalOcean VPS
# Usage: ./deploy.sh <VPS_IP> [DOMAIN]
# Example: ./deploy.sh 164.90.xxx.xxx mlsphototools.com

set -e

VPS_IP="${1:?Usage: ./deploy.sh <VPS_IP> [DOMAIN]}"
DOMAIN="${2:-}"
USER="root"

echo "==> Deploying to $VPS_IP..."

# 1. Install Docker on VPS if not present
ssh $USER@$VPS_IP 'command -v docker >/dev/null 2>&1 || {
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
}'

# 2. Copy project files to VPS
echo "==> Syncing files..."
rsync -avz --exclude node_modules --exclude .next --exclude out --exclude .git \
  ./ $USER@$VPS_IP:/opt/mls-photo-tools/

# 3. Set up admin credentials on VPS if not already configured
ssh $USER@$VPS_IP 'cd /opt/mls-photo-tools && if [ ! -f .env ]; then
  read -p "Admin username [admin]: " ADMIN_USER
  ADMIN_USER=${ADMIN_USER:-admin}
  read -sp "Admin password: " ADMIN_PASS
  echo
  echo "ADMIN_USER=$ADMIN_USER" > .env
  echo "ADMIN_PASS=$ADMIN_PASS" >> .env
  chmod 600 .env
  echo "Admin credentials saved to .env"
else
  echo "Admin credentials already configured in .env"
fi'

# 4. Build and start on VPS
echo "==> Building and starting..."
ssh $USER@$VPS_IP 'cd /opt/mls-photo-tools && docker compose up -d --build'

# 5. Optional: Set up SSL with Caddy reverse proxy
if [ -n "$DOMAIN" ]; then
  echo "==> Setting up SSL with Caddy for $DOMAIN..."
  ssh $USER@$VPS_IP bash -s "$DOMAIN" << 'REMOTE'
    DOMAIN=$1
    # Install Caddy if not present
    command -v caddy >/dev/null 2>&1 || {
      apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
      curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/gpg.key" | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
      curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt" | tee /etc/apt/sources.list.d/caddy-stable.list
      apt-get update && apt-get install -y caddy
    }
    # Configure Caddy as reverse proxy with automatic HTTPS
    cat > /etc/caddy/Caddyfile << EOF
$DOMAIN {
    reverse_proxy localhost:80
}
EOF
    systemctl restart caddy
REMOTE
  echo "==> SSL configured! Site will be live at https://$DOMAIN"
  echo "    (Make sure DNS A record for $DOMAIN points to $VPS_IP)"
else
  echo "==> Site is live at http://$VPS_IP"
  echo "    To add SSL, re-run: ./deploy.sh $VPS_IP yourdomain.com"
fi
