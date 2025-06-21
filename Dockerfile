FROM oven/bun AS builder

WORKDIR /app

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

# Install geoipupdate and cron from the latest release
RUN apt-get update \
    && apt-get install -y wget ca-certificates jq curl cron \
    && export GEOIPUPDATE_VERSION=$(curl -s https://api.github.com/repos/maxmind/geoipupdate/releases/latest | jq -r '.tag_name') \
    && wget -O /tmp/geoipupdate.deb "https://github.com/maxmind/geoipupdate/releases/download/${GEOIPUPDATE_VERSION}/geoipupdate_${GEOIPUPDATE_VERSION#v}_linux_amd64.deb" \
    && dpkg -i /tmp/geoipupdate.deb \
    && rm /tmp/geoipupdate.deb \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server /app/server
COPY --from=builder /app/package.json /app/package.json
COPY entrypoint.sh /entrypoint.sh  
RUN chmod +x /entrypoint.sh  

ENV NODE_ENV production  

EXPOSE ${PORT}

ENTRYPOINT ["/entrypoint.sh"]  
