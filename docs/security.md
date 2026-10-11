# Sicherheit & Dependabot

## Alerts aktualisieren

Aktuell **0 offene Alerts** (Stand 2026-10-11); die 60 bisherigen Alerts sind als
`fixed` geschlossen — alle betrafen **transitive** Dependencies, keines unserer
direkten Packages.

```bash
pnpm update          # innerhalb der deklarierten semver-Bereiche
gh api repos/:owner/:repo/dependabot/alerts --paginate -q '[.[] | select(.state=="open")] | length'
```

Dependabot erstellt für transitive Dependencies **kein PR**, wenn der Parent
kein Update bekommt. `pnpm update` im Lockfile muss trotzdem gepusht werden,
sonst wertet GitHub die Alerts nicht neu aus und sie bleiben offen.

## Akzeptiertes Restrisiko: http-cache-semantics (HIGH)

**GHSA-ch52-4w7c-c8xp** — `http-cache-semantics`, transitiv über `astro@7.x`.

> **Status (2026-10-11):** GitHub führt den Alert als **`fixed`** (nach dem
> pnpm-12-Lockfile-Update selbst geschlossen), obwohl `pnpm-lock.yaml` weiterhin
> **4.2.0** auflöst. Die Reachability-Analyse unten bleibt daher gültig; eine
> künftige Neuauflösung könnte den Alert erneut öffnen.

| | |
|---|---|
| Betroffen | `<= 4.2.0` |
| Fix auf npm | 4.3.0 |
| In astros Bereich | ja (`^4.2.0`) |
| Im Lock aufgelöst | 4.2.0 |
| Von uns genutzt | **nein** |

### Bewertung (Reachability)

1. **Dependabot kann es nicht fixen.** Die Advisory hat keinen `patched`-Eintrag,
   daher entsteht kein PR. `pnpm update` springt ebenfalls nicht nach, weil 4.2.0
   den Bereich `^4.2.0` bereits erfüllt.
2. **Der Codepfad wird nie ausgeführt.** Das Paket wird ausschließlich in
   `astro/dist/assets/build/remote.js` in `loadRemoteImage` verwendet — Astros
   Build-Zeit-Loader für **externe** Bilder, der die Cache-TTL berechnet.
   Wir verwenden keine Remote-Images: 0 `<Image>`/`<Picture>` mit externer URL
   und keine `image.remotePatterns`/`domains` in `astro.config.mjs`.
3. **Die Auswirkung greift nicht.** Der Advisory betrifft `max-stale` in einem
   geteilten HTTP-Proxy-Cache ("cross-user cached responses"). Hier handelt es
   um einen In-Process-Cache in einem einzelnen Build-Prozess.

### Revisitieren, wenn

- `astro.config.mjs` ein `image.remotePatterns` oder `image.domains` bekommt, oder
- eine externe Bildquelle in `<Image>`/`<Picture>` verwendet wird.

Dann `overrides` in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) — **nicht** in `package.json`:

```yaml
overrides:
  http-cache-semantics: ">=4.3.0"
```

## Overrides richtig setzen

Overrides stehen in `pnpm-workspace.yaml` unter `overrides:`. Die untere Grenze
einer Range **muss die gepatchte Version sein**, nicht die verwundbare.

| Eintrag | Patch-Fuss | korrekt |
|---|---|---|
| `brace-expansion: ">=5.0.12"` | 5.0.12 (GHSA-q2hr-2g5m-vwhr) | ja |
| `fast-uri: ">=4.1.5"` | 4.1.5 (GHSA-jvvf-x445-j334) | ja |
| `yaml: "2.8.4"` | 2.8.3 (GHSA-48c2-rrv3-qjmp) | ja, exakter Pin |
| `nanoid@3: "3.3.18"` | exakter Pin auf gepatchte 3.x | ja, exakter Pin |

`">=5.0.9"` hätte 5.0.9–5.0.11 weiterhin erlaubt, `">=4.1.3"` hätte 4.1.3–4.1.4
erlaubt — beide vollständig verwundbar. Ein `>=` vom verwundbaren Fuß aus sieht
abgesichert aus, garantiert den Fix aber nicht.

Zusätzlich steht in `pnpm-workspace.yaml` `allowBuilds: esbuild: true` — **kein**
Override, sondern die Freigabe des esbuild-Postinstall-Skripts (von `vite`
benötigt). Bei einem Astro-/Vite-Major-Wechsel prüfen, ob es weiterhin nötig ist.

Für transitive Alerts gilt zusätzlich: Dependabot erstellt **kein** PR, wenn der
Parent kein Update bekommt. Ein Override wirkt erst, wenn das Lockfile neu
aufgelöst **und gepusht** ist.


## Smoke-Test

`scripts/smoke-dist.mjs` läuft in `deploy.yml` nach `build:seo` und prüft das
Artefakt, nicht nur den Build-Erfolg: Schlüssel-Dateien und -Seiten vorhanden und
nicht leer, `<title>` und `lang`-Attribut in allen geprüften HTML-Seiten, RSS mit
`<item>`, `urllist.txt` mit URLs.