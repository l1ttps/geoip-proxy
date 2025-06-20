#!/bin/sh

# Write GeoIP.conf from environment variables
cat <<EOF > /etc/GeoIP.conf
AccountID ${GEOIPUPDATE_ACCOUNT_ID}
LicenseKey ${GEOIPUPDATE_LICENSE_KEY}
EditionIDs ${GEOIPUPDATE_EDITION_IDS:-GeoLite2-City GeoLite2-Country GeoLite2-ASN}
# Optional: set frequency or other options if needed
# DatabaseDirectory /usr/share/GeoIP
EOF

# Run geoipupdate to update GeoIP databases
/usr/bin/geoipupdate

# Start the API
./server
