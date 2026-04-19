# Git-Workflow

## Standard-Commit (Quellcode)
```bash
pnpm run lint && pnpm run check && pnpm run build
git add .
git commit -m "describe changes"
git push origin main
```

## Feature-Branch
```bash
git checkout -b mix-177
# ... work ...
git rebase origin/main
git push origin mix-177
# merge via PR oder manual
```

## Rein .md Änderungen
```bash
git add .
git commit -m "update docs"
git push origin main
# kein lint/check/build nötig
```

## Tags
```bash
git tag -a v.x.x.x -m "version message"
git push && git push origin --tags
```