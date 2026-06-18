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
FROM nginx:1.27-alpine AS runtime
# NGINX konfiguracija (fallback na index.html za Angular rute)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular Builder izbacuje browser bundle u dist/library-fe/browser
COPY --from=build /app/dist/library-fe/browser /usr/share/nginx/html
EXPOSE 80

# ---------- Docker Commands ----------
# docker build -t jovanvukasinovic/jovan-vukasinovic-platform:library-fe-latest -f Dockerfile .
# docker push jovanvukasinovic/jovan-vukasinovic-platform:library-fe-latest