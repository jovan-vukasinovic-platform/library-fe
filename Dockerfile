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
# Before: https://hub.docker.com/layers/library/nginx/1.27-alpine/images/sha256-297103a3c691cdcf92468fe0a3000e14399530c42a3d6a9ec4b4fc0b2442a4bb
# After: https://hub.docker.com/layers/library/nginx/1.30.3-alpine3.23-slim/images/sha256-e0ce3a19af7fc65c15a237810147e411f20483b096d39486c9a2fc572329a9d5
FROM nginx:1.30.3-alpine3.23-slim AS runtime
# NGINX konfiguracija (fallback na index.html za Angular rute)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular Builder izbacuje browser bundle u dist/library-fe/browser
COPY --from=build /app/dist/library-fe/browser /usr/share/nginx/html
EXPOSE 80

# ---------- Docker Commands ----------
# docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/jovan-vukasinovic-platform:library-fe-latest -f Dockerfile .
# docker push ${{ secrets.DOCKERHUB_USERNAME }}/jovan-vukasinovic-platform:library-fe-latest