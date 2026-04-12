# Music Blog - Script Dokumentation

## Script: `scripts/fetch-mixcloud-blog.mjs`

Dieses Script holt die neuesten 10 Mixes von Mixcloud und erstellt die `blog-posts.json` Daten für den Music Blog.

### Genre → Use-Case Mapping

| Genre (Mixcloud Tags) | Use Case |
|----------------------|----------|
| Drum & Bass, DnB, Jungle, Raptor, Ragga, Liquid, Dark, Atmospheric | 🏋️ **Gym Session** |
| Deep, Soulful, Funky, Organic, Club House | 🚗 **Drive / Relax** |
| Tech House, Minimal Tech House, Deep Tech, Minimal, Progressive, Techno, House | 💻 **Focus / Work** |
| Latin House, Tribal House, Afro House, Latin, Tribal, Afro, Bass House, Ghetto House, G-House, Party | 🎉 **Pre-Party** |

### Workflow

1. **API Call**: Holt 10 neueste Mixes von `https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=10`
2. **Mix-Details**: Für jeden Mix wird die API mit `?metadata=1` aufgerufen für die vollständige Beschreibung
3. **Tracklist**: Sucht in `src/data/tracklists/` nach Dateien mit Pattern `*Mix{nummer}*tracklist*.txt`
4. **Hero-Image**: Sucht in `public/tracklists/` nach `*Mix{nummer}*.webp`
5. **Use-Cases**: Leitet aus Mixcloud-Tags ab (kann mehrere pro Mix sein)

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

### Neuen Blog-Post hinzufügen

1. **Tracklist** nach `src/data/tracklists/` kopieren:
   ```bash
   cp "C:\Users\...\rekordbox\Recording\DJ Hulk\Mix 175\DJ Hulk - Mix175-xxx-tracklist.txt" src/data/tracklists/
   ```

2. **Hero-Image** (PNG) nach `public/tracklists/` kopieren und zu WebP konvertieren:
   ```bash
   cp "C:\Users\...\rekordbox\Recording\DJ Hulk\Mix 175\Mixcloud Post Mix175.png" public/tracklists/
   node scripts/create-webp.mjs
   ```

3. **Script ausführen** (oder einfach `pnpm run build`)

### Troubleshooting

- **Keine Tracklist gefunden**: Prüfe ob Dateiname "Mix{nummer}" enthält und "tracklist" im Namen ist
- **Kein Hero-Image**: Prüfe ob WebP-Datei in `public/tracklists/` existiert
- **Falsche Use-Cases**: Tag nicht im Mapping → ergänze in `TAG_TO_USECASE` Objekt im Script