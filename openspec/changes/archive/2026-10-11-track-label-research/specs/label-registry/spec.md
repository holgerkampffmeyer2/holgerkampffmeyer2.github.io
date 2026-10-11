# Spec Delta

## Purpose

Die Label-Registry verknüpft Tracklisten-Einträge optional mit ihrem Record-Label
(Name und Website) über eine stabile, eindeutige Label-ID, ohne das `tracklist`-Datenmodell
(`string[]`) zu verändern.

## ADDED Requirements

### Requirement: ID-basierte Label-Registry

Das System SHALL eine Sidecar-Registry in `src/data/labels.json` bereitstellen mit
`labels` (Zuordnung Label-ID → `{ name, url }`) und `tracks` (Zuordnung Track-String →
Label-ID). Die Label-ID MUST ein eindeutiger, stabiler Schlüssel sein (Slug oder Nummer),
sodass Tracks Labels über die ID und nicht über den Anzeigenamen referenzieren.

#### Scenario: Track referenziert Label über die ID
- **WHEN** `tracks["Basement Jaxx - Fly Life"] = "defected"` und
  `labels["defected"] = { name: "Defected", url: "https://defected.com" }` gesetzt sind
- **THEN** liefert die Auflösung für diesen Track `{ id: "defected", name: "Defected", url: "https://defected.com" }`

#### Scenario: Umbenennen des Anzeigenamens
- **WHEN** ausschließlich `labels["defected"].name` geändert wird
- **THEN** bleibt die Zuordnung aller Tracks zu diesem Label unverändert gültig

### Requirement: Track-Abgleich und Auflösung

Das System SHALL Track-Strings case-insensitiv, ohne führende/abschließende Leerzeichen
und ohne ein abschließendes Komma mit der Registry abgleichen. Ein Track ohne registriertes
Label MUST als „kein Label" aufgelöst werden; ein Track, der auf eine nicht existierende
Label-ID verweist, MUST ebenfalls als „kein Label" gelöst werden.

#### Scenario: Normalisierter Abgleich
- **WHEN** `tracks["Mark Knight - Man With The Red Face,"]` registriert ist
- **THEN** löst `"mark knight - man with the red face"` dasselbe Label auf

#### Scenario: Unbekannter Track
- **WHEN** ein Track-String in keiner `tracks`-Zuordnung vorkommt
- **THEN** wird kein Label ausgegeben

#### Scenario: Verwaiste Label-ID
- **WHEN** ein Track auf eine Label-ID verweist, die in `labels` fehlt
- **THEN** wird kein Label ausgegeben (kein Build-Fehler)

### Requirement: Konsistenz-Validierung

Das System SHALL eine Validierung bereitstellen, die eine Registry auf fehlende
Label-Namen, Nicht-http(s)-URLs sowie Tracks mit fehlender oder unbekannter Label-ID prüft
und die gefundenen Probleme als Liste zurückgibt.

#### Scenario: Inkonsistente Registry melden
- **WHEN** ein Track auf eine unbekannte Label-ID verweist
- **THEN** enthält die Validierungsliste einen Hinweis auf die unbekannte ID

#### Scenario: Konsistente Registry
- **WHEN** alle Referenzen auflösbar sind, alle Labels einen Namen und gültige URLs haben
- **THEN** ist die Validierungsliste leer

### Requirement: Bedingte Label-Spalte in der Tracklist-Tabelle

Die Tracklist-Tabelle SHALL eine Label-Spalte nur dann rendern, wenn mindestens ein Track
des jeweiligen Mixes ein aufgelöstes Label hat. Ein Label mit URL MUST als Link
(neues Fenster, `rel="noopener noreferrer nofollow"`) gerendert werden; ein Label ohne URL
als reiner Text; Tracks ohne Label MUST als Platzhalter dargestellt werden.

#### Scenario: Kein Track hat ein Label
- **WHEN** für keinen Track des Mixes ein Label registriert ist
- **THEN** bleibt die Tabelle zweispaltig (Artist, Title)

#### Scenario: Teilweise befüllter Mix
- **WHEN** mindestens ein Track ein Label hat, andere aber nicht
- **THEN** erscheint die Label-Spalte, befüllte Zellen zeigen Label (ggf. als Link), leere Zellen den Platzhalter
