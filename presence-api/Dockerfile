FROM node:22-alpine

RUN apk update && apk upgrade --no-cache \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN ./node_modules/.bin/prisma generate \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack \
              /usr/local/bin/npm \
              /usr/local/bin/npx \
              /usr/local/bin/corepack \
    && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/prisma db seed && node server.js"]