# Pre-Session Memo — 12 June 2026

**Milestone:** M2 — Marketplace Module (COMPLETE)
**Session type:** Pre-implementation checkpoint before M3 begins
**Date:** 2026-06-12

---

## M2 Completion Summary

M2 was delivered in full on 2026-06-11, one week ahead of schedule.

### What was built

**Product Catalogue**
- Product listing page: search, category/price/brand/creator/rating filters, sort (newest, price asc/desc, trending), offset pagination
- Category listing page (`/categories`) and per-category products page (`/categories/[slug]`)
- Product detail page: image gallery, related products grid, `AddToCartButton`
- GIN trigram index on `products.name` + `products.description` for scalable full-text search
- `lib/queries/products.ts` holds all sync helpers; `lib/actions/products.ts` holds only async server actions

**Marketplace Sections (Homepage)**
- `app/page.tsx` — hero + Trending, Bestsellers, New Arrivals, Featured sections
- `MarketplaceSection` + `MarketplaceSectionSkeleton` shared components
- `getShopFromVideos` query ready; hidden until M3 seeds approved videos

**Cart**
- `hooks/use-cart.ts` — `CartProvider` + `useCart` hook; localStorage-persisted
- `CartDrawer` + `CartItemRow` components integrated into `Header`
- Cart count badge in header

**Account & Order History**
- `app/(marketplace)/account/` — profile (read-only in M2), order list, order detail
- Shared order components: `OrderItemsList`, `ShippingAddressDisplay`

**Checkout (pre-payment)**
- `lib/validators/checkout.ts` — Zod shipping address schema
- `lib/actions/orders.ts` — `createOrder` re-fetches prices from DB; `userId` sourced from session only
- `CheckoutForm` → pending order → confirmation page (`/checkout/confirmation/[id]`)
- Payment processing deferred to M5 (Stripe integration)

**RBAC Hardening (security)**
- `/checkout` added to `PROTECTED_PREFIXES` in `proxy.ts` (edge-level)
- `app/(marketplace)/checkout/layout.tsx` — layout-level `requireAuth`
- `createOrder` never accepts `userId` from caller — always reads from session
- `getUserOrders` and `getOrder` verify ownership before returning data
- Login/register pages redirect authenticated users to `/`

**"Become a Creator" UX**
- Moved from dead `/dashboard` route to `/account`
- Two-step UX: promo card (step 1) → form with back arrow (step 2)
- `BecomeCreatorSection` + `BecomeCreatorForm` in `components/creator/`

**Code quality**
- `useUrlParams` hook — centralizes `URLSearchParams` mutation across all filter components
- `formatPrice`, `formatOrderId`, `orderStatusColor` added to `lib/utils.ts`
- `CartItem` type deduped — single source in `types/index.ts`

**Verification (2026-06-11):** `pnpm typecheck` → 0 errors · `pnpm lint` → 0 errors

---

## Open Items Entering Today's Session

### From M2 (carry-forward)
| Item | Priority | Notes |
|---|---|---|
| Delete `/dashboard` route | Low | Dead code; safe to remove after manual test of `/account` Become-a-Creator flow |
| Account profile editing | Low | Read-only in M2; editing UI deferred — not in M3 scope either |
| `loading.tsx` skeletons per route | Low | Not added; add if streaming is needed |
| Homepage redesign (Stitch reference) | Medium | User provided design screenshot; work was interrupted 2026-06-11 |

### From M1 (still open)
| Item | Priority | Notes |
|---|---|---|
| GitHub CI workflow | Medium | `typecheck + lint` on push/PR not yet wired up |
| `vercel.json` | Medium | Deployment config not committed |
| Sub-role enforcement | Medium | `admin_permissions` table + `hasPermission()` exist; UI enforcement not tested end-to-end |

---

## M3 Scope (starting this week — Jun 15–21)

Per contract milestone:

**A. Creator Profile Page (`/[creatorSlug]`)**
- Creator bio, avatar, stats (followers, total sales)
- Video/reel feed (YouTube, Instagram, TikTok link-out + native MP4/MOV)
- Linked products grid under each video

**B. Native Video Upload**
- MP4/MOV, vertical, 30–90s, max 100MB
- Upload to Supabase Storage via signed URL
- `videos` table with metadata; link video → one or more products

**C. Referral Link System**
- Unique creator slug: `facelo.com/valeria`
- Product deep link: `facelo.com/valeria/product/123`
- Copy-link button on creator dashboard

---

## Decisions to Confirm Before M3 Implementation

1. **Homepage redesign** — should this happen as a pre-M3 task today, or is it deferred until M3 is done? The Stitch reference design is available.
2. **M1 gaps (CI + vercel.json)** — block M3 start or run in parallel? They are infrastructure, not functional blockers.
3. **`/dashboard` deletion** — can be done immediately with a 1-minute manual test.

---

## Current Verification Baseline

```
pnpm typecheck  →  0 errors  (as of 2026-06-11)
pnpm lint       →  0 errors  (as of 2026-06-11)
```

Run both before any implementation today to confirm the baseline is still clean.
