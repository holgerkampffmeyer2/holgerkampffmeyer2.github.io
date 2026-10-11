# Spec Delta

## Purpose

Die Label-Recherche-Pipeline erzeugt aus vorhandenen Datenquellen (Rekordbox-CUEs mit
Quelldatei-Tags zuerst, iTunes-Search online als Fallback) belegte Label-Vorschläge für die
Tracklisten in `blog-posts.json` und stellt sie als reviewbares Artefakt bereit.

## ADDED Requirements

### Requirement: Konfigurierbarer CUE-Pfad

Das Werkzeug SHALL das zu durchsuchende Verzeichnis mit den CUE-Dateien über ein
CLI-Flag oder eine Umgebungsvariable konfigurierbar machen und MUST keinen maschinenspezifischen
Pfad hart kodieren.

#### Scenario: Pfad per CLI übergeben
- **WHEN** das Recherche-Werkzeug mit einem gültigen `--cue-dir`-Wert aufgerufen wird
- **THEN** werden die CUE-Dateien aus diesem Verzeichnis gelesen

#### Scenario: Fehlendes Verzeichnis
- **WHEN** das angegebene Verzeichnis nicht existiert
- **THEN** bricht das Werkzeug mit einer verständlichen Fehlermeldung ab, ohne die Registry zu verändern

### Requirement: Offline-Label-Extraktion aus CUE-Quelldateien

Das Werkzeug SHALL alle CUE-Dateien im konfigurierten Verzeichnis parsen, je Track
`PERFORMER`/`TITLE` und den referenzierten Quelldatei-Pfad ermitteln und für die
Quelldatei vorhandene Label-Hinweise auslesen. Als Quellen gelten in dieser Reihenfolge:
das `publisher`-Tag, ein `[Label]`-Muster im Album-Titel und Promo-`comment`-Muster der Form
„on behalf of &lt;Label&gt;". Nicht-Musik-Einträge (z. B. Jingles) MUST ignoriert werden.

#### Scenario: Label aus publisher-Tag
- **WHEN** die Quelldatei ein `publisher`-Tag enthält
- **THEN** ist der `publisher`-Wert der Label-Kandidat

#### Scenario: Label aus Album-Klammer
- **WHEN** nur der Album-Titel ein `[Label]`-Muster enthält
- **THEN** wird der geklammerte Wert als Label-Kandidat verwendet

#### Scenario: Jingle wird übersprungen
- **WHEN** ein CUE-Eintrag eine Jingle-/Zwischenansage-Datei referenziert
- **THEN** wird dafür kein Label-Vorschlag erzeugt

### Requirement: Online-Label-Recherche über MusicBrainz

Für Tracks ohne Offline-Label SHALL das Werkzeug die MusicBrainz-Webservice-API abfragen:
zuerst die Aufnahme über `/ws/2/recording` suchen, dann über die zugehörige Release-ID die
Label-Angaben mit `/ws/2/release/<id>?inc=labels` lesen und den ersten Label-Namen als
Vorschlag verwenden. Die Abfrage MUST rate-limitiert (max. ~1 Request/Sekunde) ausgeführt
werden, eine aussagekräftige User-Agent-Kennung senden und Ergebnisse cachen.

#### Scenario: MusicBrainz liefert ein Label
- **WHEN** die Aufnahme-Suche ein Release und dessen `label-info` einen Label-Namen liefert
- **THEN** wird dieser Wert als Online-Vorschlag übernommen

#### Scenario: Kein Release oder Label
- **WHEN** die Aufnahme-Suche kein Release oder `label-info` keinen Namen liefert
- **THEN** bleibt der Track ohne Vorschlag (kein Fehler)

### Requirement: Robuster Track-Abgleich

Das Werkzeug SHALL Track-Strings aus `blog-posts.json` gegen den CUE-Pool über
Artist und Titel tolerant abgleichen, inklusive Klammer-Qualifier (Extended/Original/Remix),
Remix-Hinweisen und vertauschter `Titel - Artist`-Reihenfolge. Der veröffentlichte
Track-String aus `blog-posts.json` MUST der Schlüssel des Vorschlags bleiben.

#### Scenario: Abgleich trotz Mix-Qualifier
- **WHEN** der Tracklist-Eintrag `(Original Mix)` enthält, der CUE-Titel aber `(Original)`
- **THEN** werden die Einträge als derselbe Track erkannt

#### Scenario: Abgleich bei vertauschter Reihenfolge
- **WHEN** der Tracklist-Eintrag `Titel - Artist` statt `Artist - Titel` verwendet
- **THEN** wird der Track dennoch dem passenden CUE-Eintrag zugeordnet

### Requirement: Reviewbares Vorschlags-Artefakt

Das Werkzeug SHALL die Ergebnisse als `label-research.json` mit je Track `{ track, label,
source, confidence, matchedFile }` sowie einen Statistik-Report schreiben und MUST
`src/data/labels.json` dabei nicht verändern.

#### Scenario: Lauf erzeugt Vorschläge ohne Registry-Änderung
- **WHEN** das Recherche-Werkzeug erfolgreich läuft
- **THEN** entsteht `label-research.json` und `src/data/labels.json` bleibt unverändert

#### Scenario: Statistik im Report
- **WHEN** der Lauf abgeschlossen ist
- **THEN** weist der Report die Anzahl offline gefundener, online gefundener und offener Tracks aus

### Requirement: Expliziter Merge in die Registry

Das Werkzeug SHALL einen separaten Apply-Schritt bereitstellen, der reviewte Vorschläge in
`src/data/labels.json` merged, Label-IDs vergibt und die Registry anschließend gegen die
Konsistenz-Validierung prüft. Ohne diesen Schritt MUST die Registry unverändert bleiben.

#### Scenario: Apply merged Vorschläge
- **WHEN** der Apply-Schritt mit einem Vorschlags-Artefakt ausgeführt wird
- **THEN** werden die Labels und Track-Zuordnungen in `src/data/labels.json` ergänzt und die Validierung läuft

#### Scenario: Validierung schlägt fehl
- **WHEN** die Validierung nach dem Merge Probleme meldet
- **THEN** gibt der Apply-Schritt diese Probleme aus, statt sie stillschweigend zu übernehmen
