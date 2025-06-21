#!/bin/sh

# Write GeoIP.conf from environment variables
cat <<EOF > /etc/GeoIP.conf
AccountID ${GEOIPUPDATE_ACCOUNT_ID}
LicenseKey ${GEOIPUPDATE_LICENSE_KEY}
EditionIDs ${GEOIPUPDATE_EDITION_IDS:-GeoLite2-City GeoLite2-Country GeoLite2-ASN}
EOF

# Set default cron schedule if not provided (twice a week: Tue & Fri at 2am)
GEOIPUPDATE_CRON="${GEOIPUPDATE_CRON:-0 2 * * 2,5}"

# Create log directory for cron output
mkdir -p /var/log

# Write the cron job for geoipupdate
echo "$GEOIPUPDATE_CRON /usr/bin/geoipupdate >> /var/log/geoipupdate-cron.log 2>&1" > /etc/cron.d/geoipupdate
chmod 0644 /etc/cron.d/geoipupdate
crontab /etc/cron.d/geoipupdate

# Start cron in the background
echo "Starting cron daemon..."
cron

# Run geoipupdate once at startup
echo "Updating GeoIP databases at startup..."
/usr/bin/geoipupdate

# Start the API
echo "Starting API server..."
./server
