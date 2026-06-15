# Milestone 2 — Development Steps

**Read before starting every session.**
Follow steps in order. Complete and verify each step before moving to the next.
Run `pnpm typecheck` after every structural change. Never skip it.

---

## Before You Start

```bash
git checkout -b feat/marketplace
pnpm typecheck   # must be 0 errors before first line of M2 code
pnpm lint        # must be 0 errors
```

---

## PHASE 1 — Schema + Seed Data

---

### STEP 1 — Extend products table schema

**File:** `db/schema/catalog.ts`
**Action:** Edit — add 4 columns and 9 new indexes

Add to the `products` table columns block (after `isActive`):

```ts
slug: text('slug').unique().notNull(),
isTrending: boolean('is_trending').default(false).notNull(),
isBestseller: boolean('is_bestseller').default(false).notNull(),
isFeatured: boolean('is_featured').default(false).notNull(),
```

Add to the indexes array (after the existing 2 indexes):

```ts
index('products_slug_idx').on(t.slug),
index('products_price_idx').on(t.price),
index('products_brand_idx').on(t.brand),
index('products_rating_idx').on(t.rating),
index('products_review_count_idx').on(t.reviewCount),
index('products_created_at_idx').on(t.createdAt),
index('products_active_trending_idx').on(t.isActive, t.isTrending),
index('products_active_bestseller_idx').on(t.isActive, t.isBestseller),
index('products_active_featured_idx').on(t.isActive, t.isFeatured),
```

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

### STEP 2 — Generate migration + add trigram indexes

**Run in order — do not skip `db:check`:**

```bash
pnpm db:check
pnpm db:generate
```

**Open the generated file** at `db/migrations/000X_<name>.sql`.
Append these lines at the very end of that file:

```sql
-- trigram search indexes (Drizzle cannot express GIN indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX products_name_trgm_idx
  ON products USING GIN (name gin_trgm_ops);

CREATE INDEX products_description_trgm_idx
  ON products USING GIN (description gin_trgm_ops);
```

**Then apply:**

```bash
pnpm db:migrate
```

**Verify:** Migration applied with no errors. Open Drizzle Studio (`pnpm db:studio`) and confirm the 4 new columns exist on `products`.

---

### STEP 3 — Create product seed data

**File:** `db/seed/data/products.ts` — **Create**

Rules:

- 18 products total, at least 1–2 per category (use slugs from `categoriesData`)
- Slug format: `product-name-{8-char-id}` — hardcode in seed (no runtime generation)
- Set `isTrending: true` on 4 products, `isBestseller: true` on 4, `isFeatured: true` on 4
- Use realistic prices (`'29.99'`, `'149.00'`) — type is `string` (numeric column)
- `rating` range: `'3.8'` to `'4.9'`, `reviewCount`: 10–500
- `images`: array of 1–3 placeholder URLs (e.g. `['https://placehold.co/600x600']`)
- `stock`: 10–200
- `directRewardValue: '10'`, `warmRewardValue: '5'` (percentages, default)
- All products: `isActive: true`

Export: `export const productsData = [...]`

---

### STEP 4 — Wire seed into db/seed/index.ts

**File:** `db/seed/index.ts` — **Edit**

Import `productsData` from `./data/products`.
Add `seedProducts()` function (same upsert pattern as `seedCategories` — conflict on `slug`).
Call it in `main()` after categories.

**Run:**

```bash
pnpm db:seed
```

**Verify:** Console shows `✓ products: 18 row(s) upserted`. Open Drizzle Studio and confirm rows.

---

## PHASE 2 — Types + Data Layer

---

### STEP 5 — Add M2 types

**File:** `types/index.ts` — **Edit**

Add after the existing DB row types section:

```ts
// ─── Marketplace types ────────────────────────────────────────────────────────

export type ProductWithCategory = Product & {
  category: Category | null
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity'

export type ProductFilters = {
  q?: string
  category?: string // category slug
  minPrice?: number
  maxPrice?: number
  brand?: string
  creator?: string // creator slug
  rating?: number // minimum rating (1–5)
  sort?: SortOption
  page?: number
}

export type PaginatedProducts = {
  products: ProductWithCategory[]
  total: number
  page: number
  totalPages: number
}
```

Verify `CartItem` already exists in the file — do not add a duplicate.

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

### STEP 6 — Create lib/actions/products.ts

**File:** `lib/actions/products.ts` — **Create**

Top of file: `'use server'`

**Functions to implement:**

#### `getProducts(filters: ProductFilters): Promise<PaginatedProducts>`

- Always filter `isActive = true`
- Build conditions array, push one condition per active filter
- Search: `ilike(products.name, '%q%')` OR `ilike(products.description, '%q%')` — only if `q.length >= 2`
- Category: JOIN with `categories` on `categoryId`, filter by `categories.slug`
- Creator: JOIN `videoProducts → videos → creators` where `creators.slug = creator`
- Price: `gte(products.price, minPrice)` / `lte(products.price, maxPrice)`
- Rating: `gte(products.rating, rating)`
- Brand: `eq(products.brand, brand)`
- Sort mapping:
  - `newest` → `desc(products.createdAt)` (default)
  - `price_asc` → `asc(products.price)`
  - `price_desc` → `desc(products.price)`
  - `rating` → `desc(products.rating)`
  - `popularity` → `desc(products.reviewCount)`
- Pagination: `LIMIT 24 OFFSET (page - 1) * 24`
- Return type: `PaginatedProducts`
- LEFT JOIN categories so `category` can be `null`
- Use `Promise.all([queryResults, countQuery])` — run data + count in parallel

#### `getProduct(slug: string): Promise<ProductWithCategory | null>`

- Single row: `WHERE slug = slug AND isActive = true`
- LEFT JOIN categories
- Return `null` if not found

#### `getRelatedProducts(productId: string, categoryId: string | null): Promise<ProductWithCategory[]>`

- `WHERE categoryId = categoryId AND id != productId AND isActive = true`
- `ORDER BY rating DESC`
- `LIMIT 4`
- If `categoryId` is null, return `[]`

**Query standards checklist:**

- [ ] No N+1 — categories joined in same query
- [ ] Every query has a `LIMIT`
- [ ] `isActive = true` on every customer-facing query
- [ ] Count and data queries run with `Promise.all`

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

### STEP 7 — Create lib/actions/marketplace.ts

**File:** `lib/actions/marketplace.ts` — **Create**

Top of file: `'use server'`

All functions return `ProductWithCategory[]`. All filter `isActive = true`. All have `LIMIT`.

| Function                           | Filter                           | Order                   | Limit |
| ---------------------------------- | -------------------------------- | ----------------------- | ----- |
| `getTrendingProducts(limit = 8)`   | `isTrending = true`              | `rating DESC`           | param |
| `getBestsellerProducts(limit = 8)` | `isBestseller = true`            | `reviewCount DESC`      | param |
| `getNewArrivalProducts(limit = 8)` | none extra                       | `createdAt DESC`        | param |
| `getFeaturedProducts(limit = 8)`   | `isFeatured = true`              | `rating DESC`           | param |
| `getShopFromVideos(limit = 6)`     | videos that have linked products | `videos.createdAt DESC` | param |

For `getShopFromVideos`:

- Query `videos` JOIN `videoProducts` JOIN `products` JOIN `categories`
- Filter: `videos.isApproved = true AND products.isActive = true`
- Return type: `Array<{ video: Video; products: ProductWithCategory[] }>`
- Add this type to `types/index.ts`: `export type VideoWithProducts = { video: Video; products: ProductWithCategory[] }`
- Limit to 6 videos, each with up to 4 linked products (use aggregation or post-query grouping)

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

### STEP 8 — Create lib/validators/checkout.ts

**File:** `lib/validators/checkout.ts` — **Create**

```ts
import { z } from 'zod'

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  country: z.string().length(2),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
```

---

### STEP 9 — Create lib/actions/orders.ts

**File:** `lib/actions/orders.ts` — **Create**

Top of file: `'use server'`

**Functions:**

#### `createOrder(input: { shippingAddress: ShippingAddressInput; items: Array<{ productId: string; quantity: number }> }): Promise<{ orderId: string } | { error: string }>`

Exact steps inside:

1. `const user = await requireAuth()` — redirect if not logged in
2. `shippingAddressSchema.safeParse(input.shippingAddress)` — return `{ error }` if invalid
3. Validate `input.items` is not empty — return `{ error: 'Cart is empty.' }` if so
4. `const productIds = input.items.map(i => i.productId)`
5. `const dbProducts = await db.select().from(products).where(inArray(products.id, productIds))` — single query
6. For each item: find matching `dbProduct`. If missing or `!isActive` or `stock === 0` → return `{ error }`
7. Compute `total`: sum of `Number(dbProduct.price) * item.quantity`
8. `db.transaction(async (tx) => { ... })`:
   - `INSERT INTO orders` → get `orderId`
   - `INSERT INTO order_items` — batch insert, NOT a loop
9. `revalidatePath('/account/orders')`
10. Return `{ orderId }`

#### `getUserOrders(): Promise<Order[]>`

- `requireAuth()`
- `WHERE userId = user.id ORDER BY createdAt DESC LIMIT 50`

#### `getOrder(orderId: string): Promise<(Order & { items: Array<OrderItem & { product: Product | null }> }) | null>`

- `requireAuth()`
- Fetch order: `WHERE id = orderId AND userId = user.id` — scoped to current user
- Fetch order items with products in one query (JOIN)
- Return `null` if not found or not owned by user

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

## PHASE 3 — Marketplace Components

---

### STEP 10 — Create components/marketplace/StarRating.tsx

**File:** `components/marketplace/StarRating.tsx` — **Create**

Server Component (no `'use client'`).

Props: `{ rating: number; count?: number; size?: 'sm' | 'md' }`

Renders 5 stars. Full star if `rating >= i`, half star if `rating >= i - 0.5`, empty otherwise.
Use `lucide-react`: `Star` icon. Full star: `fill-current text-yellow-400`. Empty: `text-muted-foreground`.
If `count` is provided, render `(count)` text next to stars.
`size='sm'` → `h-3 w-3`, `size='md'` (default) → `h-4 w-4`.

---

### STEP 11 — Create components/marketplace/ProductCard.tsx and ProductCardSkeleton.tsx

**File:** `components/marketplace/ProductCard.tsx` — **Create**

Server Component (no `'use client'`).

Props: `{ product: ProductWithCategory }`

Layout (flex-col card, full height):

```
<Card className="flex flex-col overflow-hidden">
  <div className="relative aspect-square overflow-hidden bg-muted">
    <Image fill sizes="..." alt={product.name} src={firstImage || placeholder} />
  </div>
  <CardContent className="flex flex-1 flex-col gap-1 p-3">
    {category badge if exists}
    <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
    {product.brand && <p className="text-muted-foreground text-xs">{product.brand}</p>}
    <StarRating rating={Number(product.rating)} count={product.reviewCount} size="sm" />
    <div className="mt-auto flex items-center justify-between pt-2">
      <span className="font-semibold">${Number(product.price).toFixed(2)}</span>
      <AddToCartButton product={product} />   ← separate client component (see below)
    </div>
  </CardContent>
</Card>
```

**Note:** The "Add to Cart" button must be a separate `'use client'` component because it calls `useCart()`. Create it as `components/marketplace/AddToCartButton.tsx`. Props: `{ product: Product }`. Uses `useTransition` for pending state, `Loader2` spinner while pending.

Card layout uses `flex flex-col` with `flex-1` on content area and `mt-auto` on the price/button row — prevents layout shift on variable-length titles.

---

**File:** `components/marketplace/ProductCardSkeleton.tsx` — **Create**

Server Component. No props.

Must mirror `ProductCard` layout exactly — same aspect ratio, same padding, same spacing:

```
<Card className="flex flex-col overflow-hidden">
  <Skeleton className="aspect-square w-full" />
  <div className="flex flex-1 flex-col gap-2 p-3">
    <Skeleton className="h-3 w-16" />        {/* category badge */}
    <Skeleton className="h-4 w-full" />      {/* title line 1 */}
    <Skeleton className="h-4 w-3/4" />       {/* title line 2 */}
    <Skeleton className="h-3 w-24" />        {/* brand */}
    <Skeleton className="h-3 w-20" />        {/* stars */}
    <div className="mt-auto flex items-center justify-between pt-2">
      <Skeleton className="h-5 w-16" />      {/* price */}
      <Skeleton className="h-8 w-24" />      {/* button */}
    </div>
  </div>
</Card>
```

---

### STEP 12 — Create components/marketplace/ProductGrid.tsx

**File:** `components/marketplace/ProductGrid.tsx` — **Create**

Server Component. Props: `{ children: React.ReactNode }`

```tsx
<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">{children}</div>
```

That's it. Keeps the grid breakpoints in one place — both ProductCard grids and skeleton grids import this.

---

### STEP 13 — Create components/marketplace/MarketplaceSection.tsx

**File:** `components/marketplace/MarketplaceSection.tsx` — **Create**

Server Component.

Props:

```ts
{
  title: string
  subtitle?: string
  href?: string          // "See all" link target
  children: React.ReactNode
  scrollable?: boolean   // horizontal scroll on mobile
}
```

Layout:

```
<section className="py-8">
  <div className="container mx-auto px-4">
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      </div>
      {href && <Link href={href} className="text-primary text-sm font-medium hover:underline">See all →</Link>}
    </div>
    {scrollable ? (
      <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {children}
      </div>
    ) : (
      <>{children}</>
    )}
  </div>
</section>
```

---

### STEP 14 — Create components/marketplace/SearchBar.tsx

**File:** `components/marketplace/SearchBar.tsx` — **Create**

`'use client'` — uses `useSearchParams`, `useRouter`, `usePathname`.

Props: `{ placeholder?: string }`

Behavior:

- Controlled input bound to `?q=` param
- On form submit: `router.push(pathname + '?' + newParams.toString())`
- On clear (×): removes `q` param, clears input
- Does NOT debounce on keypress — only triggers on submit (Enter or search button click)
- Shows `<Search>` icon inside input left side
- Shows `<X>` clear button when input has value

Use `<Input>` from `components/ui/input`. Wrap in a `<form>` with `onSubmit`.

---

### STEP 15 — Create components/marketplace/SortSelect.tsx

**File:** `components/marketplace/SortSelect.tsx` — **Create**

`'use client'` — uses `useSearchParams`, `useRouter`, `usePathname`.

Props: none

Uses `<Select>` from `components/ui/select`.

Options:

```
newest     → "Newest"
price_asc  → "Price: Low to High"
price_desc → "Price: High to Low"
rating     → "Top Rated"
popularity → "Most Popular"
```

On change: update `?sort=` param, keep all other params, `router.push(newUrl)`.
Default selection: `newest` if no `?sort=` param.

---

### STEP 16 — Create components/marketplace/FilterSidebar.tsx

**File:** `components/marketplace/FilterSidebar.tsx` — **Create**

`'use client'` — uses `useSearchParams`, `useRouter`, `usePathname`.

Props: `{ categories: Category[] }`

Renders two versions via responsive classes:

- **Desktop** (`hidden md:block`): sticky left sidebar
- **Mobile**: wrapped in a `<Sheet>` (trigger: "Filters" button + active filter count badge)

Filter sections inside:

1. **Categories** — list of links/buttons, one per category; active = highlighted
2. **Price Range** — two number inputs (`minPrice`, `maxPrice`)
3. **Brand** — text input
4. **Min Rating** — row of star buttons (1–5)

Each filter section:

- Updates its specific URL param
- Preserves all other params
- "Clear all" link at top removes all filter params except `sort`

No `useState` for filter values — read from `useSearchParams()` directly as source of truth.

---

### STEP 17 — Create components/marketplace/ActiveFilters.tsx

**File:** `components/marketplace/ActiveFilters.tsx` — **Create**

`'use client'` — uses `useSearchParams`, `useRouter`, `usePathname`.

Renders a row of removable filter pills.
Active params to show: `q`, `category`, `minPrice`, `maxPrice`, `brand`, `creator`, `rating`.
Each pill: label + `<X>` button that removes only that param.
"Clear all" button: removes all filter params, keeps `sort`.
Returns `null` if no active filter params.

---

### STEP 18 — Create components/marketplace/ProductImageGallery.tsx

**File:** `components/marketplace/ProductImageGallery.tsx` — **Create**

`'use client'` — uses `useState` for selected image index.

Props: `{ images: string[]; name: string }`

Layout:

- Main image: `aspect-square`, `relative`, uses Next.js `<Image fill>`
- Thumbnail strip below (if >1 image): row of small squares, click sets active index
- Active thumbnail: highlighted border `ring-2 ring-primary`
- If `images` is empty: show placeholder div with `bg-muted`

---

## PHASE 4 — Pages

---

### STEP 19 — Create app/(marketplace)/layout.tsx

**File:** `app/(marketplace)/layout.tsx` — **Create**

Server Component. Auth-optional (public pages — no redirect).

```tsx
import { getCurrentUser } from '@/lib/auth'
import MarketplaceLayout from '@/components/layout/MarketplaceLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUser()
  return <MarketplaceLayout profile={profile}>{children}</MarketplaceLayout>
}
```

**Note:** `MarketplaceLayout` no longer receives `cartCount` as a prop — the `Header` will read it from `useCart()` directly (wired in Step 24). Until Step 24, `cartCount` defaults to 0.

**Also:** Move `app/page.tsx` content to `app/(marketplace)/page.tsx` after this step. Delete the root `app/page.tsx` or replace with a redirect to `/`.

---

### STEP 20 — Create app/(marketplace)/products/page.tsx and loading.tsx

**File:** `app/(marketplace)/products/page.tsx` — **Create**

Server Component. Reads `searchParams`.

```tsx
// params passed as Promise in Next.js 15+
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const filters: ProductFilters = {
    q: params.q,
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    brand: params.brand,
    creator: params.creator,
    rating: params.rating ? Number(params.rating) : undefined,
    sort: (params.sort as SortOption) || 'newest',
    page: params.page ? Number(params.page) : 1,
  }

  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),   // add getCategories() to lib/actions/products.ts — returns Category[]
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full md:w-64 md:shrink-0">
          <FilterSidebar categories={categories} />
        </aside>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SearchBar />
            <SortSelect />
          </div>
          <ActiveFilters />
          {products.length === 0 ? (
            <EmptyState />   {/* inline or small component */}
          ) : (
            <>
              <p className="text-muted-foreground text-sm">{total} products</p>
              <ProductGrid>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </ProductGrid>
              <Pagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

Also add `getCategories()` to `lib/actions/products.ts`:

```ts
export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name))
}
```

---

**File:** `app/(marketplace)/products/loading.tsx` — **Create**

```tsx
import ProductGrid from '@/components/marketplace/ProductGrid'
import ProductCardSkeleton from '@/components/marketplace/ProductCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full space-y-4 md:w-64 md:shrink-0">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </aside>
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-36" />
          </div>
          <ProductGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ProductGrid>
        </div>
      </div>
    </div>
  )
}
```

---

### STEP 21 — Create app/(marketplace)/products/[slug]/page.tsx and loading.tsx

**File:** `app/(marketplace)/products/[slug]/page.tsx` — **Create**

Server Component.

```tsx
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.categoryId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} name={product.name} />
        <div className="space-y-4">
          {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.brand && <p className="text-muted-foreground">{product.brand}</p>}
          <StarRating rating={Number(product.rating)} count={product.reviewCount} />
          <p className="text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-2 pt-2">
            <AddToCartButton product={product} />
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-destructive text-sm">Only {product.stock} left in stock</p>
          )}
          {product.stock === 0 && <p className="text-muted-foreground text-sm">Out of stock</p>}
        </div>
      </div>

      {related.length > 0 && (
        <MarketplaceSection title="You may also like" className="mt-12">
          <ProductGrid>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </MarketplaceSection>
      )}
    </div>
  )
}
```

Export metadata:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return { title: product.name, description: product.description.slice(0, 160) }
}
```

---

**File:** `app/(marketplace)/products/[slug]/loading.tsx` — **Create**

Two-column skeleton mirroring the detail layout:

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-5 w-24" /> {/* badge */}
      <Skeleton className="h-8 w-3/4" /> {/* title */}
      <Skeleton className="h-4 w-32" /> {/* brand */}
      <Skeleton className="h-4 w-28" /> {/* stars */}
      <Skeleton className="h-10 w-24" /> {/* price */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" /> {/* description */}
      <Skeleton className="h-11 w-36" /> {/* button */}
    </div>
  </div>
</div>
```

---

### STEP 22 — Create app/(marketplace)/categories/[slug]/page.tsx

**File:** `app/(marketplace)/categories/[slug]/page.tsx` — **Create**

Thin wrapper. Reads `[slug]` and pre-sets the `category` filter. Delegates all rendering to the products page pattern.

```tsx
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  // Merge category slug into filters — category param from URL overrides slug if present
  const filters: ProductFilters = {
    ...parseSearchParams(sp), // helper: same parsing logic as products/page.tsx
    category: slug,
  }
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ])
  // ... same render as products/page.tsx but with category pre-selected
}
```

Extract `parseSearchParams` helper into `lib/utils.ts` to avoid duplication.

---

### STEP 23 — Create app/(marketplace)/page.tsx — Homepage

**File:** `app/(marketplace)/page.tsx` — **Create** (replaces current `app/page.tsx`)

Server Component.

```tsx
export default async function HomePage() {
  const [trending, bestsellers, newArrivals, featured, shopFromVideos] = await Promise.all([
    getTrendingProducts(8),
    getBestsellerProducts(8),
    getNewArrivalProducts(8),
    getFeaturedProducts(8),
    getShopFromVideos(6),
  ])

  return (
    <div>
      {/* Hero — static for M2 */}
      <section className="bg-muted py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold md:text-5xl">Shop from creators you trust</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Discover products recommended by your favourite creators.
          </p>
          <Button className="mt-6" render={<Link href="/products" />} size="lg">
            Browse All Products
          </Button>
        </div>
      </section>

      {featured.length > 0 && (
        <MarketplaceSection title="Featured" href="/products?sort=rating">
          <ProductGrid>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </MarketplaceSection>
      )}

      {trending.length > 0 && (
        <MarketplaceSection
          title="Trending Now"
          subtitle="What everyone is buying"
          href="/products?sort=popularity"
        >
          <ProductGrid>
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </MarketplaceSection>
      )}

      {bestsellers.length > 0 && (
        <MarketplaceSection title="Bestsellers" href="/products?sort=popularity">
          <ProductGrid>
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </MarketplaceSection>
      )}

      {newArrivals.length > 0 && (
        <MarketplaceSection title="New Arrivals" href="/products?sort=newest">
          <ProductGrid>
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </MarketplaceSection>
      )}

      {shopFromVideos.length > 0 && (
        <MarketplaceSection title="Shop from Videos" subtitle="Products linked by creators">
          {/* VideoProductRow component — or inline map */}
        </MarketplaceSection>
      )}
    </div>
  )
}
```

**Also update `app/page.tsx`** (root) — redirect to `/` which will now be handled by `(marketplace)`. Or simply delete `app/page.tsx` if `app/(marketplace)/page.tsx` takes over the `/` route.

---

## PHASE 5 — Cart

---

### STEP 24 — Create hooks/use-cart.ts

**File:** `hooks/use-cart.ts` — **Create**

`'use client'` (hook file — all hooks are client-side).

Implement as a React Context + hook:

```ts
// Context shape
type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number // computed
  itemCount: number // computed
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}
```

`CartProvider` component:

- `useState<CartItem[]>` for items, `useState<boolean>` for `isOpen`
- `useEffect` on mount: `JSON.parse(localStorage.getItem('facelo_cart') ?? '[]')` — wrap in try/catch, fallback to `[]`
- `useEffect` on items change: `localStorage.setItem('facelo_cart', JSON.stringify(items))`
- `addItem`: if product already in cart, increment quantity; otherwise push new item
- `updateQuantity`: if quantity <= 0, remove item; otherwise update
- `total`: `items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0)`
- `itemCount`: `items.reduce((sum, i) => sum + i.quantity, 0)`

Export both `CartProvider` and `useCart` (throws if used outside provider).

---

### STEP 25 — Create app/providers.tsx

**File:** `app/providers.tsx` — **Create**

`'use client'`

```tsx
import { CartProvider } from '@/hooks/use-cart'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
```

---

### STEP 26 — Edit app/layout.tsx — wrap with Providers

**File:** `app/layout.tsx` — **Edit**

Import `Providers` and wrap `{children}` and `<Toaster>`:

```tsx
import Providers from './providers'

// inside body:
;<Providers>
  {children}
  <Toaster richColors position="top-right" />
</Providers>
```

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

### STEP 27 — Create CartItemRow and CartDrawer components

**File:** `components/marketplace/CartItemRow.tsx` — **Create**

`'use client'`

Props: `{ item: CartItem }`

Layout: horizontal row with:

- Product thumbnail (`<Image>`, 64×64, `object-cover`)
- Product name (`line-clamp-2`) + price per unit
- Quantity stepper: `−` button, number display, `+` button
- Remove button (trash icon)
- Line total (`price × quantity`)

Uses `useCart()` for `updateQuantity`, `removeItem`.
All buttons use `useTransition` for pending states with `disabled` on pending.

---

**File:** `components/marketplace/CartDrawer.tsx` — **Create**

`'use client'`

Uses `useCart()` for `items`, `total`, `itemCount`, `isOpen`, `closeCart`.

```tsx
<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
  <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
    <SheetHeader>
      <SheetTitle>Cart ({itemCount})</SheetTitle>
    </SheetHeader>

    {items.length === 0 ? (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <ShoppingCart className="text-muted-foreground h-12 w-12" />
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button variant="outline" onClick={closeCart} render={<Link href="/products" />}>
          Browse Products
        </Button>
      </div>
    ) : (
      <>
        <div className="flex-1 space-y-3 overflow-y-auto py-4">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" render={<Link href="/checkout" />} onClick={closeCart}>
            Go to Checkout
          </Button>
        </div>
      </>
    )}
  </SheetContent>
</Sheet>
```

---

### STEP 28 — Edit Header.tsx — connect cart hook

**File:** `components/layout/Header.tsx` — **Edit**

Header is already `'use client'`. Make these changes:

1. Import `useCart` and `CartDrawer`
2. Replace `cartCount` prop reading with: `const { itemCount, openCart } = useCart()`
3. Change the cart button's `render={<Link href="/cart" />}` to `onClick={openCart}` (remove the Link)
4. Update the cart badge to use `itemCount` instead of `cartCount`
5. Render `<CartDrawer />` at the bottom of the `<header>` element
6. Remove `cartCount` from `HeaderProps` interface

**Also edit `components/layout/MarketplaceLayout.tsx`:**

- Remove `cartCount` prop from interface and usage (no longer needed)

**Verify:**

```bash
pnpm typecheck   # 0 errors
```

---

## PHASE 6 — Account Pages

---

### STEP 29 — Create app/account/layout.tsx

**File:** `app/account/layout.tsx` — **Create**

Server Component. Auth guard.

```tsx
import { requireAuth } from '@/lib/auth'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth('/account')
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="w-full space-y-1 md:w-48 md:shrink-0">
          <Link
            href="/account"
            className="hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium"
          >
            Profile
          </Link>
          <Link
            href="/account/orders"
            className="hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium"
          >
            Orders
          </Link>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
```

---

### STEP 30 — Create app/account/page.tsx

**File:** `app/account/page.tsx` — **Create**

Server Component.

Fetch `getCurrentUser()`. Display: avatar, full name, email, role badge, member since date.
Add an `UpdateProfileForm` co-located client component for editing `fullName`.
Form uses `useActionState` + a new `updateProfile` server action in `lib/actions/auth.ts`.
`updateProfile` updates `users.fullName` + `updatedAt`, calls `revalidatePath('/account')`.

---

### STEP 31 — Create app/account/orders/page.tsx

**File:** `app/account/orders/page.tsx` — **Create**

Server Component.

```tsx
const orders = await getUserOrders()
```

Empty state: "You haven't placed any orders yet. [Browse products →]"

Order list: each row shows:

- Order ID (truncated: first 8 chars)
- Date (`createdAt` formatted)
- Item count
- Total (`$XX.XX`)
- Status badge (color-coded: `pending` = yellow, `paid` = green, `cancelled` = red, etc.)
- "View details →" link to `/account/orders/[orderId]`

Use `<Table>` from `components/ui/table`.

---

### STEP 32 — Create app/account/orders/[orderId]/page.tsx

**File:** `app/account/orders/[orderId]/page.tsx` — **Create**

Server Component.

```tsx
const { orderId } = await params
const order = await getOrder(orderId)
if (!order) notFound()
```

Display:

- Order ID + status badge + date
- Shipping address (from `order.shippingAddress` JSON)
- Items table: product name, qty, unit price, line total
- Order total
- Note: "Payment pending — you will be redirected to checkout when payment is ready." (M5 placeholder)

---

## PHASE 7 — Checkout + Orders

---

### STEP 33 — Create app/checkout/page.tsx and CheckoutForm.tsx

**File:** `app/checkout/page.tsx` — **Create**

Server Component. Auth guard.

```tsx
import { requireAuth } from '@/lib/auth'

export default async function CheckoutPage() {
  await requireAuth('/checkout')
  // Cart is client-side — cannot read it here.
  // CheckoutForm reads useCart() and redirects if empty.
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
```

---

**File:** `app/checkout/CheckoutForm.tsx` — **Create**

`'use client'`

- `useCart()` → if `items.length === 0`: `router.replace('/products')` in a `useEffect`
- `useActionState(createOrder, null)` for form submission
- RHF + `zodResolver(shippingAddressSchema)` for the shipping address form
- Layout: two columns on desktop — form left (2/3), cart summary right (1/3)

Left column: shipping address form fields (fullName, addressLine1, addressLine2, city, state, postalCode, country select)

Right column:

- List of `CartItemRow` (read-only view — no qty controls)
- Subtotal
- "Place Order" button: `disabled={isPending}`, shows `<Loader2>` spinner while pending

On form submit: call `createOrder({ shippingAddress, items: cart.items.map(...) })`
On success `{ orderId }`: `cart.clearCart()`, `router.push('/checkout/confirmation/' + orderId)`
On error: show error toast

---

### STEP 34 — Create app/checkout/confirmation/[orderId]/page.tsx

**File:** `app/checkout/confirmation/[orderId]/page.tsx` — **Create**

Server Component.

```tsx
const order = await getOrder(orderId)
if (!order) notFound()
```

Layout: centered card with:

- Green checkmark icon
- "Order placed!" heading
- "Order #XXXXXXXX" sub-heading
- Items list (product name × qty = price)
- Shipping address
- Total
- "Track your order" link → `/account/orders/[orderId]`
- "Continue shopping" link → `/products`
- Note: "We'll update this page once payment is confirmed." (M5 placeholder)

---

## PHASE 8 — Final Verification

---

### STEP 35 — Run full validation

```bash
pnpm typecheck     # must be 0 errors
pnpm lint          # must be 0 errors
pnpm format        # auto-fix any formatting
pnpm format:check  # confirm clean
```

Fix any errors before marking M2 done. Do not report done without attaching output.

---

### STEP 36 — Manual QA checklist

Run `pnpm dev` and test each item:

**Marketplace**

- [ ] `/` — homepage loads all 5 sections with real data
- [ ] `/products` — grid loads, 24 per page
- [ ] `/products?q=` — search filters results
- [ ] `/products?category=beauty-skincare` — category filter works
- [ ] `/products?sort=price_asc` — sort works
- [ ] `/products?minPrice=20&maxPrice=100` — price filter works
- [ ] `/products/[slug]` — detail page, gallery, related products
- [ ] `/categories/fitness-sports` — pre-filtered listing

**Cart**

- [ ] Add to cart from listing page
- [ ] Add to cart from detail page
- [ ] Cart count badge updates in header
- [ ] Open cart drawer — items show correctly
- [ ] Update quantity — total updates
- [ ] Remove item
- [ ] Reload page — cart persists

**Checkout**

- [ ] `/checkout` — redirects to login if not authenticated
- [ ] `/checkout` — redirects to `/products` if cart is empty
- [ ] Fill form + submit — creates pending order
- [ ] Redirects to `/checkout/confirmation/[orderId]`

**Account**

- [ ] `/account` — redirects if not logged in
- [ ] `/account` — shows profile
- [ ] `/account/orders` — shows order history
- [ ] `/account/orders/[orderId]` — shows order detail

**Responsive** (check at 375px, 768px, 1024px, 1280px)

- [ ] Product grid reflows at all breakpoints
- [ ] Filter sidebar collapses to sheet on mobile
- [ ] Cart drawer is full-width on mobile
- [ ] Checkout form is single-column on mobile

---

## Coding Standards Quick Reference

| Rule                | Requirement                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `'use client'`      | Only on components using hooks, browser APIs, or event handlers        |
| Class composition   | `cn()` always — never template literal backticks                       |
| Loading states      | `loading.tsx` with skeleton — no section spinners                      |
| Async buttons       | `disabled={isPending}` + `<Loader2 animate-spin>` always               |
| DB queries          | No N+1, every query has LIMIT, `isActive=true` on all customer queries |
| Independent queries | `Promise.all` — never sequential awaits                                |
| Images              | Next.js `<Image>` always — no `<img>`                                  |
| URL state           | Filters live in URL params — no `useState` for filter values           |
| Pricing             | Always re-fetch from DB in `createOrder` — never trust client prices   |
