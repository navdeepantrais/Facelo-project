# Architecture Decisions Log

Decisions recorded here are non-obvious choices that future sessions need to understand.
Format: date, decision, alternatives considered, reason.

---

## 2026-06-08 — Supabase Auth + Drizzle ORM (not Supabase DB client)

**Decision:** Use Supabase for auth only; use Drizzle ORM for all database reads and writes.

**Alternatives:** Use Supabase `.from()` queries throughout; use Prisma instead of Drizzle.

**Reason:** Drizzle gives type-safe queries derived directly from the schema (`$inferSelect`), eliminates a separate type-generation step, and enforces query patterns (N+1 prevention, index discipline) at the code layer. Supabase `.from()` is used nowhere — only `supabase.auth.*` is called.

---

## 2026-06-08 — Next.js 16 proxy.ts (not middleware.ts)

**Decision:** Route protection lives in `proxy.ts` at the project root, not `middleware.ts`.

**Alternatives:** Standard Next.js `middleware.ts`.

**Reason:** Project uses Next.js 16 which replaces `middleware.ts` with `proxy.ts`. The file exports `proxy()` and `config`, not `middleware()`. Never create or reference `middleware.ts`.

---

## 2026-06-08 — Attribution: last-touch, 7-day cookie window

**Decision:** Last-touch attribution model with a 7-day cookie window.

**Alternatives:** First-touch, time-decay, split/multi-touch.

**Reason:** Simplest model to audit, explain to creators, and implement correctly. Admin panel can change the window duration and model type in future milestones. Architecture supports first-touch and split models as future options.

---

## 2026-06-08 — Manual payouts (no auto-payout in MVP)

**Decision:** Creator payouts are manual — admin marks them as paid in the dashboard.

**Alternatives:** Stripe Connect auto-payouts.

**Reason:** Stripe Connect adds significant compliance overhead (KYC, onboarding flow) out of scope for MVP. Commission amounts are tracked in the `commissions` table; admin initiates transfers manually.

---

## 2026-06-08 — External video links (no native embed in MVP)

**Decision:** Videos from YouTube, Instagram, TikTok are stored as URLs and rendered as link-out previews. Native MP4/MOV uploads use Supabase Storage.

**Alternatives:** Embed iframes for each platform.

**Reason:** Instagram and TikTok block iframe embedding from third-party domains. Link-out is the only reliable cross-platform approach. Native vertical video (30–90s MP4/MOV) is stored and served from Supabase Storage.

---

## 2026-06-10 — account_status enum on users table

**Decision:** Added `account_status` enum (`active`, `blocked`, `suspended`, `deleted`) with a `status` column on the `users` table, indexed.

**Reason:** Login flow needed to distinguish blocked/suspended/deleted accounts and return specific error messages instead of a generic "not found" error. Soft-delete via `deleted` status rather than hard-delete preserves order history integrity.

---

## 2026-06-11 — M2 cart: localStorage, no server-side cart

**Decision:** Cart state stored in `localStorage` via a custom React hook. No server-side cart table.

**Alternatives:** Server-side cart table (DB row per item), Redis, Zustand with hydration.

**Reason:** Payment wiring is M5. A server cart adds complexity — auth checks, race conditions, cleanup — with zero benefit in M2. The `CartItem` type is already defined in `types/index.ts`. Revisit at M5 when checkout is live; if guest checkout is added, a server cart becomes necessary.

---

## 2026-06-11 — M2 filter state in URL params

**Decision:** All marketplace filters (search, category, price, brand, creator, rating, sort, page) stored as URL search params. No `useState` for filter values.

**Reason:** URL-driven state is deep-linkable, shareable, survives page refresh, and is readable by Server Components directly from `searchParams`. Filter components write to the URL via `router.push`; the Server Component reads and queries accordingly. Eliminates a full layer of client state.

---

## 2026-06-11 — M2 trending/bestseller/featured: boolean flags

**Decision:** `isTrending`, `isBestseller`, `isFeatured` are boolean columns on the `products` table, set by admin.

**Alternatives:** Compute trending from recent orders/clicks; compute bestseller from total order volume.

**Reason:** No real order data exists until M5 payments are live. Boolean flags are the correct MVP approach. M7 admin dashboard will allow setting them manually. After M5 data accumulates, a scheduled job can auto-set `isTrending` based on click_events — but that's post-MVP.

---

## 2026-06-11 — M2 product URLs use slug, not ID

**Decision:** Product detail pages are at `/products/[slug]`. Slug = `name-lowercased-{8-char-uuid}`.

**Reason:** SEO-friendly URLs. UUIDs in URLs are unfriendly to indexing and sharing. The UUID suffix guarantees uniqueness without checking for collisions in the slug string itself.

---

## 2026-06-11 — Sync helpers in lib/queries/, never in lib/actions/

**Decision:** Synchronous utility functions (row mappers, select shapes, filter parsers) live in `lib/queries/<domain>.ts`. Only async server actions live in `lib/actions/<domain>.ts`.

**Reason:** Next.js requires every export from a `'use server'` file to be an async function. Sync helpers in a `'use server'` file cause a runtime crash. Separating them into `lib/queries/` keeps the constraint satisfied without duplicating code.

---

## 2026-06-11 — createOrder never accepts userId from caller

**Decision:** `lib/actions/orders.ts` → `createOrder` calls `getCurrentUser()` internally and derives `userId` from the session. `userId` is not accepted as a function parameter.

**Reason:** Accepting `userId` as a parameter lets any client spoof any user's identity. Server actions must always establish the caller's identity from the session, never from the request body.

---

## 2026-06-11 — URL param manipulation centralized in useUrlParams hook

**Decision:** All marketplace filter components use `hooks/use-url-params.ts` (`setParam`, `removeParams`) instead of importing `useRouter`/`useSearchParams`/`usePathname` and managing params inline.

**Reason:** The same 12-line `URLSearchParams` pattern was copy-pasted across 4 components. The hook ensures `page` is always reset on filter changes and avoids drift between implementations.

---

## 2026-06-11 — RLS policies in db/rls.sql (not inline Drizzle)

**Decision:** Row Level Security policies are maintained in `db/rls.sql` (20+ policies), applied via Supabase migrations, not via Drizzle schema.

**Reason:** Drizzle does not have first-class RLS policy DSL. Policies live in SQL and are version-controlled separately. Every table has RLS enabled; `db/rls.sql` is the source of truth.
