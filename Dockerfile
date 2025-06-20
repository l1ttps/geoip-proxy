FROM oven/bun

WORKDIR /app

# Install geoipupdate from the latest release
RUN apt-get update \
    && apt-get install -y wget ca-certificates jq curl \
    && export GEOIPUPDATE_VERSION=$(curl -s https://api.github.com/repos/maxmind/geoipupdate/releases/latest | jq -r '.tag_name') \
    && wget -O /tmp/geoipupdate.deb "https://github.com/maxmind/geoipupdate/releases/download/${GEOIPUPDATE_VERSION}/geoipupdate_${GEOIPUPDATE_VERSION#v}_linux_arm64.deb" \
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
