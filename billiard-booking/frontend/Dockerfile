# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Baut die App im Produktionsmodus
RUN npm run build

# Stage 2: Nginx Server
FROM nginx:alpine

# WICHTIG: Hier muss '/browser' am Ende stehen, wegen "@angular/build:application"
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Nginx Konfiguration für Angular Routing (damit Reloads auf Unterseiten klappen)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
