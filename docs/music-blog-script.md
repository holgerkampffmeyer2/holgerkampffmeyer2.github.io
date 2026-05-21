# Mixes with Tracklists - Dokumentation

## Übersicht

Die "Mixes with Tracklists" Seite präsentiert wöchentliche DJ-Mixes von DJ Hulk mit vollständigen Tracklists.

**Seitenstruktur:**
- `/dj/mixes` - Übersichtsseite mit neuestem Mix, Karussell und Filter nach Stimmung
- `/dj/mixes/{nummer}` - Einzelne Mix-Seite mit Player und Tracklist (z.B. `/dj/mixes/176`)
- `/dj/mixes-blog-archive` - Komprimierte Archiv-Ansicht aller Mixes

## Script: `scripts/fetch-mixcloud.mjs`

Dieses Script holt die neuesten 100 Mixes von Mixcloud und erstellt beide Daten-Dateien:
- `mixcloud-data.json` - Einfache Liste für `/dj/mixes-all`
- `blog-posts.json` - Vollständige Daten mit Tracklists für Music Blog

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

1. **API Call**: Holt 100 neueste Mixes von Mixcloud API
2. **Mix-Details**: Für jeden Mix wird die API mit `?metadata=1` aufgerufen für vollständige Beschreibung
3. **Tracklist**: Sucht in `tracklists/` nach Dateien mit Suffix `-tracklist.txt`
4. **Hero-Image**: Sucht in `public/tracklists/` nach `.webp` Dateien
5. **Zuordnung**: Tracklists und Hero-Images werden **sequenziell nach Veröffentlichungsdatum** zugeordnet
   - Neueste Tracklist → Neuester Mix
   - Zweite Tracklist → Zweiter neuester Mix
   - usw.
6. **Use-Cases**: Leitet aus Mixcloud-Tags ab (kann mehrere pro Mix sein)
7. **Output**: Schreibt beide JSON-Dateien

### Voraussetzungen

**Tracklists** können im `tracklists/` Ordner abgelegt werden (keine manuelle Kopie nötig):
- Dateiname enthält Mix-Nummer: `DJ Hulk - Mix175-TechHouse-tracklist.txt`
- Format: Textdatei mit Tracklist (Artist - Track)

**Hero-Images** müssen in `public/tracklists/` liegen:
- Format: WebP (wird aus PNG konvertiert)
- Dateiname enthält Mix-Nummer: `Mix175.webp`

### Manuell ausführen

```bash
node scripts/fetch-mixcloud.mjs --force
```

### Automatisch

- `pnpm run build:full` - Vollständiger Build inkl. Mixcloud (cached, 24h — für neuen Mix `--force` nötig, siehe Schritt 4)
- `pnpm run build` - Nur Astro Build (schnell, keine Datenfetch)

### RSS-Feed

Der RSS-Feed wird bei `pnpm run build:seo` oder `pnpm run build:full` generiert. Für den Music Blog relevante Einträge:
- **Mixes:** Die neuesten 10 Mixes werden aus `blog-posts.json` gelesen

---

## Neuen Mix hinzufügen

### Schritt 1: Dateien bereitstellen

User legt in `tracklists/` ab:
- `.txt`-Datei mit `Mix<nummer>` im Namen (Tracklist) - z.B. "Mein Mix 181 Tracklist.txt"
- `.png`/`.jpg`/`.jpeg`-Datei mit `Mix<nummer>` im Namen (Hero-Bild) - z.B. "Mix181-Cover.png"

Der Agent ermittelt `<nummer>` aus dem `Mix<nummer>`-Substring in der Datei.  
Die Schreibweise von Quelldateien ist flexibel — nur `Mix<nummer>` im Namen ist entscheidend.

### Schritt 2: Keine manuelle Kopie nötig

Das Script findet und ordnet Tracklist-Dateien automatisch zu:
- Es erkennt die Mix-Nummer aus dem Dateinamen
- Es passt die Tracklist automatisch dem entsprechenden Mix zu (basierend auf Veröffentlichungsdatum)
- Keine Kopie in `src/data/tracklists/` mehr notwendig

### Schritt 3: Bild konvertieren

Finde die Bild-Datei mit `Mix<nummer>`, konvertiere zu WebP (1200px Breite):

```bash
node scripts/create-webp.mjs -w 1200 "tracklists/<original>.png"
cp "tracklists/<original>.webp" "public/tracklists/Mix<nummer>.webp"
```

**Warum 1200px:** Das Hero-Bild wird auf der Mix-Detailseite bis zu 896px breit angezeigt (`max-w-4xl`)
mit 320px Höhe (`lg:h-80`). 1200px liefert ausreichend Auflösung für Retina-Displays, ohne überdimensioniert zu sein.

**Achtung:** WebP-Dateinamen dürfen KEINE Leerzeichen enthalten — das Script ersetzt Leerzeichen automatisch durch Bindestriche. Der finale Name in `public/tracklists/` sollte `Mix<nummer>.webp` sein.

### Schritt 4: JSON + Build

`build:full` hat einen 24h-Cache — für einen frischen Mix auf Mixcloud muss `--force` die API-Abfrage erzwingen:

```bash
node scripts/fetch-mixcloud.mjs --force && astro build && node scripts/generate-rss.mjs && node scripts/generate-urllist.mjs
```

**Was passiert dabei automatisch:**
1. `fetch-mixcloud.mjs` holt neueste Mixes von Mixcloud API (erzwungen via `--force`)
  2. Tracklist aus `tracklists/` wird zugeordnet (Regex auf `Mix<nummer>`)
3. Hero-Image aus `public/tracklists/` wird zugeordnet (Regex auf `Mix<nummer>`)
4. `blog-posts.json` + `mixcloud-data.json` werden aktualisiert
5. Astro baut die neue Seite `/dj/mixes/<nummer>.html`
6. RSS-Feed + `urllist.txt` werden generiert

### Schritt 5: Überprüfen

- Öffne `http://localhost:4321/dj/mixes/<nummer>` (im Dev-Modus)
- Prüfe ob Tracklist korrekt angezeigt wird
- Prüfe ob Bild geladen wird
- Verifiziere JSON-LD in den Page Source

### Schritt 6: Commit + Push

---

## SEO-Optimierung

Jede Mix-Seite erhält automatisch:

**Title:** `Mix#176 - Latin House / Tech House by DJ Hulk | DJ Hulk`

**Description:** Erste 160 Zeichen der Mix-Beschreibung

**JSON-LD (Structured Data):**
- `AudioObject` - Mix-Details (Titel, Beschreibung, Dauer, Datum)
- `MusicGroup` - DJ Hulk als Musiker/Produzent
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