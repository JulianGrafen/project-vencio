# Supabase ohne Yarn — SQL Editor Setup

Wenn du **kein Terminal** nutzen willst, kannst du das komplette Schema direkt in Supabase anlegen.

## Schritte (2 Minuten)

1. Öffne [Supabase Dashboard](https://supabase.com/dashboard) → dein Projekt
2. Links: **SQL Editor** → **New query**
3. Öffne im Repo die Datei:
   ```
   scripts/supabase/supabase-sql-editor-setup.sql
   ```
4. **Gesamten Inhalt kopieren** → in den SQL Editor einfügen → **Run**
5. Warten (~30–60 Sekunden)
6. Links: **Table Editor** → Tabellen wie `User`, `Booking`, `Team` sollten sichtbar sein

## Was die Datei macht

1. `pgcrypto` Extension aktivieren
2. Vollständiges Schema aus `schema.prisma` anlegen (~3500 Zeilen SQL)
3. Prisma-Migrations-Historie eintragen (damit spätere `yarn db-deploy` nichts doppelt anlegt)

## Danach in Vercel

```env
DATABASE_DIRECT_URL=postgresql://postgres:...@db.sozarwmazweyiiookfxg.supabase.co:5432/postgres
DATABASE_URL=<Transaction pooler aus Supabase, Port 6543>
```

Redeploy → App unter `/auth/setup` öffnen → ersten Admin anlegen.

## Datei neu generieren (Entwickler)

```bash
bash scripts/supabase/generate-sql-editor-setup.sh
```
