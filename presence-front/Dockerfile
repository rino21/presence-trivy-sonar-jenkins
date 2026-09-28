FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine

# Mise à jour des paquets système + création de l'utilisateur non-root
RUN apk upgrade --no-cache \
    && addgroup -S nonroot \
    && adduser -S nonroot -G nonroot \
    && rm -rf /usr/share/nginx/html/* \
    # Donner les droits à nonroot sur les répertoires nécessaires à nginx
    && chown -R nonroot:nonroot /usr/share/nginx/html \
    && chown -R nonroot:nonroot /var/cache/nginx \
    && chown -R nonroot:nonroot /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nonroot:nonroot /var/run/nginx.pid \
    # Écoute sur un port non privilégié (port 80 réservé à root)
    && sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html/

USER nonroot

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]