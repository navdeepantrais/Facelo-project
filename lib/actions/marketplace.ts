'use server'

import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db/index'
import { categories, products, videos, videoProducts } from '@/db/schema'
import type { ProductWithCategory, VideoWithProducts } from '@/types'
import { mapProductRow, productCategorySelect } from '@/lib/queries/products'

const DEFAULT_LIMIT = 8

export async function getTrendingProducts(limit = DEFAULT_LIMIT): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(products.isTrending, true)))
    .orderBy(desc(products.rating))
    .limit(limit)

  return rows.map((r) => mapProductRow(r as Parameters<typeof mapProductRow>[0]))
}

export async function getBestsellerProducts(limit = DEFAULT_LIMIT): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(products.isBestseller, true)))
    .orderBy(desc(products.reviewCount))
    .limit(limit)

  return rows.map((r) => mapProductRow(r as Parameters<typeof mapProductRow>[0]))
}

export async function getNewArrivalProducts(limit = DEFAULT_LIMIT): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt))
    .limit(limit)

  return rows.map((r) => mapProductRow(r as Parameters<typeof mapProductRow>[0]))
}

export async function getFeaturedProducts(limit = DEFAULT_LIMIT): Promise<ProductWithCategory[]> {
  const rows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.rating))
    .limit(limit)

  return rows.map((r) => mapProductRow(r as Parameters<typeof mapProductRow>[0]))
}

export async function getShopFromVideos(limit = 6): Promise<VideoWithProducts[]> {
  // Step 1: get approved videos (1 query)
  const videoRows = await db
    .select()
    .from(videos)
    .where(eq(videos.isApproved, true))
    .orderBy(desc(videos.createdAt))
    .limit(limit)

  if (videoRows.length === 0) return []

  const videoIds = videoRows.map((v) => v.id)

  // Step 2: get all video-product links for those videos (1 query, no N+1)
  const linkRows = await db
    .select({
      videoId: videoProducts.videoId,
      productId: videoProducts.productId,
      position: videoProducts.position,
    })
    .from(videoProducts)
    .where(inArray(videoProducts.videoId, videoIds))
    .orderBy(asc(videoProducts.position))

  if (linkRows.length === 0) {
    return videoRows.map((video) => ({ video, products: [] }))
  }

  const productIds = [...new Set(linkRows.map((l) => l.productId))]

  // Step 3: get all products with categories in one query (no N+1)
  const productRows = await db
    .select(productCategorySelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(inArray(products.id, productIds), eq(products.isActive, true)))

  const productMap = new Map(
    productRows.map((r) => [r.id, mapProductRow(r as Parameters<typeof mapProductRow>[0])])
  )

  // Group links by videoId preserving position order
  const linksByVideo = new Map<string, string[]>()
  for (const link of linkRows) {
    const existing = linksByVideo.get(link.videoId) ?? []
    existing.push(link.productId)
    linksByVideo.set(link.videoId, existing)
  }

  return videoRows.map((video) => {
    const productIdList = linksByVideo.get(video.id) ?? []
    const videoProductList = productIdList
      .map((pid) => productMap.get(pid))
      .filter((p): p is ProductWithCategory => p !== undefined)

    return { video, products: videoProductList }
  })
}
