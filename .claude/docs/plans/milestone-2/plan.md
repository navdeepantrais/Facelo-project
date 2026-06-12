# Milestone 2 — Plan

**Scope:** Marketplace Module — Product Catalog, Search, Marketplace Sections, Cart, Customer Account & Pre-Payment Order Flow
**Week:** Jun 15–21, 2026
**Status:** NOT STARTED
**Branch:** `feat/marketplace`

---

## What M1 Already Provides (Do Not Rebuild)

| Asset | Location | Note |
|---|---|---|
| `categories` table | `db/schema/catalog.ts` | 9 rows seeded |
| `products` table | `db/schema/catalog.ts` | Schema complete — needs 4 columns + indexes |
| `orders`, `order_items` | `db/schema/orders.ts` | Fully defined |
| `videos`, `video_products` | `db/schema/videos.ts` | Fully defined |
| `CartItem`, `ShippingAddress` | `types/index.ts` | Already typed |
| `Category`, `Product`, `Order`, `OrderItem` | `types/index.ts` | Drizzle-inferred |
| `<Skeleton>` | `components/ui/skeleton.tsx` | Installed |
| `Sheet`, `Dialog`, `Select`, etc. | `components/ui/` | Installed |
| Layout shell | `components/layout/` | Header, Footer, Navigation, MarketplaceLayout |
| Auth guards | `middleware.ts` + layouts | Protects `/account/*` |

---

## Schema Changes Required

> Run `pnpm db:check → db:generate → db:migrate` after every edit to `db/schema/`.

### 1. Extend `products` table — `db/schema/catalog.ts`

Add these columns:

```ts
slug: text('slug').unique().notNull(),
isTrending:   boolean('is_trending').default(false).notNull(),
isBestseller: boolean('is_bestseller').default(false).notNull(),
isFeatured:   boolean('is_featured').default(false).notNull(),
```

Add these indexes in the same table definition:

```ts
index('products_slug_idx').on(t.slug),
index('products_price_idx').on(t.price),
index('products_brand_idx').on(t.brand),
index('products_rating_idx').on(t.rating),
index('products_review_count_idx').on(t.reviewCount),
index('products_created_at_idx').on(t.createdAt),
// Composite — homepage sections always filter isActive + flag together
index('products_active_trending_idx').on(t.isActive, t.isTrending),
index('products_active_bestseller_idx').on(t.isActive, t.isBestseller),
index('products_active_featured_idx').on(t.isActive, t.isFeatured),
```

### 2. Search index — new migration SQL

After `db:generate`, open the generated migration file and append:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX products_name_trgm_idx
  ON products USING GIN (name gin_trgm_ops);

CREATE INDEX products_description_trgm_idx
  ON products USING GIN (description gin_trgm_ops);
```

> Drizzle cannot express GIN trigram indexes in schema files. Add them directly to the migration SQL. These are append-only and safe.

### 3. Seed sample products — `db/seed/data/products.ts`

Create 15–20 sample products spread across all 9 categories with realistic data. Include a slug derived from the name, set a few as `isTrending`, `isBestseller`, `isFeatured`. Add `seedProducts()` to `db/seed/index.ts`.

### No other schema changes. Orders/orderItems/payments tables are complete from M1.

---

## Route Structure

```
app/
├── (marketplace)/              # Route group — shares MarketplaceLayout
│   ├── layout.tsx              # Wraps with <MarketplaceLayout> (header + footer)
│   ├── page.tsx                # Homepage: trending, featured, bestsellers, new arrivals, shop from videos
│   ├── products/
│   │   ├── page.tsx            # Listing: grid + filters + search + sort + pagination
│   │   ├── loading.tsx         # ProductCard skeleton grid (8 cards, same columns as real grid)
│   │   └── [slug]/
│   │       ├── page.tsx        # Product detail
│   │       └── loading.tsx     # Product detail skeleton
│   └── categories/
│       └── [slug]/
│           └── page.tsx        # Category-scoped listing (reuses products page logic)
├── account/
│   ├── layout.tsx              # Auth guard — redirects to /auth/login if no session
│   ├── page.tsx                # Profile: name, email, avatar, edit form
│   └── orders/
│       ├── page.tsx            # Order history list with status badges
│       └── [orderId]/
│           └── page.tsx        # Order detail: items, totals, shipping address, status timeline
└── checkout/
    ├── page.tsx                # Shipping address + order summary — Server Component wrapper
    ├── CheckoutForm.tsx        # 'use client' — RHF form + cart display + submit
    └── confirmation/
        └── [orderId]/
            └── page.tsx        # Order confirmation — success state with order details
```

---

## Full File Creation List

### Phase 1 — Schema + Data (Day 1)

| File | Action | Purpose |
|---|---|---|
| `db/schema/catalog.ts` | **Edit** | Add `slug`, `isTrending`, `isBestseller`, `isFeatured` columns + all new indexes |
| `db/migrations/000X_marketplace_products.sql` | **Generated** | Run `pnpm db:generate` — then manually append trigram SQL |
| `db/seed/data/products.ts` | **Create** | 15–20 sample products with slugs, flags, realistic prices |
| `db/seed/index.ts` | **Edit** | Import and call `seedProducts()` |
| `types/index.ts` | **Edit** | Add `ProductWithCategory`, `CartItem` (already exists — verify) types |

---

### Phase 2 — Data Layer (Day 1–2)

| File | Action | Purpose |
|---|---|---|
| `lib/actions/products.ts` | **Create** | All product queries: listing (filters/search/sort/page), detail, related |
| `lib/actions/marketplace.ts` | **Create** | Homepage section queries: trending, bestsellers, new arrivals, featured, shop-from-videos |
| `lib/actions/orders.ts` | **Create** | `createOrder`, `getUserOrders`, `getOrder` |
| `lib/validators/checkout.ts` | **Create** | Zod schema for shipping address |

---

### Phase 3 — Marketplace Components (Days 2–3)

| File | Action | Purpose |
|---|---|---|
| `components/marketplace/ProductCard.tsx` | **Create** | Product grid card: image, name, brand, price, star rating, add-to-cart button |
| `components/marketplace/ProductCardSkeleton.tsx` | **Create** | Exact skeleton mirror of `ProductCard` — same dimensions |
| `components/marketplace/ProductGrid.tsx` | **Create** | Responsive grid wrapper `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` |
| `components/marketplace/SearchBar.tsx` | **Create** | Controlled input that updates `?q=` URL param on submit/debounce |
| `components/marketplace/SortSelect.tsx` | **Create** | `<Select>` that updates `?sort=` URL param |
| `components/marketplace/FilterSidebar.tsx` | **Create** | Desktop sidebar + mobile `<Sheet>` — category, price range, brand, rating, creator filters |
| `components/marketplace/ActiveFilters.tsx` | **Create** | Pill list of active filters with remove (×) button — updates URL |
| `components/marketplace/ProductImageGallery.tsx` | **Create** | Detail page: main image + thumbnail strip, click to swap |
| `components/marketplace/MarketplaceSection.tsx` | **Create** | Section with title, optional subtitle, "See all →" link, horizontal scroll on mobile |
| `components/marketplace/StarRating.tsx` | **Create** | Display-only star rating component (0–5, supports half-stars visually) |

---

### Phase 4 — Pages (Days 2–4)

| File | Action | Purpose |
|---|---|---|
| `app/(marketplace)/layout.tsx` | **Create** | Route group layout — wraps children in `<MarketplaceLayout>` |
| `app/(marketplace)/page.tsx` | **Edit/Replace** | Homepage — fetch all sections in parallel via `Promise.all`, render `<MarketplaceSection>` blocks |
| `app/(marketplace)/products/page.tsx` | **Create** | Listing page — reads `searchParams`, passes to `getProducts()`, renders grid + sidebar |
| `app/(marketplace)/products/loading.tsx` | **Create** | Skeleton: same `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` layout, 8 `<ProductCardSkeleton>` items |
| `app/(marketplace)/products/[slug]/page.tsx` | **Create** | Detail page — `getProduct(slug)`, full layout with gallery, info, related products |
| `app/(marketplace)/products/[slug]/loading.tsx` | **Create** | Product detail skeleton |
| `app/(marketplace)/categories/[slug]/page.tsx` | **Create** | Thin wrapper — calls `getProducts({ categorySlug: slug, ...rest })`, reuses listing components |
| `app/account/layout.tsx` | **Create** | Auth guard using `requireAuth()`, shared account nav |
| `app/account/page.tsx` | **Create** | Profile info + update name/avatar form |
| `app/account/orders/page.tsx` | **Create** | Order history list — status badges, dates, item count, total |
| `app/account/orders/[orderId]/page.tsx` | **Create** | Order detail — items table, shipping address, status, totals |
| `app/checkout/page.tsx` | **Create** | Server wrapper — validates auth + cart not empty |
| `app/checkout/CheckoutForm.tsx` | **Create** | Client component: shipping form + cart summary + place-order button |
| `app/checkout/confirmation/[orderId]/page.tsx` | **Create** | Confirmation — fetches order, shows success message + items |

---

### Phase 5 — Cart (Day 3)

| File | Action | Purpose |
|---|---|---|
| `hooks/use-cart.ts` | **Create** | Cart state: items, add, remove, updateQty, clear, total, itemCount. Persists to `localStorage`. |
| `app/providers.tsx` | **Create** | Client-side providers wrapper: `CartProvider` (and future providers). Imported in `app/layout.tsx`. |
| `components/marketplace/CartDrawer.tsx` | **Create** | `<Sheet>` with cart items list, quantities, totals, "Go to Checkout" button |
| `components/marketplace/CartItemRow.tsx` | **Create** | Individual cart row: thumbnail, name, price, qty stepper, remove |
| `components/layout/Header.tsx` | **Edit** | Add cart icon button with item count badge — opens `<CartDrawer>` |

---

## Implementation Order (Exact Sequence)

Follow this sequence exactly. Do not skip ahead — each phase depends on the previous.

```
Step 1   db/schema/catalog.ts — add columns + indexes
Step 2   pnpm db:check → db:generate → (append trigram SQL to migration) → db:migrate
Step 3   db/seed/data/products.ts — sample data
Step 4   db/seed/index.ts — add seedProducts(); run pnpm db:seed
Step 5   lib/actions/products.ts — getProducts, getProduct, getRelatedProducts
Step 6   lib/actions/marketplace.ts — section queries
Step 7   types/index.ts — add ProductWithCategory, ProductFilters types
Step 8   components/marketplace/ProductCard.tsx + ProductCardSkeleton.tsx
Step 9   components/marketplace/ProductGrid.tsx
Step 10  components/marketplace/StarRating.tsx
Step 11  app/(marketplace)/layout.tsx
Step 12  app/(marketplace)/products/page.tsx + loading.tsx
Step 13  components/marketplace/SearchBar.tsx + SortSelect.tsx + FilterSidebar.tsx + ActiveFilters.tsx
Step 14  app/(marketplace)/products/[slug]/page.tsx + loading.tsx
Step 15  components/marketplace/ProductImageGallery.tsx
Step 16  app/(marketplace)/categories/[slug]/page.tsx
Step 17  components/marketplace/MarketplaceSection.tsx
Step 18  app/(marketplace)/page.tsx — homepage sections
Step 19  lib/actions/marketplace.ts — shopFromVideos section
Step 20  hooks/use-cart.ts
Step 21  app/providers.tsx — CartProvider
Step 22  app/layout.tsx — wrap with <Providers>
Step 23  components/marketplace/CartItemRow.tsx + CartDrawer.tsx
Step 24  components/layout/Header.tsx — add cart button + drawer
Step 25  app/account/layout.tsx
Step 26  app/account/page.tsx
Step 27  lib/validators/checkout.ts
Step 28  lib/actions/orders.ts — createOrder, getUserOrders, getOrder
Step 29  app/account/orders/page.tsx + [orderId]/page.tsx
Step 30  app/checkout/CheckoutForm.tsx + page.tsx
Step 31  app/checkout/confirmation/[orderId]/page.tsx
Step 32  pnpm typecheck → pnpm lint → pnpm format
```

---

## Data Flow Patterns

### Product Listing (URL-driven, Server-rendered)

```
User navigates to /products?q=shoes&category=footwear&sort=price_asc&page=2
        │
        ▼
app/(marketplace)/products/page.tsx        ← Server Component
  searchParams = { q, category, sort, page }
        │
        ▼
getProducts(filters)  ← lib/actions/products.ts
  → Drizzle query with WHERE, ORDER BY, LIMIT/OFFSET
  → Returns { products, total, page, totalPages }
        │
        ▼
<FilterSidebar>       ← reads URL, pushes new URL on change
<SearchBar>           ← reads ?q=, pushes new URL on submit
<SortSelect>          ← reads ?sort=, pushes new URL on change
<ActiveFilters>       ← reads all filter params, removes on click
<ProductGrid>         ← renders <ProductCard> per result
<Pagination>          ← reads page/totalPages, pushes new URL
```

All filter state lives in the URL. No `useState` for filters. Components read `searchParams` (server) or `useSearchParams` (client for interactive inputs). `router.push` writes new state.

### Cart Flow (Client-side, localStorage)

```
<ProductCard>  "Add to Cart" button
        │
        ▼
useCart().addItem(product, qty)
        │
        ├── Updates in-memory state
        └── Writes to localStorage['facelo_cart']
                │
                ▼
<CartDrawer>  opens via Header icon
        │
        ▼
"Go to Checkout" → navigate to /checkout
        │
        ▼
app/checkout/page.tsx  ← Server Component
  requireAuth() — must be logged in
  if no items, redirect to /products
        │
        ▼
<CheckoutForm>  ← 'use client'
  reads cart from useCart()
  shipping address form (RHF + Zod)
  displays CartSummary (items + totals)
  on submit → createOrder(shippingAddress, cartItems)
                │
                ▼
lib/actions/orders.ts  createOrder()
  1. requireAuth()
  2. Validate shippingAddress with Zod
  3. Re-fetch product prices from DB (never trust client prices)
  4. INSERT orders (status: 'pending', total from DB prices)
  5. INSERT order_items for each cart item
  6. Return { orderId }
                │
                ▼
Client clears cart → navigates to /checkout/confirmation/[orderId]
```

### Homepage Sections (Parallel Server Fetches)

```
app/(marketplace)/page.tsx  ← async Server Component

const [trending, bestsellers, newArrivals, featured, shopFromVideos] = await Promise.all([
  getTrendingProducts(8),
  getBestsellerProducts(8),
  getNewArrivalProducts(8),
  getFeaturedProducts(8),
  getShopFromVideos(6),
])

Each query is independent — runs in parallel.
Each returns max 8–12 items (always bounded).
```

---

## Query Rules (enforce for every query in this milestone)

| Rule | How to apply |
|---|---|
| No N+1 | Products with categories: JOIN in a single query, not per-product lookup |
| Independent queries → `Promise.all` | Homepage sections — all 5 queries run in parallel |
| Every query has LIMIT | Listing: max 24/page. Sections: max 12. Related: max 4. |
| Filter by `isActive = true` everywhere | Never show inactive products to customers |
| Creator filter via JOIN | `products ← video_products ← videos ← creators WHERE slug = ?` — single query |
| Search via trigram | `ILIKE '%q%'` is valid ONLY because we have a GIN trigram index |
| Price/rating filters use range conditions | `WHERE price >= min AND price <= max` |

---

## Component State & Loading Rules

Every data-fetching component must handle all 4 states:

| State | Implementation |
|---|---|
| Loading | `loading.tsx` with skeleton that mirrors the real layout exactly |
| Empty | Meaningful empty state (not a blank div). Example: "No products match your filters. [Clear filters]" |
| Error | `error.tsx` with a retry button and readable message |
| Populated | Real data — must handle long text truncation, missing images, etc. |

**Skeleton rules (non-negotiable):**
- `app/(marketplace)/products/loading.tsx` → `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, 8 cards
- `app/(marketplace)/products/[slug]/loading.tsx` → two-column detail layout: image placeholder left, info lines right
- No spinner anywhere in a listing or section context

---

## Cart State Specification

```ts
// hooks/use-cart.ts

type CartState = {
  items: CartItem[]                                          // CartItem = { product: Product, quantity: number }
  addItem: (product: Product, quantity?: number) => void    // default quantity = 1; if exists, increments
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void  // quantity 0 → removes item
  clearCart: () => void
  total: number        // computed: sum of (item.product.price * item.quantity)
  itemCount: number    // computed: sum of item.quantity
}
```

**Persistence rules:**
- On mount: read `localStorage.getItem('facelo_cart')`, parse, set state
- On every state change: `localStorage.setItem('facelo_cart', JSON.stringify(items))`
- `localStorage` access inside `useEffect` only — never during SSR
- If parse fails (corrupted data): clear localStorage, start empty

---

## Checkout + Order Validation Rules

```ts
// lib/validators/checkout.ts

const shippingAddressSchema = z.object({
  fullName:     z.string().min(2).max(100),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city:         z.string().min(2).max(100),
  state:        z.string().min(2).max(100),
  postalCode:   z.string().min(3).max(20),
  country:      z.string().length(2),   // ISO 3166-1 alpha-2
})
```

**`createOrder` server action rules:**
1. Call `requireAuth()` — not just getCurrentUser. Unauthenticated = error.
2. Validate `shippingAddress` with `shippingAddressSchema.safeParse()`.
3. Extract `productIds` from cart items. Fetch all in a single `db.select().where(inArray(products.id, productIds))`.
4. Reject if any product is `isActive = false` or `stock = 0`.
5. Compute `total` from DB prices × quantities (never from client-sent prices).
6. `INSERT INTO orders` with `status: 'pending'`.
7. `INSERT INTO order_items` in a single batch insert (not a loop).
8. Return `{ orderId }` — never throw on expected validation errors.

---

## Search Implementation

```ts
// lib/actions/products.ts — search block

// ONLY valid because products_name_trgm_idx and products_description_trgm_idx exist
if (q && q.length >= 2) {
  conditions.push(
    or(
      ilike(products.name, `%${q}%`),
      ilike(products.description, `%${q}%`),
    )
  )
}
```

Min query length of 2 characters — skip single-character searches.
Never run an ILIKE on these columns without the trigram migration applied.

---

## Filter → URL Param Mapping

| Filter | URL param | Type | Example |
|---|---|---|---|
| Search query | `q` | string | `?q=shoes` |
| Category | `category` | string (slug) | `?category=electronics` |
| Min price | `minPrice` | number | `?minPrice=10` |
| Max price | `maxPrice` | number | `?maxPrice=500` |
| Brand | `brand` | string | `?brand=Nike` |
| Creator | `creator` | string (slug) | `?creator=valeria` |
| Min rating | `rating` | number (1–5) | `?rating=4` |
| Sort | `sort` | enum | `?sort=price_asc` |
| Page | `page` | number | `?page=2` |

Sort enum values: `newest` (default) \| `price_asc` \| `price_desc` \| `rating` \| `popularity`

Page size: 24 products per page.

---

## Decisions Captured

| Decision | Choice | Reason |
|---|---|---|
| Cart storage | `localStorage` via custom hook, no server-side cart | M5 handles payment. Server cart adds complexity with no M2 payoff. |
| Filter state | URL params (not React state) | Deep-linkable, shareable, browser back/forward works, server-renderable. |
| Pagination | Offset (`page` param) | Multiple sort orders make cursor pagination complex. Offset is correct for bounded, admin-curated catalogue. |
| Trending/Bestseller/Featured | Boolean flags on products | No real order data in M2. Admin sets flags in M7. Derived ranking added in M7+ when data exists. |
| Product URLs | `/products/[slug]` | SEO-friendly. Slug = lowercased name + 8-char UUID suffix for uniqueness. |
| "For You" section | Same as `isFeatured` in M2 | Personalization requires viewing history. No tracking in M2. Add real logic in M6+. |
| Creator filter | JOIN `products ← video_products ← videos ← creators` | No direct creator FK on products. Videos are the link. Single JOIN query — no N+1. |
| Checkout auth | Require login before checkout | Guest checkout adds significant complexity. Scope does not mention guest flow. |
| `createOrder` price | Re-fetch from DB | Client-sent prices must never be trusted. Always use server prices. |

---

## New Environment Variables

None required for M2. All needed vars are already in `.env.local` from M1.

---

## Pre-M2 Start Checklist

- [ ] `git checkout -b feat/marketplace`
- [ ] Confirm `pnpm typecheck` passes clean on `main`
- [ ] Confirm `pnpm lint` passes clean on `main`
- [ ] DB has migrations applied (`pnpm db:migrate`)
- [ ] Categories seed applied (`pnpm db:seed`)

---

## Definition of Done

- [ ] Product listing loads at `/products` with real DB data
- [ ] Search with 2+ chars filters results in real time
- [ ] All 5 filters work: category, price range, brand, creator, rating
- [ ] All 5 sort orders work: newest, price asc/desc, rating, popularity
- [ ] Pagination navigates correctly, URL is shareable
- [ ] Product detail page renders at `/products/[slug]` with gallery, related products
- [ ] Homepage renders all 5 sections: trending, featured, bestsellers, new arrivals, shop from videos
- [ ] Cart: add from listing, add from detail, view in drawer, update qty, remove, persist on reload
- [ ] Cart count badge updates in header
- [ ] Checkout page requires auth, shows address form + cart summary
- [ ] Place order creates `orders` + `order_items` with `status: 'pending'`
- [ ] Order confirmation page shows order details
- [ ] Order history lists all user orders with status
- [ ] Order detail page shows full breakdown
- [ ] Account profile page shows and edits user info
- [ ] Every listing/section has a matching skeleton loader
- [ ] Every listing/section has a meaningful empty state
- [ ] All pages responsive at 375px, 768px, 1024px, 1280px
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm lint` → 0 errors
- [ ] `pnpm format:check` → all files pass
