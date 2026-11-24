# Spec Delta

## MODIFIED Requirements

### Requirement: Suche, Filter, Sortierung und Pagination

Das System SHALL eine clientseitige Suche über Labelnamen, Artists, Tracktitel, Mixnamen und Datum bereitstellen. Die Datumssuche SHALL auch die angezeigten Mixes einer Trefferzeile auf das angegebene Jahr begrenzen. Es MUST einen Filter `≥3 Tracks`, sortierbare Spalten für Name, Tracks, Mixes und Letzter Mix sowie eine Pagination mit 25 oder 50 Zeilen geben. Der Zustand MUST in der URL-Query abgebildet werden.

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
- **THEN** zeigt der Expandierinhalt einer Trefferzeile nur Mixes aus diesem Jahr

#### Scenario: Jahr in Kombination mit Text
- **WHEN** ein Jahr und ein Textbegriff eingegeben werden
- **THEN** werden nur Mixes angezeigt, die zum angegebenen Jahr passen und den Textbegriff in Mixname, Label-Anzeige oder Tracktext enthalten

#### Scenario: Sortierung und Pagination
- **WHEN** eine Spalte sortiert und anschließend die Seite gewechselt wird
- **THEN** bleiben Sortierung, Richtung, Suchbegriff und Filter in der URL erhalten und die Ergebnisliste ist entsprechend sortiert

#### Scenario: Filterwechsel setzt Seite zurück
- **WHEN** ein Filter oder die Suche nach dem Blättern geändert wird
- **THEN** wird die Anzeige auf Seite 1 zurückgesetzt
