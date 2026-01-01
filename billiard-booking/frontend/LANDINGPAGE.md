# Landingpage - Anleitung

## Übersicht

Die moderne, dunkle Landingpage wurde erfolgreich erstellt mit:
- ✅ Hamburger-Menü (3 Striche oben links)
- ✅ Vollbild-Navigation Overlay
- ✅ Hero-Section mit verblassendem Bild beim Scrollen
- ✅ Minimalistisches Design mit wenig Text
- ✅ Dunkler Hintergrund (#0a0a0a)
- ✅ Alle Unterseiten: Reservierung, Preise, Getränkekarte, Öffnungszeiten, Galerie, Hausordnung, Impressum

## Eigenes Bild einfügen

### Methode 1: Über das Assets-Verzeichnis (Empfohlen)

1. **Bild vorbereiten**
   - Empfohlene Größe: 1920x1080px oder höher
   - Format: JPG, PNG oder WebP
   - Dateiname: z.B. `hero-image.jpg`

2. **Bild platzieren**
   ```bash
   # Kopiere dein Bild ins Assets-Verzeichnis
   cp /pfad/zu/deinem/bild.jpg frontend/src/assets/hero-image.jpg
   ```

3. **Template aktualisieren**
   
   Öffne: `src/app/components/landing/landing.component.html`
   
   **Ersetze** (Zeile 32-36):
   ```html
   <div class="hero-image" [style.opacity]="scrollOpacity()">
     <!-- Platzhalter für Ihr Bild -->
     <div class="image-placeholder">
       <p>Ihr Bild hier einfügen</p>
     </div>
   </div>
   ```
   
   **Mit**:
   ```html
   <div class="hero-image" [style.opacity]="scrollOpacity()">
     <img src="assets/hero-image.jpg" alt="Billard Lounge">
   </div>
   ```

4. **CSS aktualisieren**
   
   Füge in `landing.component.css` nach `.hero-image` hinzu:
   ```css
   .hero-image img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     object-position: center;
   }
   ```

### Methode 2: Über URL (Externe Quelle)

Wenn dein Bild bereits online gehostet ist:

```html
<div class="hero-image" [style.opacity]="scrollOpacity()">
  <img src="https://deine-domain.de/bilder/hero.jpg" alt="Billard Lounge">
</div>
```

### Methode 3: Base64 (Für kleine Bilder)

Für kleine Logos oder Icons kannst du auch Base64 verwenden, aber nicht empfohlen für große Hero-Bilder.

## Galerie-Bilder einfügen

1. **Bilder ins Assets kopieren**
   ```bash
   cp bild1.jpg frontend/src/assets/gallery/bild1.jpg
   cp bild2.jpg frontend/src/assets/gallery/bild2.jpg
   # usw.
   ```

2. **Template aktualisieren**
   
   In `landing.component.html`, Galerie-Section (Zeile 122-127):
   
   **Ersetze**:
   ```html
   <div class="gallery-grid">
     <div class="gallery-placeholder">Bild 1</div>
     <div class="gallery-placeholder">Bild 2</div>
     <div class="gallery-placeholder">Bild 3</div>
     <div class="gallery-placeholder">Bild 4</div>
   </div>
   ```
   
   **Mit**:
   ```html
   <div class="gallery-grid">
     <img src="assets/gallery/bild1.jpg" alt="Galerie 1">
     <img src="assets/gallery/bild2.jpg" alt="Galerie 2">
     <img src="assets/gallery/bild3.jpg" alt="Galerie 3">
     <img src="assets/gallery/bild4.jpg" alt="Galerie 4">
   </div>
   ```

3. **CSS für Galerie-Bilder hinzufügen**
   
   In `landing.component.css`:
   ```css
   .gallery-grid img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: 8px;
     border: 1px solid #222;
     transition: all 0.3s ease;
   }

   .gallery-grid img:hover {
     border-color: #4a9eff;
     transform: scale(1.05);
   }
   ```

## Inhalte anpassen

### Preise ändern
Datei: `landing.component.html` (Zeile 52-71)

### Getränkekarte ändern
Datei: `landing.component.html` (Zeile 74-98)

### Öffnungszeiten ändern
Datei: `landing.component.html` (Zeile 101-117)

### Impressum ändern
Datei: `landing.component.html` (Zeile 143-152)

### Titel und Untertitel ändern
Datei: `landing.component.html` (Zeile 40-41)

## Design anpassen

### Farben ändern

In `landing.component.css`:

- **Primärfarbe** (Blau): `#4a9eff` → Suchen & Ersetzen
- **Hintergrund**: `#0a0a0a`
- **Karten-Hintergrund**: `#151515`
- **Borders**: `#222`

### Scroll-Fade-Geschwindigkeit anpassen

In `landing.component.ts` (Zeile 20-21):

```typescript
const fadeStart = 0;     // Wann Fade beginnt (in Pixeln)
const fadeEnd = 400;     // Wann Fade endet (in Pixeln)
```

Erhöhe `fadeEnd` für langsameres Ausblenden.

## Navigation

- **Hauptseite**: `http://localhost:4200/`
- **Reservierung**: `http://localhost:4200/booking`
- **Admin-Login**: `http://localhost:4200/admin/login`
- **Admin-Dashboard**: `http://localhost:4200/admin/dashboard`

## Features

### Hamburger-Menü
- Oben links, 3 Striche
- Animiertes X beim Öffnen
- Vollbild-Overlay mit Navigation
- Smooth Scroll zu Sektionen

### Hero-Image
- Verblasst beim Runterscrollen
- Responsive und zentriert
- Gradient-Overlay für bessere Lesbarkeit

### Call-to-Action Button
- "Jetzt Reservieren" führt zur Booking-Seite
- Hover-Effekt mit Animation

### Responsive Design
- Mobile-optimiert
- Tablet-optimiert
- Desktop-optimiert

## Build & Deploy

Nach Änderungen kompilieren:
```bash
cd frontend
npm run build
```

## Support

Bei Problemen oder Fragen zur Anpassung der Landingpage, siehe die Kommentare im Code oder konsultiere die Angular-Dokumentation.
