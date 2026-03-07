#!/bin/sh
# Generate htpasswd from environment variables if provided
# Usage: docker run -e ADMIN_USER=admin -e ADMIN_PASS=yourpassword ...

if [ -n "$ADMIN_USER" ] && [ -n "$ADMIN_PASS" ]; then
  htpasswd -cb /etc/nginx/.htpasswd "$ADMIN_USER" "$ADMIN_PASS"
  echo "Admin auth configured for user: $ADMIN_USER"
else
  # Create a default locked-out htpasswd so nginx doesn't error
  echo "WARNING: ADMIN_USER and ADMIN_PASS not set. Admin page will be inaccessible."
  echo "# No admin user configured" > /etc/nginx/.htpasswd
fi

exec "$@"
