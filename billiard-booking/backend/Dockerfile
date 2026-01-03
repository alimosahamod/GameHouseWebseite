# backend/Dockerfile

# Wir nutzen ein leichtes Node-Image als Basis
FROM node:18-alpine

# Arbeitsverzeichnis im Container erstellen
WORKDIR /app

# Zuerst nur die Abhängigkeits-Definitionen kopieren (für besseres Caching)
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Jetzt den restlichen Quellcode kopieren
COPY . .

# Die NestJS-App bauen (erstellt den 'dist' Ordner)
RUN npm run build

# Port 3000 freigeben
EXPOSE 3000

# Start-Befehl für die Produktion
CMD ["npm", "run", "start:prod"]