# Milestone 1 — Live Status

**Last updated:** 2026-06-11
**Overall status:** COMPLETE — 100%

---

## Section Completion

| Section | Status | Notes |
|---|---|---|
| A. Project Setup & Architecture | DONE | All items shipped including CI + Vercel config |
| B. Authentication | DONE | Login, signup, OAuth, password reset, account status checks |
| C. Role-Based Access | DONE | Sub-roles, permission matrix, `hasPermission` + `requirePermission` |
| D. Database Schema | DONE | 18 tables, indexes, RLS, seed data, account_status enum |
| E. Supporting Modules | DONE | attribution, stripe, email/storage/analytics stubs |

---

## Session Log

### 2026-06-10
- Applied two-column auth layout (marketing panel + form) to login page
- Replaced inline Google OAuth handler with shared `OAuthButtons` component
- Fixed pre-existing ESLint crash (`nextVitals` not iterable) using `FlatCompat`
- Signup: creates `public.users` profile immediately via `upsertUser`
- Login: validates profile exists; checks account status; blocks blocked/suspended/deleted
- Creator routing: replaced role field check with live `creators` table lookup
- Added `account_status` enum + `status` column on users (migration generated + applied)
- Become-a-Creator form: bio, promo code, social URLs; race-condition-safe upsert

### 2026-06-11
- `lib/stripe/client.ts` — Stripe SDK instance
- `lib/attribution/index.ts` — UTM parsing, cookie helpers
- `services/email.ts`, `services/storage.ts`, `services/analytics.ts` — stubs
- `supabase/config.toml` — local Supabase dev config
- GitHub CI workflow added
- `vercel.json` added

---

## Open Items / Carry-forward

None. All M1 scope items closed.

---

## Next Milestone

**M2 — Marketplace Module** (Week 2, Jun 15–21)
See `plans/milestone-2/plan.md` when created.
