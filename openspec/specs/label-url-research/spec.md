# label-url-research Specification

## Purpose
Recherchiert, prüft und übernimmt Label-Websites in die Registry `src/data/labels.json` —
als reviewbare Artefakte mit getrenntem Apply-Schritt, ohne Track-Zuordnungen anzufassen.

## Requirements

### Requirement: Konfigurierbare Artefakt-Pfade

Die URL-Werkzeuge SHALL ihre Ein-/Ausgabedateien (Registry, Vorschläge, Reports, Cache)
über CLI-Flags konfigurierbar machen, MUST dabei repo-relativ vorbelegt und MUST keine
maschinenspezifischen Pfade hart kodieren.

#### Scenario: Pfade per CLI übergeben
- **WHEN** ein URL-Werkzeug mit `--data`/`--out`-Werten aufgerufen wird
- **THEN** liest und schreibt es die Dateien an den angegebenen Pfaden

#### Scenario: Registry nicht vorhanden
- **WHEN** die Registry-Datei unter dem konfigurierten Pfad nicht existiert
- **THEN** bricht das Werkzeug mit verständlicher Fehlermeldung ab, ohne Dateien zu schreiben

### Requirement: URL-Recherche über MusicBrainz

Das Recherche-Werkzeug SHALL Labels ohne Website über die MusicBrainz-Label-Entity
suchen und die offizielle Homepage über URL-Relationen (`inc=url-rels`) ermitteln,
den erstplatzierten Vorschlag übernehmen und unbekannte Labels ohne Raten mit „kein
Vorschlag" quittieren. Die Abfrage MUST rate-limitiert (max. ~1 Request/Sekunde)
erfolgen, eine aussagekräftige User-Agent-Kennung senden und Ergebnisse cachen.

#### Scenario: MusicBrainz liefert eine Homepage
- **WHEN** die Label-Suche ein Label findet und dessen URL-Relationen eine offizielle Homepage enthalten
- **THEN** wird diese URL als Vorschlag mit Quelle „musicbrainz" ausgegeben

#### Scenario: Kein Treffer
- **WHEN** die Suche das Label nicht findet oder keine passende URL-Relation existiert
- **THEN** bleibt der Label ohne URL-Vorschlag (kein Abbruch, kein geratenes Ergebnis)

#### Scenario: Cache verhindert Wiederholungsabrufe
- **WHEN** dasselbe Label ein zweites Mal recherchiert wird
- **THEN** erfolgt kein erneuter Netzwerkzugriff für dieses Label

### Requirement: Optionales Domain-Pattern-Fallback

Für Labels ohne MusicBrainz-Treffer SHALL ein optionales Fallback-Werkzeug heuristische
Domain-Muster erzeugen und per HEAD-Request auf Erreichbarkeit prüfen; nur erreichbare
Domains werden als Vorschlag mit niedrigerer Konfidenz ausgegeben. Die im Report genannten
Quellen MUST exakt den tatsächlich abgefragten Quellen entsprechen.

#### Scenario: Erreichbare Pattern-Domain
- **WHEN** für ein Label eine generierte Kandidatendomain per HEAD mit 2xx/3xx antwortet
- **THEN** entsteht ein Vorschlag mit Confidence < 1 und Quelle „pattern"

#### Scenario: Report-Quellen sind wahrheitsgemäß
- **WHEN** das Fallback-Werkzeug einen Report schreibt
- **THEN** nennt es nur Quellen, die im Lauf auch wirklich abgefragt wurden

### Requirement: Reviewbares URL-Artefakt

Das Recherche-Werkzeug SHALL die Ergebnisse als JSON-Artefakt mit je Vorschlag
`{ name, url, via, confidence, source }` sowie einen Statistik-Report schreiben und
MUST `src/data/labels.json` dabei nicht verändern.

#### Scenario: Lauf erzeugt Vorschläge ohne Registry-Änderung
- **WHEN** das Recherche-Werkzeug erfolgreich läuft
- **THEN** entsteht das Vorschlags-Artefakt und `src/data/labels.json` bleibt unverändert

#### Scenario: Statistik im Report
- **WHEN** der Lauf abgeschlossen ist
- **THEN** weist der Report die Anzahl geprüfter Labels, Funde und offener Posten aus

### Requirement: HTML-Quality-Check

Das Prüf-Werkzeug SHALL geliefertes HTML von Markup bereinigen (Inhalte von `script`-
und `style`-Blöcken MUST entfernt werden, einschließlich schließender Tags mit optionalem
Whitespace) und den Seitentext gegen Musik-Keywords und negative Marker bewerten.
Ein negativer Treffer MUST jedes positive Ergebnis überschreiben; Seiten ohne
substanziellen Text MUST als dünne Seite eingestuft werden.

#### Scenario: Domain-Parking wird erkannt
- **WHEN** eine geprüfte Seite negative Marker (z. B. Domainverkauf) enthält
- **THEN** lautet das Verdikt „suspicious", unabhängig von Musik-Keywords

#### Scenario: Markenseite mit Musik-Inhalt
- **WHEN** die Seite mehrere Musik-Keywords und substanziellen Text enthält
- **THEN** lautet das Verdikt „likely-label"

#### Scenario: Script-Inhalte fließen nicht in die Bewertung
- **WHEN** der Text „record label" nur innerhalb eines `<script>`-Blocks vorkommt
- **THEN** erscheint dieser Treffer nicht in der Bewertung

### Requirement: URL-Only-Merge in die Registry

Das Apply-Werkzeug SHALL über einen separaten URL-Modus nur die `url`-Felder der
Registry aktualisieren: Vorschläge werden über normalisierte Label-Namen gematcht,
bereits gesetzte URLs MUST ohne `--overwrite` unverändert bleiben, Track-Zuordnungen
MUST sich nicht verändern. Anschließend läuft die Konsistenz-Validierung; bei Problemen
wird nichts geschrieben, solange `--force` fehlt.

#### Scenario: Merge ohne Track-Änderung
- **WHEN** der URL-Modus mit einem Vorschlags-Artefakt läuft
- **THEN** werden ausschließlich `url`-Werte in `labels` geschrieben, `tracks` bleibt bytegleich

#### Scenario: Bestehende URL bleibt ohne overwrite
- **WHEN** ein Label bereits eine URL besitzt und `--overwrite` nicht gesetzt ist
- **THEN** bleibt die bestehende URL unverändert (Statistik: übersprungen)

#### Scenario: Validierung verhindert Schreiben
- **WHEN** die Validierung nach dem Merge Probleme meldet und `--force` nicht gesetzt ist
- **THEN** gibt das Werkzeug die Probleme aus und verändert die Registry nicht
