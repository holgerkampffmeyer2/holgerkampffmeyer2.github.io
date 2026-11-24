# Design

## Context

Die Suche trennt textliche Token bereits von Jahresangaben: `getTextTokens()` entfernt `19xx/20xx`, und die Label-Auswahl prüft `entry.search.years`. Für die Mixzeilen fehlt jedoch das Datum im Suchmodell: `SearchableMix` kennt kein `created_time`, und `filterMixesForSearch()` gibt bei reinen Jahresabfragen oder Labelnamen-Treffern alle Mixes zurück. Siehe proposal.md für die Motivation.

## Goals / Non-Goals

**Goals:**

- Jahr und Text bleiben getrennte Signale, werden aber auf Mix-Ebene kombiniert angewendet.
- Reine Jahresabfragen, Jahr+Text und mehrere Jahre liefern nachvollziehbare Mixmengen.
- Bestehende Label-Ebene, URL-State, Sortierung und Pagination bleiben unverändert.

**Non-Goals:**

- Keine fuzzy Jahressuche.
- Keine Änderung an `buildLabelEntries()` oder an der Registry.
- Kein Refactor der Renderer; das läuft im eigenen Change.

## Decisions

- **Year-Tokens bleiben separat.** `getYearTokens()` erkennt `^(19|20)\d{2}$`; dieselben Tokens werden nicht in die Fuzzy-Ähnlichkeit aufgenommen. Alternative: Jahr als Text tokenisieren — verworfen, weil Teiljahre wie `202` sonst fälschlich fuzzy matchen.
- **Mix-Jahr aus ISO-Datum.** `created_time` wird als Quelle genommen und der vierstellige Jahresanteil per Prefix gelesen. Alternative: `Date` parsen — verworfen wegen Zeitzonen- und Formatabhängigkeit.
- **Ein Mix passt bei `some`, das Label weiterhin bei `every`.** Ein Mix hat genau ein Jahr; mehrere angegebene Jahre sollen alle passenden Mixe zeigen. Auf Label-Ebene bleibt die strengere Regel bestehen, damit ein Label nur bei Abdeckung aller Jahre gilt.
- **Year-Guard auf beiden Pfaden.** Sowohl der Early Return bei Labelnamen-Treffern als auch der finale `.filter()` für Texttreffer prüfen das Jahr. Alternative: nur final filtern — verworfen, weil der Early Return sonst alle Mixes ungefiltert durchlässt.

## Risks / Trade-offs

- [Mehrere Jahre sind semantisch mehrdeutig] → `some`-Regel explizit in Spec und Tests festschreiben.
- [Mix-Datum uneindeutig] → Nur `YYYY` aus `created_time` lesen, kein Datumsobjekt erzeugen.
- [Regressionsgefahr bei Labelnamen-Treffern] → Test mit `Toolroom Records` plus Jahr ergänzen.

## Migration Plan

Keine Migration nötig. Der Change ist statisch ausbaubar und wird über Unit-Tests und anschließenden Smoke-Test abgesichert.
