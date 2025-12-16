# Starting Strength Workout Tracker

Ein moderner, vollständig offline-fähiger Progressive Web App (PWA) Workout-Tracker für das Starting Strength Programm. Gebaut mit Vue.js 3 mit voller Unterstützung für Deutsch und Englisch.

## Features

### 🎨 Modernes Gym Design
- Dunkles, modernes Theme optimiert für Fitnessstudios
- Responsive Design für Desktop und Mobile
- Glatte Animationen und Übergänge
- Gradient-Akzente und professionelle UI

### 💪 Workout Tracking
- Intelligente Gewichtssteigerungsvorschläge
- Letzte Training Zusammenfassung auf der Startseite
- Set-für-Set Tracking mit Completion-Status
- Notizen für jede Übung
- Automatische Zeiterfassung

### ✏️ Workout Bearbeitung
- Vollständige Bearbeitung vergangener Workouts
- Anpassung von Gewichten, Wiederholungen und Sets
- Modal-basierte Benutzeroberfläche

### 🏋️ Übungen
- **Hauptübungen:** Kniebeuge, Bankdrücken, Kreuzheben
- **Zusatzübungen:** Überkopfdrücken, Langhantelrudern
- **Bodyweight:** Klimmzüge, Dips
- Animierte Übungsausführung (Canvas-basiert)
- Detaillierte Schritt-für-Schritt Anleitungen
- Form-Tipps und häufige Fehler
- Statistiken pro Übung

### ⚙️ Konfigurierbar
- Anpassbare Workout-Zusammenstellung
- Wähle Übungen für Workout A und B
- Deutsche und Englische Sprache
- Kg oder Lbs Einheiten
- Lokale Datenspeicherung

### 📊 Statistiken & Fortschritt
- Fortschritts-Charts pro Übung
- Volumen-Tracking
- Workout-Streaks
- Durchschnittliche Trainingszeit
- Detaillierte Verlaufsansicht

### 📏 Körpermessungen
- Körpergewicht-Tracking mit Charts
- Umfangmessungen (Taille, Brust, Arme, Oberschenkel, Waden)
- Gewichtsveränderungen über Zeit
- Notizen zu jeder Messung

### 🌐 Multilingual
- **Deutsch** (Standard)
- **Englisch**
- Vollständig übersetzt inklusive Übungsanleitungen

### 📱 PWA Features
- Offline-Funktionalität
- Installierbar auf allen Geräten
- Lokale Datenspeicherung
- Service Worker für Caching
- Funktioniert ohne Internet

## Installation

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build

# Produktions-Build preview
npm run preview
```

## Starting Strength Programm

Die App implementiert das klassische Starting Strength Novice Program mit konfigurierbaren Workouts:

**Standard Workout A:**
- Kniebeuge 3x5
- Bankdrücken 3x5
- Kreuzheben 1x5

**Standard Workout B:**
- Kniebeuge 3x5
- Überkopfdrücken 3x5
- Langhantelrudern 3x5

Zusätzlich verfügbar: Klimmzüge 3x5, Dips 3x5

Trainiere 3x pro Woche (z.B. Montag/Mittwoch/Freitag) und wechsle zwischen Workout A und B.

## Verwendung

### Training starten
1. Klicke auf "Training starten" auf der Startseite
2. Sieh dir die Zusammenfassung deines letzten Trainings an
3. Gewichtsvorschläge werden automatisch berechnet
4. Markiere Sets als abgeschlossen
5. Füge Notizen hinzu wenn nötig
6. Klicke "Training beenden" zum Speichern

### Trainings bearbeiten
1. Gehe zu "Fortschritt"
2. Klicke "Bearbeiten" bei einem Training
3. Passe Gewichte und Wiederholungen an
4. Speichern

### Übungen konfigurieren
1. Gehe zu "Einstellungen"
2. Wähle Übungen für Workout A und B
3. Speichern

### Fortschritt ansehen
- **Fortschritt:** Aktuelle Gewichte und nächste Ziele
- **Statistiken:** Charts und detaillierte Analysen
- **Übungen:** Ausführungsanleitungen mit Animationen
- **Messungen:** Körpergewicht und Umfänge tracken

## Progressionslogik

Die App schlägt automatisch Gewichtssteigerungen vor basierend auf den Starting Strength Richtlinien:

- Kniebeuge: +2.5kg pro Training
- Bankdrücken: +2.5kg pro Training
- Kreuzheben: +5kg pro Training
- Überkopfdrücken: +2.5kg pro Training
- Langhantelrudern: +2.5kg pro Training
- Klimmzüge/Dips: Bodyweight (keine Gewichtssteigerung)

Wenn du nicht alle Wiederholungen schaffst, schlägt die App vor, beim gleichen Gewicht zu bleiben.

## Datensicherung

Alle Daten werden lokal im Browser's localStorage gespeichert. Um Daten zu sichern:

1. Öffne Browser DevTools (F12)
2. Gehe zu Application > Local Storage
3. Exportiere die Daten manuell
4. Zum Importieren auf einem anderen Gerät: Füge die exportierten Daten in localStorage ein

## Technologie Stack

- **Vue 3** - Composition API
- **Vue Router** - Navigation
- **Vue I18n** - Internationalisierung
- **Chart.js** - Datenvisualisierung
- **Vite** - Build Tool & Dev Server
- **vite-plugin-pwa** - PWA Funktionalität
- **Canvas API** - Übungsanimationen

## Anpassungen

### Icons ersetzen
Ersetze die Platzhalter-Icons in `/public/`:
- `icon-192.png` - 192x192px PNG
- `icon-512.png` - 512x512px PNG
- `favicon.ico` - Standard Favicon

### Theme anpassen
Bearbeite die CSS-Variablen in `src/style.css`:
```css
:root {
  --primary: #ff6b35;      /* Hauptfarbe */
  --accent: #ffd23f;       /* Akzentfarbe */
  --success: #00d9a1;      /* Erfolgsfarbe */
  --bg: #0f0f0f;           /* Hintergrund */
  /* ... */
}
```

### Neue Übung hinzufügen
1. Füge die Übung zu `src/data/exercises.js` hinzu
2. Füge Übersetzungen zu `src/i18n/locales/` hinzu
3. Erstelle Animation in `src/services/animations.js`

## Browser-Unterstützung

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

## Lizenz

MIT

## Autor

Entwickelt für Kraftsportler die ihre Fortschritte systematisch tracken möchten.
