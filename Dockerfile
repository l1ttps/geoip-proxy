FROM oven/bun

WORKDIR /app

# Install geoipupdate from official .deb package (works on Debian and Ubuntu)
RUN apt-get update \
    && apt-get install -y wget ca-certificates \
    && wget -O /tmp/geoipupdate.deb "https://github.com/maxmind/geoipupdate/releases/download/v7.1.0/geoipupdate_7.1.0_linux_arm64.deb" \
    && dpkg -i /tmp/geoipupdate.deb \
    && rm /tmp/geoipupdate.deb \
    && rm -rf /var/lib/apt/lists/*

COPY package.json .  
COPY bun.lockb .  
RUN bun install --production  

COPY src src  
COPY tsconfig.json .  

COPY entrypoint.sh /entrypoint.sh  
RUN chmod +x /entrypoint.sh  

ENV NODE_ENV production  
ENTRYPOINT ["/entrypoint.sh"]  
EXPOSE 3000  
