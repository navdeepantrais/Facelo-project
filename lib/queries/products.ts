import { categories, products } from '@/db/schema'
import type { ProductFilters, ProductWithCategory, SortOption } from '@/types'

// Shared row type returned by any product + category LEFT JOIN query
export type ProductRowWithCategory = {
  id: string
  name: string
  slug: string
  description: string
  price: string
  images: string[]
  categoryId: string | null
  brand: string | null
  rating: string
  reviewCount: number
  stock: number
  directRewardType: 'percentage' | 'fixed'
  directRewardValue: string
  warmRewardType: 'percentage' | 'fixed'
  warmRewardValue: string
  isActive: boolean
  isTrending: boolean
  isBestseller: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  category: {
    id: string | null
    name: string | null
    slug: string | null
    imageUrl: string | null
    createdAt: Date | null
  } | null
}

// Shared Drizzle select shape for product + category LEFT JOIN queries
export const productCategorySelect = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  description: products.description,
  price: products.price,
  images: products.images,
  categoryId: products.categoryId,
  brand: products.brand,
  rating: products.rating,
  reviewCount: products.reviewCount,
  stock: products.stock,
  directRewardType: products.directRewardType,
  directRewardValue: products.directRewardValue,
  warmRewardType: products.warmRewardType,
  warmRewardValue: products.warmRewardValue,
  isActive: products.isActive,
  isTrending: products.isTrending,
  isBestseller: products.isBestseller,
  isFeatured: products.isFeatured,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
  category: {
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    imageUrl: categories.imageUrl,
    createdAt: categories.createdAt,
  },
}

// Maps a raw Drizzle LEFT JOIN row to the typed ProductWithCategory shape
export function mapProductRow(row: ProductRowWithCategory): ProductWithCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    images: row.images,
    categoryId: row.categoryId,
    brand: row.brand,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stock: row.stock,
    directRewardType: row.directRewardType,
    directRewardValue: row.directRewardValue,
    warmRewardType: row.warmRewardType,
    warmRewardValue: row.warmRewardValue,
    isActive: row.isActive,
    isTrending: row.isTrending,
    isBestseller: row.isBestseller,
    isFeatured: row.isFeatured,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category:
      row.category !== null && row.category?.id !== null
        ? {
            id: row.category.id!,
            name: row.category.name!,
            slug: row.category.slug!,
            imageUrl: row.category.imageUrl,
            createdAt: row.category.createdAt!,
          }
        : null,
  }
}

// Parses raw URL searchParams into a typed ProductFilters object
export function parseProductFilters(params: Record<string, string>): ProductFilters {
  return {
    q: params.q || undefined,
    category: params.category || undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    brand: params.brand || undefined,
    creator: params.creator || undefined,
    rating: params.rating ? Number(params.rating) : undefined,
    sort: (params.sort as SortOption) || 'newest',
    page: params.page ? Number(params.page) : 1,
  }
}
