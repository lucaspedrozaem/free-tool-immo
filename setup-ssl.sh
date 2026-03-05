#!/bin/bash
# Run this ONCE on your DigitalOcean VPS to set up HTTPS with Let's Encrypt
# Usage: ssh your-vps "bash -s" < setup-ssl.sh

set -e

DOMAIN="mlsphototools.com"

echo "=== Installing Certbot ==="
apt-get update
apt-get install -y certbot

echo "=== Creating webroot directory ==="
mkdir -p /var/www/certbot

echo "=== Temporarily using HTTP-only nginx config ==="
# Ensure nginx is running with port 80 for the ACME challenge
cat > /etc/nginx/conf.d/default.conf << 'NGINX'
server {
    listen 80;
    server_name mlsphototools.com www.mlsphototools.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /var/www/mls-photo-tools;
        try_files $uri $uri.html $uri/index.html /index.html;
    }
}
NGINX

nginx -t && systemctl reload nginx

echo "=== Requesting SSL certificate ==="
certbot certonly --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email admin@$DOMAIN

echo "=== Installing full HTTPS nginx config ==="
# The deploy workflow will handle copying nginx.conf going forward.
# For now, copy it manually:
cp /var/www/mls-photo-tools/../nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true

nginx -t && systemctl reload nginx

echo "=== Setting up auto-renewal ==="
# Certbot auto-renewal via systemd timer (installed by default)
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "=== DONE ==="
echo "HTTPS is now active at https://$DOMAIN"
echo "Certificates will auto-renew via certbot.timer"
