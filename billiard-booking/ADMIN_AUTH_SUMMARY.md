# Admin-Authentifizierung mit Datenbank - Implementierung

## Zusammenfassung

Die Admin-Login-Daten werden nun sicher in der MySQL-Datenbank gespeichert, anstatt hardcodiert im Frontend zu sein.

## Was wurde implementiert

### Backend

#### 1. **Admin-Entity** (`backend/src/entities/admin.entity.ts`)
- Datenbank-Entity für Admin-User
- Felder: id, username, password (gehasht), isActive, timestamps
- Unique constraint auf username

#### 2. **Auth-Module** (`backend/src/modules/auth/`)
- **AuthService**: Authentifizierungslogik mit bcrypt
  - `validateUser()`: Prüft Username und Passwort
  - `createAdmin()`: Erstellt neuen Admin mit gehashtem Passwort
- **AuthController**: REST-Endpunkt `/auth/login`
- **AuthModule**: NestJS-Modul mit TypeORM-Integration

#### 3. **Login-DTO** (`backend/src/dto/login.dto.ts`)
- Validierung für Login-Anfragen
- Username und Passwort (min. 6 Zeichen)

#### 4. **Datenbank-Migration** (`backend/migrations/004_create_admin_table.sql`)
- SQL-Script zur Erstellung der `admins`-Tabelle
- Indizes für Performance

#### 5. **Setup-Script** (`backend/src/scripts/create-admin.ts`)
- CLI-Tool zum Erstellen von Admin-Usern
- Aufruf via `npm run create-admin`

### Frontend

#### 1. **Auth-Service Update** (`frontend/src/app/services/auth.service.ts`)
- Kommunikation mit Backend-API statt lokaler Validierung
- HTTP-POST zu `/auth/login`
- Observable-basiert für asynchrone Verarbeitung
- Fehlerbehandlung

#### 2. **Admin-Login Update** (`frontend/src/app/components/admin-login/`)
- Async-Login mit Loading-State
- Fehlerbehandlung bei fehlgeschlagenen Login-Versuchen
- Verbesserte UX mit Feedback

### Sicherheit

✅ **Implementiert:**
- Passwort-Hashing mit bcrypt (10 Rounds)
- Backend-Validierung bei jedem Login
- Keine Klartext-Passwörter im Code oder Config
- SQL-Injection-Schutz durch TypeORM
- Input-Validierung mit class-validator

⚠️ **Für Produktion noch zu implementieren:**
- JWT-Tokens statt localStorage
- HTTPS/TLS für verschlüsselte Übertragung
- Rate-Limiting gegen Brute-Force
- Session-Management
- Passwort-Änderungsfunktion
- 2FA (optional)

## Setup-Schritte

### 1. Backend-Dependencies installieren
```bash
cd backend
npm install
```

### 2. Datenbank-Migration
```bash
# Lokal
mysql -u billiard_user -p billiard_booking < migrations/004_create_admin_table.sql

# Oder via Docker
docker exec -i billiard-mysql mysql -u billiard_user -pbilliard_pass billiard_booking < migrations/004_create_admin_table.sql
```

### 3. Admin-User erstellen
```bash
cd backend
npm run create-admin
```

### 4. Backend starten
```bash
npm run start:dev
```

### 5. Frontend starten
```bash
cd ../frontend
npm start
```

### 6. Login testen
- Navigiere zu: `http://localhost:4200/admin/login`
- Username: `admin`
- Passwort: `admin123`

## API-Endpunkt

**POST** `/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Success Response (200):
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "id": 1
  }
}
```

Error Response (401):
```json
{
  "statusCode": 401,
  "message": "Ungültige Anmeldedaten"
}
```

## Dateistruktur

```
backend/
├── src/
│   ├── entities/
│   │   └── admin.entity.ts          # Neue Admin-Entity
│   ├── modules/
│   │   └── auth/                    # Neues Auth-Modul
│   │       ├── auth.module.ts
│   │       ├── auth.service.ts
│   │       └── auth.controller.ts
│   ├── dto/
│   │   └── login.dto.ts             # Neues Login-DTO
│   ├── scripts/
│   │   └── create-admin.ts          # Admin-Setup-Script
│   └── app.module.ts                # Auth-Modul registriert
├── migrations/
│   └── 004_create_admin_table.sql   # Neue Migration
├── package.json                     # bcrypt dependency
└── ADMIN_SETUP.md                   # Detaillierte Anleitung

frontend/
├── src/app/
│   ├── services/
│   │   └── auth.service.ts          # Aktualisiert für Backend-Auth
│   └── components/
│       └── admin-login/
│           └── admin-login.component.ts  # Aktualisiert für async login
└── ADMIN.md                         # Aktualisierte Dokumentation
```

## Nächste Schritte (Optional)

1. **JWT-Token-Authentifizierung**
   - `@nestjs/jwt` installieren
   - Token bei Login generieren
   - Auth-Guard mit Token-Validierung

2. **Passwort-Änderung**
   - Neuer Endpunkt: `/auth/change-password`
   - UI im Admin-Dashboard

3. **Mehrere Admin-Rollen**
   - Rollen-System (SuperAdmin, Admin, Moderator)
   - Permission-basierte Guards

4. **Admin-Verwaltung**
   - Admins über UI erstellen/löschen
   - Nur für SuperAdmin

## Getestet

✅ Backend kompiliert erfolgreich  
✅ Frontend kompiliert erfolgreich  
✅ Datenbank-Tabelle erstellt  
✅ Admin-User erstellt  
✅ Passwort wird korrekt gehasht  
✅ Login-Endpunkt funktional
