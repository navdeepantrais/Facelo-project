# Milestone 1 — Plan

**Scope:** Foundation, Architecture & Authentication
**Week:** Jun 8–14, 2026
**Status:** COMPLETE

---

## Task List

### A. Project Setup & Architecture

| Task                           | Notes                                                    |
| ------------------------------ | -------------------------------------------------------- |
| Next.js 15 App Router scaffold | App Router, TypeScript strict, `@/*` path alias          |
| Tailwind CSS v4 + shadcn/ui    | PostCSS config, CSS variables, base tokens               |
| Folder structure               | app, components, lib, types, hooks, db, services         |
| Supabase project init          | Auth, DB, Storage, RLS enabled on all tables             |
| GitHub CI                      | `.github/workflows/ci.yml` — typecheck + lint on push/PR |
| Vercel config                  | `vercel.json` with environment variable references       |
| Layout shell                   | Header, Footer, Navigation — responsive, mobile-first    |
| Error boundaries               | `error.tsx` + `not-found.tsx` at app root                |

### B. Authentication

| Task                          | Notes                                                                  |
| ----------------------------- | ---------------------------------------------------------------------- |
| Google OAuth                  | Supabase OAuth provider, callback handler                              |
| Email + Password              | Signup, login, password reset, email verification                      |
| Logout                        | Clear session, redirect to `/`                                         |
| `public.users` profile sync   | Created immediately after auth user creation via `upsertUser`          |
| Account status check on login | Blocks `blocked`, `suspended`, `deleted` accounts with specific errors |
| Creator routing               | Live lookup in `creators` table — not role field                       |

### C. Role-Based Access

| Task                               | Notes                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Multi-role: user / creator / admin | `role` enum on users table                                             |
| Admin sub-roles                    | `admin_roles` table with sub_role enum                                 |
| Permission matrix                  | `admin_permissions` table + seed for all resource/action combos        |
| `hasPermission()` utility          | `lib/auth.ts` — checks permission for current user                     |
| `requirePermission()` enforcer     | `lib/auth.ts` — throws if permission missing                           |
| Protected routes                   | `proxy.ts` — protects `/creator/dashboard/*`, `/admin/*`, `/account/*` |

### D. Database Schema

| Task                      | Notes                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All 18 tables             | users, creators, products, categories, videos, video_products, orders, order_items, payments, refunds, click_events, referral_events, traffic_sources, commissions, sessions, admin_roles, admin_permissions, attribution_config |
| Per-product reward fields | `direct_reward_type`, `direct_reward_value`, `warm_reward_type`, `warm_reward_value` on products                                                                                                                                 |
| Indexes                   | All FK, filter, sort, and join columns indexed                                                                                                                                                                                   |
| RLS policies              | 20+ policies in `db/rls.sql`                                                                                                                                                                                                     |
| Seed data                 | 9 categories, admin roles + permissions, attribution config (7-day window, last_touch)                                                                                                                                           |
| `account_status` enum     | active, blocked, suspended, deleted — added as hotfix 2026-06-10                                                                                                                                                                 |

### E. Supporting Modules

| Task                       | Notes                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| `lib/attribution/index.ts` | UTM parsing, cookie get/set/clear, `ATTRIBUTION_WINDOW_DAYS = 7` |
| `lib/stripe/client.ts`     | Stripe SDK instance, API version 2026-05-27.dahlia               |
| `services/email.ts`        | Transactional email stub (Resend — needs `RESEND_API_KEY`)       |
| `services/storage.ts`      | Supabase Storage upload/delete/getPublicUrl helpers              |
| `services/analytics.ts`    | `AnalyticsEvent` type + `trackEvent` stub                        |
| `supabase/config.toml`     | Local dev config (port 54321, Google OAuth)                      |

---

## Environment Variables Required

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

## Decisions Made

See `decisions.md` for full rationale on:

- Supabase Auth + Drizzle ORM split
- `proxy.ts` instead of `middleware.ts`
- Last-touch attribution model
- Manual payouts
- `account_status` enum design
