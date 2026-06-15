# Risk-Ordered Plan

Sorted by: likelihood × impact. Highest risk items at top.
Review at start of each milestone. Update when risks are resolved or new ones emerge.

---

## Active Risks

### R1 — Attribution correctness across browser sessions (HIGH)

**Risk:** Cookie-based attribution can be lost by browser storage clearing, incognito mode, or cross-device usage. Creator earns nothing despite genuine referral.
**Milestone:** M4 (Attribution Engine)
**Mitigation:** Server-side backup via `click_events` table on every referral link click. Cookie is the fast path; server log is the audit trail. Document the gap clearly for the client.

### R2 — Stripe webhook reliability (HIGH)

**Risk:** Webhook delivery failure means payment confirmed on Stripe but no order created; or refund processed but commission not reversed.
**Milestone:** M5 (Payments)
**Mitigation:** Idempotency keys on all webhook handlers. `INSERT ... ON CONFLICT DO NOTHING` for order creation. Manual reconciliation view in admin. Log every webhook event to DB before processing.

### R3 — Commission reversal timing (MEDIUM)

**Risk:** Creator withdraws payout before refund window closes; commission is reversed but payout already gone.
**Milestone:** M5
**Mitigation:** Manual payout model means admin controls timing. Document a minimum hold period (e.g., 14 days after order delivery) as policy guidance to client.

### R4 — Video storage costs at scale (MEDIUM)

**Risk:** Native video uploads (30–90s MP4/MOV) on Supabase Storage grow unbounded. No size cap or quota per creator in MVP.
**Milestone:** M3 (Video System)
**Mitigation:** Enforce 100MB max per file at upload (client + server validation). Flag to client that CDN/transcoding (e.g., Mux) will be needed before public launch at scale.

### R5 — RLS policy gaps (MEDIUM)

**Risk:** A missing or overly permissive RLS policy could expose order data, commission amounts, or PII across users.
**Milestone:** M1 (complete), revisit at M7
**Mitigation:** `db/rls.sql` reviewed and 20+ policies applied. Run a targeted RLS audit before M8 deployment.

### R6 — Search performance on products table (LOW-MEDIUM)

**Risk:** `ILIKE '%q%'` on products table becomes a full sequential scan as catalogue grows.
**Milestone:** M2 (Marketplace)
**Mitigation:** `pgtrgm` GIN index on `name` + `description` columns required before any search query ships. Blocked per CLAUDE.md — no `ILIKE '%q%'` without trigram index.

### R7 — Multi-role permission enforcement gaps (LOW)

**Risk:** Admin sub-roles (product_manager, order_manager, etc.) defined in DB but not enforced on every admin route/action.
**Milestone:** M7 (Admin Dashboard)
**Mitigation:** `requirePermission(resource, action)` enforcer exists in `lib/auth.ts`. Must be called at the top of every admin Server Action. Audit all admin actions in M7.

---

## Resolved Risks

| Risk                                      | Resolution                                             | Date       |
| ----------------------------------------- | ------------------------------------------------------ | ---------- |
| GitHub CI missing                         | `.github/workflows/ci.yml` added with typecheck + lint | 2026-06-11 |
| Vercel config missing                     | `vercel.json` added                                    | 2026-06-11 |
| Signup race condition (duplicate profile) | `onConflictDoUpdate` on upsertUser                     | 2026-06-10 |
| Login doesn't check account status        | Status check + specific error messages added           | 2026-06-10 |
| Creator routing used stale role field     | Replaced with live `creators` table lookup             | 2026-06-10 |
