# Developer Instructions — Start Here

## Folder Map

```
Facelo-project/
├── .claude/                      Internal working files — never ships to client
│   ├── docs/
│   │   ├── developer-instructions.md   ← you are here
│   │   ├── decisions.md                Architecture decisions log
│   │   ├── weekly-status.md            Weekly progress snapshots
│   │   ├── risk-ordered-plan.md        Risk-sorted work plan
│   │   ├── milestones/                 Source-of-truth scope (read-only)
│   │   │   └── README.md
│   │   ├── plans/                      Per-milestone live plans
│   │   │   └── milestone-1/
│   │   │       ├── plan.md
│   │   │       └── status.md
│   │   ├── conversation/               Client comms & UI refs
│   │   │   └── initial/
│   │   │       └── project_scope_8weeks.txt
│   │   └── development/
│   │       └── WORKFLOW.md
│   └── updates/                        Per-session EOD change logs
│       └── YYYY-MM-DD-eod.md
└── facelo/                             Next.js application root
    ├── app/
    ├── components/
    ├── db/
    ├── hooks/
    ├── lib/
    ├── services/
    ├── types/
    └── public/
```

---

## Milestone Workflow

1. **Read** `.claude/docs/milestones/README.md` — immutable contract scope
2. **Read** the current milestone's `plans/milestone-N/plan.md` — task list and notes
3. **Update** `plans/milestone-N/status.md` as tasks complete
4. **Log** architecture decisions in `decisions.md` whenever a non-obvious choice is made
5. **Write** an EOD update to `.claude/updates/YYYY-MM-DD-eod.md` at session end
6. **Update** `weekly-status.md` every Friday

---

## Session Checklist

### Before starting work

- [ ] Read the current milestone plan (`plans/milestone-N/plan.md`)
- [ ] Check `decisions.md` for any relevant prior choices
- [ ] Confirm git author: `git config user.name` → must be `Himanshu Kumar`

### During work

- [ ] Read before edit — always
- [ ] Run `pnpm typecheck` after any structural change
- [ ] No `pnpm db:push` — always generate + migrate
- [ ] One problem at a time

### Before ending session

- [ ] `pnpm typecheck` passes — 0 errors
- [ ] `pnpm lint` passes — 0 errors
- [ ] Update `plans/milestone-N/status.md`
- [ ] Write EOD log to `.claude/updates/YYYY-MM-DD-eod.md`

---

## Key Conventions (quick ref)

| Topic             | Rule                                                         |
| ----------------- | ------------------------------------------------------------ |
| Package manager   | `pnpm` only                                                  |
| DB migrations     | `db:generate` then `db:migrate` — never `db:push`            |
| Auth              | Supabase Auth for sessions; Drizzle for all DB queries       |
| Styling           | Tailwind v4 + `cn()` — no template literal class composition |
| Server components | Default; `'use client'` only when hooks/browser APIs needed  |
| Loading states    | Skeleton loaders only — no section spinners                  |
| Commits           | Never without explicit user request; author = Himanshu Kumar |

Full conventions: see `CLAUDE.md` at project root.
