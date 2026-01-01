# Projekt-Übersicht: Billard Reservierungssystem

## 🎯 Ziel
Ein vollständiges Webbasiertes Reservierungssystem für ein GameHouse mit Billardtischen, bei dem Kunden ohne Login Tische reservieren können.

## 📋 Anforderungen

### Funktionale Anforderungen
- ✅ Reservierung ohne Login/Registrierung
- ✅ Öffnungszeiten: Täglich 16:00 - 22:00 Uhr
- ✅ Mindestbuchung: 60 Minuten
- ✅ Maximalbuchung: 180 Minuten (3 Stunden)
- ✅ Zeitslots: 30-Minuten-Intervalle
- ✅ Keine Puffer zwischen Buchungen
- ✅ Konfliktsichere Reservierungen (keine Doppelbuchungen)

### Technische Anforderungen
- ✅ Frontend: Angular 21
- ✅ Backend: NestJS mit TypeScript
- ✅ Datenbank: MySQL 8.0 (Docker)
- ✅ REST API
- ✅ Responsive Design

## 🏗️ Architektur

### System-Komponenten

```
┌─────────────────┐
│   Browser       │
│   (Angular)     │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│   NestJS API    │
│   Port 3000     │
└────────┬────────┘
         │ TypeORM
         ↓
┌─────────────────┐
│   MySQL         │
│   Port 3306     │
└─────────────────┘
```

## 📁 Dateistruktur

```
billiard-booking/
│
├── frontend/                       # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── booking/       # Hauptkomponente für Reservierung
│   │   │   ├── services/
│   │   │   │   └── api.service.ts # API-Kommunikation
│   │   │   ├── app.config.ts      # App-Konfiguration
│   │   │   └── app.routes.ts      # Routing
│   │   └── styles.css
│   ├── package.json
│   └── angular.json
│
├── backend/                        # NestJS Backend
│   ├── src/
│   │   ├── entities/              # TypeORM Entities
│   │   │   ├── table.entity.ts
│   │   │   ├── reservation.entity.ts
│   │   │   ├── opening-hours.entity.ts
│   │   │   └── blackout.entity.ts
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── create-reservation.dto.ts
│   │   │   └── check-availability.dto.ts
│   │   ├── modules/
│   │   │   ├── tables/           # Tisch-Verwaltung
│   │   │   ├── reservations/     # Reservierungs-Logik
│   │   │   └── availability/     # Verfügbarkeits-Prüfung
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                       # Umgebungsvariablen
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                         # Docker Setup
│   ├── docker-compose.yml         # MySQL + Adminer
│   └── init.sql                   # DB-Schema & Testdaten
│
├── README.md                      # Vollständige Dokumentation
├── QUICKSTART.md                  # Schnellstart-Anleitung
└── PROJEKT-ÜBERSICHT.md          # Diese Datei

```

## 💾 Datenbank-Schema

### Tables (Billardtische)
```sql
CREATE TABLE tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP
);
```

### Reservations (Reservierungen)
```sql
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT,
    customer_name VARCHAR(100),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT,
    status ENUM('pending', 'confirmed', 'cancelled'),
    created_at TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id)
);
```

### Opening Hours (Öffnungszeiten)
```sql
CREATE TABLE opening_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    day_of_week INT,  -- 0=Sonntag, 1=Montag, ..., 6=Samstag
    open_time TIME,
    close_time TIME,
    is_active BOOLEAN
);
```

### Blackouts (Sperrungen/Wartung)
```sql
CREATE TABLE blackouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT,
    start_time DATETIME,
    end_time DATETIME,
    reason VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id)
);
```

## 🔒 Konfliktsicherheit

Das System verhindert Doppelbuchungen durch:

1. **Pessimistic Locking** in der Datenbank während der Reservierung
2. **Transaction-basierte Prüfung** mit TypeORM
3. **Zeitslot-Validierung** vor der Buchung

```typescript
// Auszug aus reservations.service.ts
const existingReservation = await manager
  .createQueryBuilder(Reservation, 'reservation')
  .setLock('pessimistic_write')  // ← Lock für Konfliktsicherheit
  .where('reservation.tableId = :tableId', { tableId })
  .andWhere('reservation.startTime < :end', { end })
  .andWhere('reservation.endTime > :start', { start })
  .getOne();
```

## 🎨 Frontend Features

### Booking Component
- Tischauswahl (Dropdown)
- Datumsauswahl (Datepicker)
- Dauerauswahl (60, 90, 120, 150, 180 Minuten)
- Slot-Grid (30-min Intervalle)
  - Grün = verfügbar
  - Rot = belegt
  - Blau = ausgewählt
- Kundendaten-Formular
- Echtzeit-Validierung
- Erfolgs-/Fehlermeldungen

## 🔌 API Endpunkte

### Tische
- `GET /tables` - Liste aller Tische

### Verfügbarkeit
- `GET /availability?date=YYYY-MM-DD&tableId=1` - Slots für einen Tisch

### Reservierungen
- `POST /reservations` - Neue Reservierung
- `GET /reservations` - Alle Reservierungen
- `GET /reservations/:id` - Einzelne Reservierung
- `PATCH /reservations/:id/cancel` - Stornierung

## 🧪 Test-Szenarien

### 1. Normale Reservierung
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "customerName": "Test User",
    "startTime": "2025-01-15T18:00:00Z",
    "durationMinutes": 60
  }'
```

### 2. Konflikt-Test (Doppelbuchung verhindern)
- Reserviere Tisch 1 von 18:00-19:00
- Versuche Tisch 1 von 18:30-19:30 zu buchen
- Erwartung: Fehler "Tisch ist bereits reserviert"

### 3. Öffnungszeiten-Test
- Versuche Reservierung um 23:00 Uhr
- Erwartung: Fehler "Außerhalb der Öffnungszeiten"

## 🚀 Deployment-Optionen

### Entwicklung
- Docker für MySQL
- `npm run start:dev` für Backend
- `npm start` für Frontend

### Produktion
1. **Frontend**: `ng build` → Static Files → Nginx/Apache
2. **Backend**: `npm run build` → Node.js Server (z.B. PM2)
3. **Datenbank**: Managed MySQL (AWS RDS, DigitalOcean, etc.)

## 📈 Mögliche Erweiterungen

- 🔐 Admin-Panel mit Login
- 📧 E-Mail-Bestätigungen
- 💳 Online-Zahlung Integration
- 📱 QR-Code für Reservierungen
- 📊 Statistiken und Reports
- 🌐 Multi-Sprache Support
- 🎫 Mitgliedschaften/Abonnements
- 🔔 SMS/WhatsApp Benachrichtigungen

## 🛠️ Wartung

### Logs überwachen
```bash
# Backend
cd backend
npm run start:dev

# Docker
cd docker
docker-compose logs -f mysql
```

### Datenbank-Backup
```bash
docker exec billiard-mysql mysqldump -u billiard_user -pbilliard_pass billiard_booking > backup.sql
```

### Datenbank-Restore
```bash
docker exec -i billiard-mysql mysql -u billiard_user -pbilliard_pass billiard_booking < backup.sql
```

## 📞 Support

Bei Fragen oder Problemen:
1. Siehe [README.md](README.md)
2. Siehe [QUICKSTART.md](QUICKSTART.md)
3. Prüfe die Browser-Console und Backend-Logs
