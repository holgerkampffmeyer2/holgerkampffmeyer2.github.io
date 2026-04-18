# Mixes with Tracklists - Dokumentation

## Übersicht

Die "Mixes with Tracklists" Seite präsentiert wöchentliche DJ-Mixes von DJ Hulk mit vollständigen Tracklists.

**Seitenstruktur:**
- `/dj/mixes` - Übersichtsseite mit neuestem Mix, Karussell und Filter nach Stimmung
- `/dj/mixes/{nummer}` - Einzelne Mix-Seite mit Player und Tracklist (z.B. `/dj/mixes/176`)
- `/dj/mixes-blog-archive` - Komprimierte Archiv-Ansicht aller Mixes

## Script: `scripts/fetch-mixcloud-blog.mjs`

Dieses Script holt die neuesten 10 Mixes von Mixcloud und erstellt die `blog-posts.json` Daten.

### Genre → Use-Case Mapping

Das Mapping liegt in `src/data/genre-use-case-mapping.json`:

```json
{
  "mappings": [
    {
      "genres": ["drum & bass", "dnb", "jungle", ...],
      "useCases": ["gym"]
    },
    {
      "genres": ["deep", "soulful", "funky", ...],
      "useCases": ["drive"]
    },
    {
      "genres": ["tech house", "minimal tech house", ...],
      "useCases": ["work", "gym"]
    },
    {
      "genres": ["latin house", "tribal house", ...],
      "useCases": ["party"]
    }
  ]
}
```

- Ein Genre kann mehrere Use-Cases haben (z.B. Tech House → work + gym)
- Ein Use-Case kann mehrere Genres haben

### Workflow

1. **API Call**: Holt 10 neueste Mixes von `https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=10`
2. **Mix-Details**: Für jeden Mix wird die API mit `?metadata=1` aufgerufen für die vollständige Beschreibung
3. **Tracklist**: Sucht in `src/data/tracklists/` nach Dateien mit Pattern `*Mix{nummer}*tracklist*.txt`
4. **Hero-Image**: Sucht in `public/tracklists/` nach `*Mix{nummer}*.webp`
5. **Use-Cases**: Leitet aus Mixcloud-Tags ab (kann mehrere pro Mix sein)
6. **Seiten-Generierung**: Erstellt automatisch `/dj/mixes/{nummer}.html` für jeden Mix mit Tracklist

### Voraussetzungen

**Tracklists** müssen in `src/data/tracklists/` liegen:
- Dateiname enthält Mix-Nummer: `DJ Hulk - Mix175-TechHouse-tracklist.txt`
- Format: Textdatei mit Tracklist (Artist - Track)

**Hero-Images** müssen in `public/tracklists/` liegen:
- Format: WebP (wird aus PNG konvertiert)
- Dateiname enthält Mix-Nummer: `Mixcloud Post Mix175.webp`

### Manuell ausführen

```bash
node scripts/fetch-mixcloud-blog.mjs
```

### Automatisch

Das Script wird automatisch bei `pnpm run build` ausgeführt.

### RSS-Feed

Der RSS-Feed wird automatisch bei jedem `pnpm run build` generiert. Für den Music Blog relevante Einträge:
- **Mixes:** Die neuesten 10 Mixes werden aus `blog-posts.json` gelesen

---

## Neuen Mix hinzufügen (Schritt-für-Schritt)

### Schritt 1: Tracklist vorbereiten

1. Exportiere die Tracklist aus Rekordbox als Textdatei
2. Dateiname muss die Mix-Nummer enthalten: `DJ Hulk - Mix{nummer}-{beschreibung}-tracklist.txt`
3. Kopiere nach `src/data/tracklists/`

Beispiel:
```bash
cp "C:\Users\...\rekordbox\Recording\DJ Hulk\Mix 176\DJ Hulk - Mix176-LatinHouse-tracklist.txt" src/data/tracklists/
```

### Schritt 2: Hero-Image vorbereiten (optional)

1. Exportiere das Bild aus Mixcloud als PNG
2. Konvertiere zu WebP: `node scripts/create-webp.mjs`
3. Oder manuell nach `public/tracklists/` kopieren:
```bash
cp "C:\Users\...\Mixcloud Post Mix176.png" public/tracklists/
```

### Schritt 3: Build ausführen

```bash
pnpm run build
```

**Was passiert automatisch:**
1. Script holt neueste Mixes von Mixcloud API
2. Tracklists werden zugeordnet
3. Hero-Images werden zugeordnet
4. `blog-posts.json` wird aktualisiert
5. **Neue Seite `/dj/mixes/{nummer}.html` wird generiert**
6. RSS-Feed wird aktualisiert
7. Karussell auf `/dj/mixes` zeigt neuen Mix

### Schritt 4: Überprüfen

- Öffne `http://localhost:4321/dj/mixes/{nummer}` (im Dev-Modus)
- Prüfe ob Tracklist korrekt angezeigt wird
- Prüfe ob Bild geladen wird
- Verifiziere JSON-LD in den Page Source

---

## SEO-Optimierung

Jede Mix-Seite erhält automatisch:

**Title:** `Mix#176 - Latin House / Tech House by DJ Hulk | DJ Hulk`

**Description:** Erste 160 Zeichen der Mix-Beschreibung

**JSON-LD (Structured Data):**
- `AudioObject` - Mix-Details (Titel, Beschreibung, Dauer, Datum)
- `BreadcrumbList` - Navigation
- `Person` - DJ Hulk als Produzent

**Canonical URL:** `https://holger-kampffmeyer.de/dj/mixes/{nummer}`

---

## Seiten-Struktur

### /dj/mixes (Übersicht)
- Neuester Mix (vollständig mit Player + Tracklist)
- Filter-Kategorien (Gym, Drive, Work, Party)
- Karussell mit allen Mixes (verlinkt auf einzelne Seiten)
- Buttons zu Archive und vollständiger Mixcloud-Bibliothek
- Spotify Playlist

### /dj/mixes/{nummer} (Einzelne Mix-Seite)
- Titel + Datum (orange Badge) + "Latest" Badge (wenn neuester)
- Genre Tags
- Use-Case Icons (Gym, Drive, Work, Party)
- Mixcloud Player
- Tracklist-Tabelle (Artist | Title)
- Prev/Next Navigation zwischen Mixes
- Vollständige SEO-Optimierung

### /dj/mixes-blog-archive (Archiv)
- Kompakte Listenansicht
- Filter nach Use-Case
- Titel, Datum, Tags pro Eintrag
- Link zur einzelnen Mix-Seite

---

## Troubleshooting

- **Keine Tracklist gefunden**: Prüfe ob Dateiname "Mix{nummer}" enthält und "tracklist" im Namen ist
- **Kein Hero-Image**: Prüfe ob WebP-Datei in `public/tracklists/` existiert
- **Falsche Use-Cases**: Tag nicht im Mapping → ergänze in `src/data/genre-use-case-mapping.json`
- **Seite nicht generiert**: Prüfe ob `hasTracklist: true` in blog-posts.json