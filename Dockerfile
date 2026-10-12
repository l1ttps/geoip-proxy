FROM oven/bun AS builder

WORKDIR /app

# Set NODE_ENV to production during build
ENV NODE_ENV=production

COPY package.json .  
COPY bun.lockb .  
RUN bun install --production  

COPY src src  
COPY tsconfig.json .  

# Build the server using the build script
RUN bun run build

# --- Production image ---
FROM debian:bookworm-slim AS production

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download the free DB-IP Lite databases (CC BY 4.0, no account needed).
# DB-IP publishes monthly; fall back to last month's release when the
# current one isn't out yet (e.g. early on the 1st).
RUN mkdir -p /usr/share/GeoIP \
    && for t in city asn; do \
         for m in $(date +%Y-%m) $(date -d "$(date +%Y-%m-01) -1 month" +%Y-%m); do \
           curl -fsSL -o /tmp/dbip-$t.mmdb.gz "https://download.db-ip.com/free/dbip-$t-lite-$m.mmdb.gz" \
             && gunzip -c /tmp/dbip-$t.mmdb.gz > /usr/share/GeoIP/dbip-$t-lite.mmdb \
             && echo "Downloaded dbip-$t-lite-$m" && break; \
         done; \
         rm -f /tmp/dbip-$t.mmdb.gz; \
         test -s /usr/share/GeoIP/dbip-$t-lite.mmdb || { echo "Failed to download dbip-$t-lite" >&2; exit 1; }; \
       done

COPY --from=builder /app/server /app/server
COPY --from=builder /app/package.json /app/package.json
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV production

EXPOSE ${PORT}

ENTRYPOINT ["/entrypoint.sh"]
