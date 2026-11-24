# Spec Delta

## Purpose

Die Label-Übersicht bündelt alle registrierten Labels und ihre Mixes an einer crawlbaren, durchsuchbaren Seite, damit Labels übergreifend recherchiert und bestehende Detailseiten auffindbar werden.

## ADDED Requirements

### Requirement: Zentrale Label-Übersicht mit allen Registry-Einträgen

Das System SHALL unter `/dj/labels` eine Übersicht bereitstellen, die jeden Eintrag aus `labels.labels` als eigene Zeile zeigt — auch Labels ohne zugeordnete Mixes. Jede Zeile MUST den Labelnamen, die Anzahl der Tracks, die Anzahl der Mixes und optional die externe Website ausweisen.

#### Scenario: Label ohne Mixes
- **WHEN** ein Registry-Eintrag wie `halogenix` in keiner Tracklist vorkommt
- **THEN** erscheint er mit `0 Tracks`, `0 Mixes` und ohne Expandierinhalt in der Übersicht

#### Scenario: Entferntes Label
- **WHEN** `knowledge-magazine` aus der Registry gelöscht wurde
- **THEN** erscheint `Knowledge Magazine` nicht mehr in der Übersicht

### Requirement: Aufklappbare Mixes pro Label

Das System SHALL die Mixes jeder Labelzeile in einem animierten Bereich anzeigen, der per Toggle geöffnet und geschlossen werden kann. Der Bereich MUST Mix-Titel, Datum und die zugehörigen Artist–Titel-Paare enthalten. Es darf nur eine Zeile gleichzeitig geöffnet sein.

#### Scenario: Toggle öffnet Mixes
- **WHEN** der Toggle einer Labelzeile aktiviert wird
- **THEN** werden die Mixes dieser Zeile mit der festgelegten Animation sichtbar und eine zuvor geöffnete Zeile geschlossen

#### Scenario: Scroll-Fokus öffnet Zeile
- **WHEN** eine Labelzeile in den Fokusbereich des Viewports gelangt
- **THEN** wird genau diese Zeile geöffnet, sofern kein anderer Fokus aktiv ist

#### Scenario: Tastaturfokus öffnet Zeile
- **WHEN** der Toggle oder ein Link einer Labelzeile per Tastatur fokussiert wird
- **THEN** wird die zugehörige Zeile geöffnet, ohne dass ein nachfolgendes Scrollen diese Auswahl sofort überschreibt

#### Scenario: Reduzierte Bewegung
- **WHEN** `prefers-reduced-motion: reduce` aktiv ist
- **THEN** erfolgt das Ein- und Ausblenden ohne Transition

### Requirement: Suche, Filter, Sortierung und Pagination

Das System SHALL eine clientseitige Suche über Labelnamen, Artists, Tracktitel, Mixnamen und Datum bereitstellen. Es MUST einen Filter `≥3 Tracks`, sortierbare Spalten für Name, Tracks, Mixes und Letzter Mix sowie eine Pagination mit 25 oder 50 Zeilen geben. Der Zustand MUST in der URL-Query abgebildet werden.

#### Scenario: Suche nach Artist
- **WHEN** ein Nutzer einen Artistnamen eingibt, der nur in einem Track eines Mixes vorkommt
- **THEN** werden genau die Labelzeilen angezeigt, deren Expandierinhalt oder Metadaten diesen Artist enthalten

#### Scenario: Tippfehler beim Labelnamen
- **WHEN** ein Labelname mit kleiner Tippabweichung eingegeben wird
- **THEN** findet die Suche das passende Label über normalisierte Token-Ähnlichkeit, sofern der Score über der festgelegten Schwelle liegt

#### Scenario: Datumssuche
- **WHEN** ein Jahr eingegeben wird
- **THEN** werden Labelzeilen gefunden, deren Mixes ein Datum in diesem Jahr haben; die Datumssuche ist nicht fuzzy

#### Scenario: Sortierung und Pagination
- **WHEN** eine Spalte sortiert und anschließend die Seite gewechselt wird
- **THEN** bleiben Sortierung, Richtung, Suchbegriff und Filter in der URL erhalten und die Ergebnisliste ist entsprechend sortiert

#### Scenario: Filterwechsel setzt Seite zurück
- **WHEN** ein Filter oder die Suche nach dem Blättern geändert wird
- **THEN** wird die Anzeige auf Seite 1 zurückgesetzt

### Requirement: Restriktionen für dünne Labels

Das System SHALL Labels mit weniger als `MIN_LABEL_TRACKS` Tracks in der Übersicht als reinen Text darstellen. Solche Labels MUST nicht als interner Link auf `/dj/labels/<slug>` gesetzt werden und dürfen kein JSON-LD-`@id` erhalten; externe Website-Links bleiben erlaubt.

#### Scenario: Dünnes Label in der Übersicht
- **WHEN** ein Label zwei Tracks hat
- **THEN** ist sein Name sichtbar, aber nicht mit seiner Detailseite verlinkt

#### Scenario: Indexierbares Label in der Übersicht
- **WHEN** ein Label mindestens drei Tracks hat
- **THEN** verweist sein Name auf die indexierbare Detailseite unter `/dj/labels/<slug>`

### Requirement: Auffindbarkeit und SEO-Metadaten der Übersicht

Das System SHALL die Übersicht im DJing-Bereich des Hauptmenü verlinken, im Desktop-Dropdown per Tastatur erreichbar machen und auf jeder Label-Detailseite einen Breadcrumb-Parent `Labels` sowie einen Rücklink zur Übersicht anbieten. Die Übersicht MUST einen eigenen Title, Description, kanonische URL und `CollectionPage`-, `BreadcrumbList`- und `ItemList`-JSON-LD besitzen.

#### Scenario: Navigation zur Übersicht
- **WHEN** ein Nutzer im Menü `DJing → Labels` aktiviert
- **THEN** wird `/dj/labels` geöffnet

#### Scenario: Tastaturzugriff auf das Dropdown
- **WHEN** der DJing-Menüpunkt per Tastatur fokussiert wird
- **THEN** öffnet sich das Dropdown und der Link `Labels` ist erreichbar

#### Scenario: Detailseite zur Übersicht
- **WHEN** eine Label-Detailseite geöffnet wird
- **THEN** enthält der Breadcrumb einen Link auf `/dj/labels` und die Seite verlinkt unten auf die Übersicht

#### Scenario: Gefilterte Ansicht
- **WHEN** die Übersicht mit Query-Parametern geöffnet wird
- **THEN** bleibt die kanonische URL `/dj/labels`
