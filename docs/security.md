# Sicherheit & Dependabot

## Alerts aktualisieren

Alle 10 offenen Alerts (Stand 2026-10-04) fielen auf **transitive** Dependencies —
keines unserer direkten Packages war betroffen.

```bash
pnpm update          # innerhalb der deklarierten semver-Bereiche
gh api repos/:owner/:repo/dependabot/alerts --paginate
```

Dependabot erstellt für transitive Dependencies **kein PR**, wenn der Parent
kein Update bekommt. `pnpm update` im Lockfile muss trotzdem gepusht werden,
sonst wertet GitHub die Alerts nicht neu aus und sie bleiben offen.

## Akzeptierter Alert: http-cache-semantics (HIGH)

**GHSA-ch52-4w7c-c8xp** — `http-cache-semantics` 4.2.0, transitiv über `astro@7.x`.

| | |
|---|---|
| Betroffen | `<= 4.2.0` |
| Fix auf npm | 4.3.0 |
| In astros Bereich | ja (`^4.2.0`) |
| Von uns genutzt | **nein** |

### Warum nicht behoben

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

Dann `pnpm.overrides` in `package.json`:
`{ "pnpm": { "overrides": { "http-cache-semantics": "^4.3.0" } } }`

## Smoke-Test

`scripts/smoke-dist.mjs` läuft in `deploy.yml` nach `build:seo` und prüft das
Artefakt, nicht nur den Build-Erfolg: Schlüssel-Dateien und -Seiten vorhanden und
nicht leer, `<title>` und `lang`-Attribut in allen geprüften HTML-Seiten, RSS mit
`<item>`, `urllist.txt` mit URLs.