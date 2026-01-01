# Billard Reservierungssystem

Ein vollständiges Reservierungssystem für Billardtische mit Angular Frontend, NestJS Backend und MySQL Datenbank.

## Features

✅ **Ohne Login reservieren** - Kunden können direkt buchen ohne Registrierung  
✅ **Konfliktsicher** - Keine Doppelbuchungen dank pessimistischem Locking  
✅ **Zeitslot-basiert** - 30-Minuten-Slots für flexible Buchungen  
✅ **Öffnungszeiten** - Konfigurierbare Öffnungszeiten pro Wochentag  
✅ **Blackouts** - Wartungszeiten und Events blockieren  
✅ **Responsive Design** - Funktioniert auf Desktop und Mobile  

## Technologie-Stack

- **Frontend**: Angular 21 (Standalone Components, Signals)
- **Backend**: NestJS mit TypeORM
- **Datenbank**: MySQL 8.0
- **Docker**: Für einfache Entwicklungsumgebung

## Projektstruktur

```
billiard-booking/
├── frontend/          # Angular Frontend
├── backend/           # NestJS Backend
└── docker/            # Docker Compose & MySQL Init
```

## Installation & Start

### 1. Datenbank starten

```bash
cd docker
docker-compose up -d
```

Die Datenbank ist nun verfügbar unter:
- **MySQL**: localhost:3306
- **Adminer** (DB-UI): http://localhost:8080
  - Server: mysql
  - Username: billiard_user
  - Password: billiard_pass
  - Database: billiard_booking

### 2. Backend starten

```bash
cd backend
npm install
npm run start:dev
```

Backend läuft auf: http://localhost:3000

### 3. Frontend starten

```bash
cd frontend
npm install
npm start
```

Frontend läuft auf: http://localhost:4200

## API Endpunkte

### Tische
- `GET /tables` - Alle aktiven Tische

### Verfügbarkeit
- `GET /availability?date=2024-01-15&tableId=1` - Verfügbare Slots

### Reservierungen
- `POST /reservations` - Neue Reservierung erstellen
- `GET /reservations` - Alle Reservierungen
- `GET /reservations/:id` - Einzelne Reservierung
- `PATCH /reservations/:id/cancel` - Reservierung stornieren

## Konfiguration

### Öffnungszeiten ändern

Standardmäßig: Mo-So 16:00-22:00 Uhr

In der Datenbank `opening_hours` Tabelle:
```sql
UPDATE opening_hours 
SET open_time = '14:00:00', close_time = '23:00:00' 
WHERE day_of_week = 6; -- Samstag
```

### Blackout erstellen

```sql
INSERT INTO blackouts (table_id, start_time, end_time, reason)
VALUES (1, '2024-01-15 18:00:00', '2024-01-15 20:00:00', 'Wartung');
```

### Neue Tische hinzufügen

```sql
INSERT INTO tables (name, description)
VALUES ('Tisch 4', 'Billardtisch - 9-Ball');
```

## Validierungsregeln

- **Mindestdauer**: 60 Minuten
- **Maximaldauer**: 180 Minuten (3 Stunden)
- **Slot-Größe**: 30 Minuten
- **Keine Puffer**: Slots ohne Pausen

## Datenbank-Schema

### Tables (Billardtische)
- id, name, description, is_active, created_at

### Reservations (Reservierungen)
- id, table_id, customer_name, customer_email, customer_phone
- start_time, end_time, duration_minutes, status, created_at

### Opening Hours (Öffnungszeiten)
- id, day_of_week (0-6), open_time, close_time, is_active

### Blackouts (Sperrungen)
- id, table_id, start_time, end_time, reason, created_at

## Entwicklung

### Backend neu kompilieren
```bash
cd backend
npm run build
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

## Troubleshooting

### Port bereits belegt
Falls Port 3000, 3306 oder 4200 bereits verwendet wird:

**Backend** - `.env` Datei anpassen:
```
PORT=3001
```

**Frontend** - In `package.json` unter scripts:
```json
"start": "ng serve --port 4201"
```

**MySQL** - In `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"
```

### Datenbank zurücksetzen
```bash
cd docker
docker-compose down -v
docker-compose up -d
```

## Lizenz

MIT
