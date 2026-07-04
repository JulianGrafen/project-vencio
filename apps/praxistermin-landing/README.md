# PraxisTermin Landing (GitHub Pages)

Statische B2B-Landingpage für **PraxisTermin** — deploybar auf GitHub Pages ohne Next.js-Stack.

## Go live (GitHub Pages)

1. **Repo → Settings → Pages → Build and deployment → Source:** `GitHub Actions`
2. **Actions → Variables** (optional aber empfohlen):
   - `VITE_APP_URL` — Live-App für Login/CTA (z. B. `https://app.praxistermin.de`)
   - `PAGES_CUSTOM_DOMAIN` — eigene Domain (z. B. `www.praxistermin.de`)
3. **Merge nach `master`/`main`** oder manuell: **Actions → Deploy PraxisTermin landing → Run workflow**
4. Nach dem Deploy: URL steht im Workflow-Summary

**Project Pages:** `https://<owner>.github.io/<repo>/`  
**User/Org Pages** (Repo `*.github.io`): `https://<owner>.github.io/`

## Lokal entwickeln

```bash
yarn install
yarn landing:dev
# oder
yarn workspace @calcom/praxistermin-landing dev
```

Öffnet Vite Dev Server (Standard: http://localhost:5173).

## Build

```bash
yarn landing:build
```

Artefakt: `apps/praxistermin-landing/dist/` (inkl. `404.html`, `.nojekyll`, optional `CNAME` + `sitemap.xml`)

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `VITE_BASE_PATH` | Pfad-Präfix für GitHub Pages (z. B. `/mein-fork/`). Default: `/` |
| `VITE_APP_URL` | URL der Live-App für Login/CTA-Links |
| `VITE_SITE_URL` | Kanonische Site-URL für `sitemap.xml` (CI setzt automatisch) |
| `PAGES_CUSTOM_DOMAIN` | Schreibt `CNAME` ins Build-Artefakt |

Beispiel:

```bash
VITE_BASE_PATH=/cal.com/ VITE_APP_URL=https://app.praxistermin.de yarn landing:build
```

Ohne `VITE_APP_URL` verweisen CTAs auf `#preise` (Marketing-Preview).

## GitHub Actions

Workflow: [`.github/workflows/deploy-praxistermin-landing.yml`](../../.github/workflows/deploy-praxistermin-landing.yml)

- **Push auf `main`/`master`** (nur bei Änderungen an Landing-Dateien) → Build + Deploy
- **Pull Request** → Build-Validierung (kein Deploy)
- **workflow_dispatch** → manuelles Deploy

## Inhalt synchron halten

Marketing-Texte in `src/content.ts` — bei Änderungen an der Next.js-Version unter `apps/web/modules/marketing/dental/landing-content.ts` beide Dateien abgleichen.
