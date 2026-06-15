'use server'

import { and, asc, count, desc, eq, gte, ilike, inArray, lte, ne, or } from 'drizzle-orm'
import { db } from '@/db/index'
import { categories, creators, products, videos, videoProducts } from '@/db/schema'
import { mapProductRow, productCategorySelect } from '@/lib/queries/products'
import type { ProductRowWithCategory } from '@/lib/queries/products'
import type { Category, PaginatedProducts, ProductFilters, ProductWithCategory, SortOption } from '@/types'
import { PRODUCTS_PAGE_SIZE as PAGE_SIZE } from '@/lib/constants/pagination'

function buildOrderBy(sort: SortOption) {
  switch (sort) {
    case 'price_asc':
      return asc(products.price)
    case 'price_desc':
      return desc(products.price)
    case 'rating':
      return desc(products.rating)
    case 'popularity':
      return desc(products.reviewCount)
    case 'newest':
    default:
      return desc(products.createdAt)
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    brand,
    creator,
    rating,
    sort = 'newest',
    page = 1,
  } = filters

  const offset = (page - 1) * PAGE_SIZE
  const conditions = [eq(products.isActive, true)]

  if (q && q.trim().length >= 2) {
    const term = `%${q.trim()}%`
    conditions.push(or(ilike(products.name, term), ilike(products.description, term))!)
  }

  if (minPrice !== undefined) {
    conditions.push(gte(products.price, String(minPrice)))
  }

  if (maxPrice !== undefined) {
    conditions.push(lte(products.price, String(maxPrice)))
  }

  if (brand) {
    conditions.push(ilike(products.brand, brand))
  }

  if (rating !== undefined) {
    conditions.push(gte(products.rating, String(rating)))
  }

  const categoryCondition = category
    ? inArray(
        products.categoryId,
        db.select({ id: categories.id }).from(categories).where(eq(categories.slug, category))
      )
    : undefined

  const creatorCondition = creator
    ? inArray(
        products.id,
        db
          .selectDistinct({ id: videoProducts.productId })
          .from(videoProducts)
          .innerJoin(videos, eq(videoProducts.videoId, videos.id))
          .innerJoin(creators, eq(videos.creatorId, creators.id))
          .where(eq(creators.slug, creator))
      )
    : undefined

  const finalWhere = and(...conditions, categoryCondition, creatorCondition)

  const [rows, countRows] = await Promise.all([
    db
      .select(productCategorySelect)
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(finalWhere)
      .orderBy(buildOrderBy(sort))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ total: count() }).from(products).where(finalWhere),
  ])

  const total = countRows[0]?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return {
    products: (rows as ProductRowWithCategory[]).map(mapProductRow),
    total,
    page,
    totalPages,
  }
}

export async function getProduct(slug: string): Promise<ProductWithCategory | null> {
  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1)

  if (!rows[0]) return null
  return mapProductRow(rows[0] as ProductRowWithCategory)
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null
): Promise<ProductWithCategory[]> {
  if (!categoryId) return []

  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(eq(products.categoryId, categoryId), ne(products.id, productId), eq(products.isActive, true))
    )
    .orderBy(desc(products.rating))
    .limit(4)

  return (rows as ProductRowWithCategory[]).map(mapProductRow)
}

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name))
}
