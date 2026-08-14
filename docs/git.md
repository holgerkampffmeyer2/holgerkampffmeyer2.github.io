# Git-Workflow

## Conventional Commits
Präfixe: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`

## Standard-Commit (Quellcode)
```bash
pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo
git add .
git commit -m "feat: describe changes"
git push origin main
```

## Feature-Branch
```bash
git checkout -b feat/describe-feature
# ... work ...
git rebase origin/main
git push origin feat/describe-feature
# merge via PR
```

## Rein .md Änderungen
```bash
git add .
git commit -m "docs: update documentation"
git push origin main
# kein lint/check/build nötig
```

## Tags
```bash
git tag -a v.x.x.x -m "version message"
git push && git push origin --tags
```

## Vor dem Commit
- `git status` prüfen — nur beabsichtigte Dateien stagen
- Keine Secrets committen
- Keine offenen TODOs im finalen Code