# Development Workflow

## Daily Rhythm

```
Start of session
  └── Read current milestone plan (plans/milestone-N/plan.md)
  └── Check decisions.md for relevant prior choices
  └── Verify git author: git config user.name → Himanshu Kumar

During work
  └── Read before every edit
  └── One problem at a time
  └── pnpm typecheck after any structural change
  └── pnpm lint before marking anything done

End of session
  └── pnpm typecheck — must pass (0 errors)
  └── pnpm lint — must pass (0 errors)
  └── Update plans/milestone-N/status.md
  └── Write updates/YYYY-MM-DD-eod.md
```

---

## Branch Strategy

```
main
 └── feat/<short-slug>     New feature
 └── fix/<short-slug>      Bug fix
 └── chore/<short-slug>    Tooling, config, non-functional
```

- Branch off `main`
- Squash-merge to `main` — one feature = one squashed commit
- Never force-push or rewrite published history

---

## Database Change Workflow

```
1. Edit db/schema/<table>.ts
2. pnpm db:check          — validate schema consistency
3. pnpm db:generate       — creates timestamped SQL in db/migrations/
4. Review the generated SQL file
5. pnpm db:migrate        — applies pending migrations
```

**Never use `pnpm db:push` or `pnpm sb:push`.**
Migration files are append-only — never edit an already-applied file.

---

## Commit Rules

- Never commit without explicit user request
- Author: `Himanshu Kumar <himanshu064@gmail.com>`
- Message: describes WHY, not what files changed
- No `Co-Authored-By`, no AI mentions, no Claude references
- Stage specific files — never `git add -A` without reviewing

Verify before any push:

```bash
git config user.name        # must be: Himanshu Kumar
git config user.email       # must be: himanshu064@gmail.com
git log -1 --format='%an <%ae>'
```

---

## Environment Variables

Add to `.env.local` for local dev. Never commit this file.
Add to Vercel project settings for production.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

---

## Commands Quick Ref

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier

pnpm db:check         # Validate schema
pnpm db:generate      # Generate migration
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Browse DB (read-only)

pnpm sb:start         # Start local Supabase
pnpm sb:stop          # Stop local Supabase
pnpm sb:reset         # Reset local DB
pnpm sb:status        # Show local status
```

---

## EOD Update Format

File: `.claude/updates/YYYY-MM-DD-eod.md`

```markdown
# EOD Report — DD Month YYYY

## [Feature / Area]

- What was done
- Key decisions made inline

## [Feature / Area]

- ...

## Database

- Schema changes, migrations generated/applied

## Open / Carry-forward

- Anything not completed that rolls to next session
```

---

## Verification Checklist Before Marking Done

- [ ] `pnpm typecheck` — 0 errors
- [ ] `pnpm lint` — 0 errors
- [ ] No unused imports in edited files
- [ ] No `db` call inside a loop
- [ ] Independent DB calls use `Promise.all`
- [ ] Every `ORDER BY` / `WHERE` / `JOIN` column is indexed
- [ ] Loading + empty + error states handled for any new UI
- [ ] `cn()` used for all conditional Tailwind classes
- [ ] Skeleton loader (not spinner) for any data-fetching section
- [ ] Buttons disabled + spinner while async action is in flight
