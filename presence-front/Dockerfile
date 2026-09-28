FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine

RUN apk upgrade --no-cache \
    && addgroup -S nonroot \
    && adduser -S nonroot -G nonroot \
    && rm -rf /usr/share/nginx/html/* \
    # Droits sur les répertoires utilisés par nginx
    && chown -R nonroot:nonroot /usr/share/nginx/html \
    && chown -R nonroot:nonroot /var/cache/nginx \
    && chown -R nonroot:nonroot /var/log/nginx \
    && chown -R nonroot:nonroot /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nonroot:nonroot /var/run/nginx.pid \
    # Port non privilégié
    && sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf \
    # Supprimer le warning "user directive"
    && sed -i 's/^user\s\+nginx;/# user nginx;/' /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html/

USER nonroot

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]