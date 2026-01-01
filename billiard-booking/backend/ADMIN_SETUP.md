# Admin-Authentifizierung Setup

## Überblick

Die Admin-Authentifizierung wurde in die Datenbank integriert. Login-Daten werden nun sicher in der MySQL-Datenbank mit bcrypt-verschlüsselten Passwörtern gespeichert.

## Installation

### 1. Dependencies installieren

```bash
cd backend
npm install
```

Dies installiert automatisch:
- `bcrypt` für Passwort-Hashing
- `@types/bcrypt` für TypeScript-Support

### 2. Datenbank-Migration ausführen

```bash
mysql -u billiard_user -p billiard_booking < migrations/004_create_admin_table.sql
```

Oder über Docker:
```bash
docker exec -i billiard-mysql mysql -u billiard_user -pbilliard_pass billiard_booking < migrations/004_create_admin_table.sql
```

### 3. Standard-Admin erstellen

```bash
npm run create-admin
```

Dies erstellt einen Admin mit:
- **Username**: `admin`
- **Passwort**: `admin123`

Das Passwort wird automatisch mit bcrypt gehasht und sicher in der Datenbank gespeichert.

## API-Endpunkte

### Login

**POST** `/auth/login`

Request Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response (Erfolg):
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "id": 1
  }
}
```

Response (Fehler):
```json
{
  "statusCode": 401,
  "message": "Ungültige Anmeldedaten"
}
```

## Sicherheit

### Produktiv-Einsatz

Für den Produktivbetrieb sollten folgende Maßnahmen ergriffen werden:

1. **Passwort ändern**
   - Standard-Passwort `admin123` ändern
   - Direkt in der Datenbank mit gehashtem Wert aktualisieren

2. **JWT-Tokens implementieren**
   - Statt localStorage-basierter Auth
   - Tokens mit Ablaufzeit
   - Refresh-Token-Mechanismus

3. **HTTPS verwenden**
   - Keine unverschlüsselte Übertragung von Credentials

4. **Rate-Limiting**
   - Schutz vor Brute-Force-Attacken
   - z.B. mit `@nestjs/throttler`

5. **Environment Variables**
   - API-URL nicht hardcoden
   - Über Environment-Variablen konfigurieren

## Zusätzliche Admins erstellen

Manuell über die Datenbank oder ein eigenes Script:

```typescript
// Beispiel-Code
import * as bcrypt from 'bcrypt';

const password = 'meinPasswort';
const hashedPassword = await bcrypt.hash(password, 10);

// INSERT INTO admins (username, password) VALUES ('username', hashedPassword);
```

## Troubleshooting

### Admin kann nicht erstellt werden

**Problem**: Fehler "ER_DUP_ENTRY"
- **Lösung**: Admin existiert bereits. Passwort über Datenbank zurücksetzen.

### Login schlägt fehl

**Problem**: "Ungültige Anmeldedaten"
- Überprüfen Sie Username und Passwort
- Stellen Sie sicher, dass `isActive = TRUE` in der Datenbank
- Backend-Logs prüfen für detaillierte Fehlermeldungen

### CORS-Fehler

**Problem**: Frontend kann Backend nicht erreichen
- **Lösung**: CORS ist für `http://localhost:4200` konfiguriert
- Bei anderem Port/Domain: `main.ts` anpassen
