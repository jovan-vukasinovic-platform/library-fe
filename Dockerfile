# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app/

# Instaliranje prvo zavisnosti
COPY package.json package-lock.json /app/
RUN npm ci
# Kopiranje ostatka koda i pravljenje build-a za NGINX
COPY ./ /app/
RUN npm run build

# ---------- Runtime stage ----------
# Before: https://hub.docker.com/layers/library/nginx/1.30.3-alpine3.23-slim/images/sha256-e0ce3a19af7fc65c15a237810147e411f20483b096d39486c9a2fc572329a9d5
# After: https://hub.docker.com/layers/library/nginx/1.30.4-alpine3.24-slim/images/sha256-45c3810793fe3e982fb614c67e1b696816aff3ec742620e1ef7cd9d3184185ef
FROM nginx:1.30.4-alpine3.24-slim AS runtime
# OpenSSL patch
RUN apk add --no-cache --upgrade libcrypto3 libssl3
# NGINX konfiguracija (fallback na index.html za Angular rute)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular Builder izbacuje browser bundle u dist/library-fe/browser
COPY --from=build /app/dist/library-fe/browser /usr/share/nginx/html
EXPOSE 80

# ---------- Docker Commands ----------
# docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/jovan-vukasinovic-platform:library-fe-latest -f Dockerfile .
# docker push ${{ secrets.DOCKERHUB_USERNAME }}/jovan-vukasinovic-platform:library-fe-latest
