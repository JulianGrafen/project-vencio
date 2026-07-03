# PraxisTermin Landing (GitHub Pages)

Statische B2B-Landingpage für **PraxisTermin** — deploybar auf GitHub Pages ohne Next.js-Stack.

## Lokal entwickeln

```bash
# Im Repo-Root
yarn install
yarn workspace @calcom/praxistermin-landing dev
```

Öffnet Vite Dev Server (Standard: http://localhost:5173).

## Build

```bash
yarn workspace @calcom/praxistermin-landing build
```

Artefakt: `apps/praxistermin-landing/dist/`

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `VITE_BASE_PATH` | Pfad-Präfix für GitHub Pages (z. B. `/mein-fork/`). Default: `/` |
| `VITE_APP_URL` | URL der Live-App für Login/CTA-Links (z. B. `https://app.example.com`) |

Beispiel:

```bash
VITE_BASE_PATH=/cal.com/ VITE_APP_URL=https://app.praxistermin.de yarn workspace @calcom/praxistermin-landing build
```

Ohne `VITE_APP_URL` verweisen CTAs auf `#preise` (sinnvoll für reine Marketing-Preview).

## GitHub Pages Deployment

Workflow: [`.github/workflows/deploy-praxistermin-landing.yml`](../../.github/workflows/deploy-praxistermin-landing.yml)

**Einmalig im GitHub-Repo:**

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions
2. Optional: **Custom domain** eintragen
3. Secret oder Variable `VITE_APP_URL` setzen (Repository → Settings → Secrets and variables → Actions → Variables)

Nach Push auf `master`/`main` (oder manuell via *workflow_dispatch*) wird die Seite veröffentlicht.

**URL (Project Pages):** `https://<owner>.github.io/<repo>/`

**URL (User/Org Pages, Repo `*.github.io`):** `https://<owner>.github.io/`

## Inhalt synchron halten

Marketing-Texte liegen in `src/content.ts` — bei Änderungen an der Next.js-Version unter `apps/web/modules/marketing/dental/landing-content.ts` beide Dateien abgleichen.
