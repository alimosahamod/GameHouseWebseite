# Quick Start Guide

## In 3 Schritten zum laufenden System

### Schritt 1: Datenbank starten (MySQL + Adminer)

```bash
cd docker
docker-compose up -d
```

✅ MySQL läuft auf Port 3306  
✅ Adminer (DB-UI) auf http://localhost:8080  
✅ Datenbank wird automatisch initialisiert mit 3 Tischen

### Schritt 2: Backend starten (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

✅ Backend läuft auf http://localhost:3000  
✅ API Endpunkte verfügbar  
✅ CORS für Frontend aktiviert

### Schritt 3: Frontend starten (Angular)

```bash
cd frontend
npm install
npm start
```

✅ Frontend läuft auf http://localhost:4200  
✅ Öffne Browser: http://localhost:4200

## Fertig! 🎉

Die Anwendung ist jetzt bereit:

1. **Tisch auswählen** - Wähle einen der 3 Billardtische
2. **Datum wählen** - Wähle das gewünschte Datum
3. **Zeitslot auswählen** - Klicke auf einen verfügbaren Slot (grün)
4. **Daten eingeben** - Gib Name und optional Email/Telefon ein
5. **Reservieren** - Klicke auf "Jetzt reservieren"

## Standard-Öffnungszeiten

Täglich: 16:00 - 22:00 Uhr

## Beispiel-Tische

1. **Tisch 1** - Professioneller Billardtisch - Poolbillard
2. **Tisch 2** - Professioneller Billardtisch - Poolbillard
3. **Tisch 3** - Snooker-Tisch

## API Testen

### Tische abrufen
```bash
curl http://localhost:3000/tables
```

### Verfügbarkeit prüfen
```bash
curl "http://localhost:3000/availability?date=2025-01-15&tableId=1"
```

### Reservierung erstellen
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "customerName": "Max Mustermann",
    "customerEmail": "max@beispiel.de",
    "startTime": "2025-01-15T18:00:00Z",
    "durationMinutes": 60
  }'
```

## Datenbank verwalten

Öffne http://localhost:8080 (Adminer)

- **Server**: mysql
- **Benutzername**: billiard_user
- **Passwort**: billiard_pass
- **Datenbank**: billiard_booking

## Hilfreiche Befehle

### Docker Status prüfen
```bash
docker-compose ps
```

### Logs anzeigen
```bash
# Backend
cd backend
npm run start:dev

# Docker
cd docker
docker-compose logs -f
```

### Alles stoppen
```bash
# Backend: Ctrl+C im Terminal

# Frontend: Ctrl+C im Terminal

# Docker
cd docker
docker-compose down
```

### Datenbank komplett zurücksetzen
```bash
cd docker
docker-compose down -v
docker-compose up -d
```

## Nächste Schritte

- 📖 Lies die vollständige [README.md](README.md)
- 🛠️ Passe Öffnungszeiten an
- 🎨 Customise das Frontend
- 🔒 Füge Authentifizierung hinzu (optional)
