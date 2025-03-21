FROM oven/bun

WORKDIR /app

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
