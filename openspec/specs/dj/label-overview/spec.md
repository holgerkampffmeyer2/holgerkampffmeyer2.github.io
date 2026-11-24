# dj/label-overview Specification

## Purpose
Die Label-Übersicht bündelt alle registrierten Labels und ihre Mixes an einer crawlbaren, durchsuchbaren Seite, damit Labels übergreifend recherchiert und bestehende Detailseiten auffindbar werden.

## Requirements

### Requirement: Zentrale Label-Übersicht mit allen Registry-Einträgen

Das System SHALL unter `/dj/labels` eine Übersicht bereitstellen, die jeden Eintrag aus `labels.labels` als eigene Zeile zeigt — auch Labels ohne zugeordnete Mixes. Jede Zeile MUST den Labelnamen, die Anzahl der Tracks, die Anzahl der Mixes und optional die externe Website ausweisen.

#### Scenario: Label ohne Mixes
- **WHEN** ein Registry-Eintrag wie `halogenix` in keiner Tracklist vorkommt
- **THEN** erscheint er mit `0 Tracks`, `0 Mixes` und ohne Expandierinhalt in der Übersicht

#### Scenario: Entferntes Label
- **WHEN** `knowledge-magazine` aus der Registry gelöscht wurde
- **THEN** erscheint `Knowledge Magazine` nicht mehr in der Übersicht

### Requirement: Aufklappbare Mixes pro Label

Das System SHALL die Mixes jeder Labelzeile in einem animierten Bereich anzeigen, der per Toggle geöffnet und geschlossen werden kann. Der Bereich MUST Mix-Titel, Datum und die zugehörigen Artist–Titel-Paare enthalten. Ohne aktive Suche darf nur eine Zeile gleichzeitig geöffnet sein.

#### Scenario: Toggle öffnet Mixes
- **WHEN** der Toggle einer Labelzeile aktiviert wird
- **THEN** werden die Mixes dieser Zeile mit der festgelegten Animation sichtbar; ohne Suche wird eine zuvor geöffnete Zeile geschlossen, mit Suche wird nur diese Zeile umgeschaltet

#### Scenario: Scrollen verändert den Zustand nicht
- **WHEN** die Seite gescrollt oder die Fenstergröße geändert wird
- **THEN** bleibt die aktuell geöffnete Zeile unverändert und es wird keine Zeile automatisch geöffnet

#### Scenario: Tastaturfokus öffnet keine Zeile
- **WHEN** der Toggle oder ein Link einer Labelzeile per Tastatur fokussiert wird
- **THEN** bleibt die Zeile geschlossen, bis der Toggle per Enter oder Space aktiviert wird

#### Scenario: Reduzierte Bewegung
- **WHEN** `prefers-reduced-motion: reduce` aktiv ist
- **THEN** erfolgt das Ein- und Ausblenden ohne Transition

### Requirement: Trefferfilter und Markierung bei aktiver Suche

Das System SHALL bei aktiver Suche alle Trefferzeilen geöffnet darstellen und MUST jede Zeile einzeln zuklappbar lassen. Der Expandierinhalt SHALL nur die Mixes und Tracks zeigen, die den Suchbegriff enthalten, sofern der Treffer nicht im Labelnamen liegt; übereinstimmende Textstellen MUST visuell markiert werden.

#### Scenario: Treffer im Labelnamen
- **WHEN** der Suchbegriff im Labelnamen vorkommt
- **THEN** bleiben alle Mixes und Tracks dieser Zeile sichtbar und der Treffer wird im Labelnamen markiert

#### Scenario: Treffer nur in Mixes oder Tracks
- **WHEN** der Suchbegriff nicht im Labelnamen, aber in Mixes oder Tracks vorkommt
- **THEN** zeigt der Expandierinhalt nur die passenden Mixes und Tracks und markiert den Suchbegriff in diesen Texten

### Requirement: Suche, Filter, Sortierung und Pagination

Das System SHALL eine clientseitige Suche über Labelnamen, Artists, Tracktitel, Mixnamen und Datum bereitstellen. Es MUST einen Filter `≥3 Tracks`, sortierbare Spalten für Name, Tracks, Mixes und Letzter Mix sowie eine Pagination mit 25 oder 50 Zeilen geben. Der Zustand MUST in der URL-Query abgebildet werden.

#### Scenario: Suche nach Artist
- **WHEN** ein Nutzer einen Artistnamen eingibt, der nur in einem Track eines Mixes vorkommt
- **THEN** werden genau die Labelzeilen angezeigt, deren Expandierinhalt oder Metadaten diesen Artist enthalten
- **THEN** werden diese Trefferzeilen aufgeklappt, damit Artist und Track sofort sichtbar sind
- **THEN** zeigt der Expandierinhalt nur die Mixes und Tracks mit diesem Artist und markiert den Artist im Text

#### Scenario: Mehrwortsuche ohne echten Treffer
- **WHEN** zwei Suchbegriffe eingegeben werden, die nur verteilt auf verschiedene Labels vorkommen
- **THEN** wird keine Labelzeile angezeigt, in der nicht mindestens ein Begriff wirklich vorkommt

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

Das System SHALL die Übersicht im DJing-Bereich des Hauptmenü als `Record Labels` verlinken, im Desktop-Dropdown per Tastatur erreichbar machen und auf jeder Label-Detailseite einen Breadcrumb-Parent `Record Labels` sowie einen Rücklink zur Übersicht anbieten. Die Übersicht MUST einen eigenen Title, Description, kanonische URL und `CollectionPage`-, `BreadcrumbList`- und `ItemList`-JSON-LD besitzen.

#### Scenario: Navigation zur Übersicht
- **WHEN** ein Nutzer im Menü `DJing → Record Labels` aktiviert
- **THEN** wird `/dj/labels` geöffnet

#### Scenario: Tastaturzugriff auf das Dropdown
- **WHEN** der DJing-Menüpunkt per Tastatur fokussiert wird
- **THEN** öffnet sich das Dropdown und der Link `Record Labels` ist erreichbar

#### Scenario: Detailseite zur Übersicht
- **WHEN** eine Label-Detailseite geöffnet wird
- **THEN** enthält der Breadcrumb einen Link auf `/dj/labels` und die Seite verlinkt unten auf die Übersicht

#### Scenario: Gefilterte Ansicht
- **WHEN** die Übersicht mit Query-Parametern geöffnet wird
- **THEN** bleibt die kanonische URL `/dj/labels`

### Requirement: Carousel-Items der Label-Übersicht

Das System SHALL den `ItemList` nur mit indexierbaren Labels und Detailseiten-URLs ausgeben; dünne Labels bleiben sichtbar, werden aber nicht als Carousel-Item markiert.

#### Scenario: Carousel-JSON-LD
- **WHEN** die Übersicht `ItemList`-JSON-LD ausgibt
- **THEN** enthält sie ausschließlich minimale `ListItem`-Objekte mit Detailseiten-URL indexierbarer Labels
