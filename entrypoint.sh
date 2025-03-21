#!/bin/sh

echo "Waiting for GeoIP database..."
while [ ! -f /usr/share/GeoIP/GeoLite2-City.mmdb ]; do
  sleep 2
done

echo "GeoIP database ready, starting API..."
exec bun src/index.ts
