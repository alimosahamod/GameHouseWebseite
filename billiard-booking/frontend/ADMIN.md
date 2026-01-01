# Admin-Bereich

## Zugang zum Admin-Dashboard

Das Admin-Dashboard ermöglicht die Verwaltung aller Reservierungen.

### Login-Daten

- **URL**: `http://localhost:4200/admin/login`
- **Benutzername**: `admin`
- **Passwort**: `admin123`

### Funktionen

1. **Reservierungsübersicht**
   - Alle aktiven Reservierungen nach Datum gruppiert
   - Sortierung chronologisch
   - Kompakte Kartenansicht mit wichtigsten Informationen

2. **Reservierungsdetails**
   - Vollständige Informationen zu jeder Reservierung
   - Tisch, Datum, Uhrzeit, Dauer
   - Kundendaten (Name, E-Mail, Telefon)
   - Status

3. **Reservierung löschen**
   - Direkt aus der Übersicht
   - Oder aus der Detailansicht
   - Mit Bestätigungsdialog

4. **Logout**
   - Sicheres Abmelden über den Button im Header

## Setup

### Backend-Einrichtung erforderlich

Die Admin-Authentifizierung nutzt nun die Datenbank. Vor dem ersten Login:

1. **Dependencies installieren**:
   ```bash
   cd ../backend
   npm install
   ```

2. **Datenbank-Migration ausführen**:
   ```bash
   mysql -u billiard_user -p billiard_booking < migrations/004_create_admin_table.sql
   ```

3. **Admin-User erstellen**:
   ```bash
   npm run create-admin
   ```

Detaillierte Anweisungen: `backend/ADMIN_SETUP.md`

## Sicherheitshinweis

Die Admin-Daten werden sicher in der Datenbank gespeichert:
- ✅ Passwörter werden mit bcrypt gehasht
- ✅ Backend-Validierung bei jedem Login
- ✅ Keine Klartext-Passwörter im Code

Für den Produktivbetrieb sollten zusätzlich implementiert werden:
- JWT-Tokens statt localStorage
- HTTPS für verschlüsselte Übertragung
- Rate-Limiting gegen Brute-Force
- Passwort-Änderungsfunktion

## Technische Details

- **Auth Guard**: Schützt das Dashboard vor unautorisiertem Zugriff
- **Auth Service**: Kommuniziert mit Backend-API für Login
- **Backend API**: POST `/auth/login` für Authentifizierung
- **Datenbank**: Admin-Tabelle mit verschlüsselten Passwörtern
- **API Integration**: Nutzt bestehende API-Endpunkte zum Lesen und Löschen von Reservierungen
