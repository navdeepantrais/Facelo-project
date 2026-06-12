# Milestone 2 — Live Status

**Last updated:** 2026-06-11
**Overall status:** COMPLETE
**Dev steps:** See `dev-steps.md`

---

## Phase Completion

| Phase | Items | Status |
|---|---|---|
| Phase 1: Schema + Seed | catalog.ts, migration 0002, product seed (18 products) | ✅ DONE |
| Phase 2: Data layer | products.ts, marketplace.ts, validators/checkout.ts, orders.ts | ✅ DONE |
| Phase 3: Marketplace components | StarRating, ProductCard, ProductCardSkeleton, AddToCartButton, ProductGrid, MarketplaceSection, SearchBar, SortSelect, FilterSidebar, ActiveFilters, ProductImageGallery, Paginator | ✅ DONE |
| Phase 4: Pages | Homepage (app/page.tsx), (marketplace) route group, products listing, product detail, categories listing, category products | ✅ DONE |
| Phase 5: Cart | hooks/use-cart.ts (CartProvider + useCart), CartDrawer, CartItemRow, Header refactored | ✅ DONE |
| Phase 6: Account | account layout (auth guard), profile page, orders list, order detail | ✅ DONE |
| Phase 7: Checkout + Orders | lib/validators/checkout.ts, lib/actions/orders.ts, CheckoutForm, checkout page, confirmation page | ✅ DONE |

---

## Step Tracker

| Step | File | Status |
|---|---|---|
| 1 | `db/schema/catalog.ts` — slug, isTrending, isBestseller, isFeatured + 9 indexes | ✅ |
| 2 | Migration 0002 generated + trigram SQL appended + applied | ✅ |
| 3 | `db/seed/data/products.ts` — 18 products across 9 categories | ✅ |
| 4 | `db/seed/index.ts` — seedProducts(); `pnpm db:seed` ✓ 18 rows | ✅ |
| 5 | `types/index.ts` — ProductWithCategory, VideoWithProducts, SortOption, ProductFilters, PaginatedProducts | ✅ |
| 6 | `lib/actions/products.ts` — getProducts, getProduct, getRelatedProducts, getCategories, parseProductFilters, mapProductRow | ✅ |
| 7 | `lib/actions/marketplace.ts` — getTrendingProducts, getBestsellerProducts, getNewArrivalProducts, getFeaturedProducts, getShopFromVideos | ✅ |
| 8 | `lib/validators/checkout.ts` — shippingAddressSchema + ShippingAddressInput | ✅ |
| 9 | `lib/actions/orders.ts` — createOrder (re-fetches DB prices), getUserOrders, getOrder | ✅ |
| 10 | `components/marketplace/StarRating.tsx` | ✅ |
| 11 | `components/marketplace/AddToCartButton.tsx`, `ProductCard.tsx`, `ProductCardSkeleton.tsx` | ✅ |
| 12 | `components/marketplace/ProductGrid.tsx` (with ProductGridSkeleton) | ✅ |
| 13 | `components/marketplace/MarketplaceSection.tsx` (with MarketplaceSectionSkeleton) | ✅ |
| 14 | `components/marketplace/SearchBar.tsx` | ✅ |
| 15 | `components/marketplace/SortSelect.tsx` | ✅ |
| 16 | `components/marketplace/FilterSidebar.tsx` | ✅ |
| 17 | `components/marketplace/ActiveFilters.tsx` | ✅ |
| 18 | `components/marketplace/ProductImageGallery.tsx` | ✅ |
| 19 | `components/marketplace/Paginator.tsx` | ✅ |
| 20 | `app/(marketplace)/layout.tsx` | ✅ |
| 21 | `app/page.tsx` — marketplace homepage with hero + 4 sections | ✅ |
| 22 | `app/(marketplace)/products/page.tsx` — filtered, sorted, paginated | ✅ |
| 23 | `app/(marketplace)/products/[slug]/page.tsx` — detail + gallery + related | ✅ |
| 24 | `app/(marketplace)/categories/page.tsx` — category grid | ✅ |
| 25 | `app/(marketplace)/categories/[slug]/page.tsx` — category products | ✅ |
| 26 | `hooks/use-cart.ts` — CartProvider + useCart hook (localStorage) | ✅ |
| 27 | `app/layout.tsx` — CartProvider added | ✅ |
| 28 | `components/marketplace/CartDrawer.tsx` + `CartItemRow.tsx` | ✅ |
| 29 | `components/layout/Header.tsx` — useCart badge + CartDrawer integration | ✅ |
| 30 | `app/(marketplace)/account/layout.tsx` — auth guard | ✅ |
| 31 | `app/(marketplace)/account/page.tsx` — profile | ✅ |
| 32 | `app/(marketplace)/account/orders/page.tsx` — order list | ✅ |
| 33 | `app/(marketplace)/account/orders/[id]/page.tsx` — order detail | ✅ |
| 34 | `app/(marketplace)/checkout/CheckoutForm.tsx` + `page.tsx` | ✅ |
| 35 | `app/(marketplace)/checkout/confirmation/[id]/page.tsx` | ✅ |
| 36 | `pnpm typecheck` ✓ 0 errors · `pnpm lint` ✓ 0 errors | ✅ |

---

## Session Log

### 2026-06-11 — Session 2 (continuation)

- Implemented all 36 steps for M2
- Key decisions:
  - `app/page.tsx` updated in-place (not moved to route group) to avoid Next.js page conflict
  - Cart stored in localStorage via `hooks/use-cart.ts` (CartProvider + useCart)
  - CartProvider added to root `app/layout.tsx` so it's available everywhere
  - `createOrder` always re-fetches prices from DB — client cart prices never trusted
  - Checkout allows guest users (userId=null)
  - `productCategorySelect` and `mapProductRow` exported from products.ts for DRY reuse in marketplace.ts and orders.ts
  - GIN trigram indexes manually appended to migration 0002 SQL (Drizzle cannot express them)
  - `MarketplaceLayout.tsx` no longer accepts `cartCount` prop — Header reads from useCart context

---

### 2026-06-11 — Session 3 (bug fixes + hardening)

- Fixed "Server Actions must be async functions" crash — extracted sync helpers to `lib/queries/products.ts`
- Fixed `placehold.co` image hostname in `next.config.ts`
- Moved "Become a Creator" to `/account` with two-step UX (`BecomeCreatorSection` + `BecomeCreatorForm`)
- RBAC hardened: checkout protected at proxy + layout + page + action layers; `createOrder` gets userId from session only
- Full deduplication pass: `useUrlParams` hook, `formatPrice/formatOrderId/orderStatusColor` utils, `OrderItemsList` + `ShippingAddressDisplay` shared components
- `pnpm typecheck` and `pnpm lint` both pass clean

---

## Open / Carry-forward

- `getShopFromVideos` data is not yet shown on homepage (no approved videos in seed; ready when videos are added)
- Loading skeletons (`loading.tsx`) not created per route — add if streaming is needed
- Account profile editing not yet implemented (read-only in M2)
- Payment processing deferred to M5 (Stripe integration)
