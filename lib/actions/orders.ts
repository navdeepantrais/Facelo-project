'use server'

import { and, asc, count, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db/index'
import { categories, orderItems, orders, products } from '@/db/schema'
import { shippingAddressSchema } from '@/lib/validators/checkout'
import { mapProductRow, productCategorySelect } from '@/lib/queries/products'
import { getCurrentUser } from '@/lib/auth'
import type { Order, OrderItem, ProductWithCategory } from '@/types'

const PAGE_SIZE = 20

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
      })
    )
    .min(1, 'Cart is empty'),
  shippingAddress: shippingAddressSchema,
  attributionSessionId: z.string().uuid().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export type OrderWithItems = Order & {
  items: (OrderItem & { product: ProductWithCategory | null })[]
}

export type CreateOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createOrder(rawInput: CreateOrderInput): Promise<CreateOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'You must be signed in to place an order.' }
  }

  const parsed = createOrderSchema.safeParse(rawInput)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const userId = user.id
  const { items, shippingAddress, attributionSessionId } = parsed.data
  const productIds = items.map((i) => i.productId)

  // Re-fetch prices from DB — never trust client-provided prices
  const productRows = await db
    .select({
      id: products.id,
      price: products.price,
      stock: products.stock,
      isActive: products.isActive,
      name: products.name,
    })
    .from(products)
    .where(inArray(products.id, productIds))

  if (productRows.length !== productIds.length) {
    return { success: false, error: 'One or more products were not found.' }
  }

  const productMap = new Map(productRows.map((p) => [p.id, p]))

  // Validate every item: active + in stock
  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) {
      return { success: false, error: `Product not found.` }
    }
    if (!product.isActive) {
      return { success: false, error: `"${product.name}" is no longer available.` }
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `"${product.name}" only has ${product.stock} unit(s) in stock.`,
      }
    }
  }

  // Compute total from DB prices
  const total = items.reduce((sum, item) => {
    const price = Number(productMap.get(item.productId)!.price)
    return sum + price * item.quantity
  }, 0)

  const orderId = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        total: total.toFixed(2),
        shippingAddress,
        attributionSessionId: attributionSessionId ?? null,
        status: 'pending',
      })
      .returning({ id: orders.id })

    const itemValues = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: productMap.get(item.productId)!.price,
      attributionType: 'none' as const,
    }))

    await tx.insert(orderItems).values(itemValues)

    return order.id
  })

  return { success: true, orderId }
}

export async function getUserOrders(
  userId: string,
  page = 1
): Promise<{ orders: OrderWithItems[]; total: number; page: number; totalPages: number }> {
  const user = await getCurrentUser()
  if (!user || user.id !== userId) {
    return { orders: [], total: 0, page, totalPages: 0 }
  }

  const offset = (page - 1) * PAGE_SIZE

  const [orderRows, countRows] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ total: count() }).from(orders).where(eq(orders.userId, userId)),
  ])

  if (orderRows.length === 0) {
    return { orders: [], total: 0, page, totalPages: 0 }
  }

  const orderIds = orderRows.map((o) => o.id)

  // Fetch all items for these orders in one query (no N+1)
  const itemRows = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds))
    .orderBy(asc(orderItems.createdAt))

  const productIdsInOrders = [
    ...new Set(itemRows.map((i) => i.productId).filter((id): id is string => id !== null)),
  ]

  // Fetch products with categories in one query
  const productRows =
    productIdsInOrders.length > 0
      ? await db
          .select(productCategorySelect)
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(inArray(products.id, productIdsInOrders))
      : []

  const productMap = new Map(
    productRows.map((r) => [r.id, mapProductRow(r as Parameters<typeof mapProductRow>[0])])
  )

  // Group items by orderId
  const itemsByOrder = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }

  const total = countRows[0]?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const result: OrderWithItems[] = orderRows.map((order) => {
    const items = (itemsByOrder.get(order.id) ?? []).map((item) => ({
      ...item,
      product: item.productId ? (productMap.get(item.productId) ?? null) : null,
    }))
    return { ...order, items }
  })

  return { orders: result, total, page, totalPages }
}

export async function getOrder(
  orderId: string,
  userId: string
): Promise<OrderWithItems | null> {
  const orderRows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1)

  if (!orderRows[0]) return null

  const order = orderRows[0]

  const itemRows = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.createdAt))

  const productIdsInOrder = [
    ...new Set(itemRows.map((i) => i.productId).filter((id): id is string => id !== null)),
  ]

  const productRows =
    productIdsInOrder.length > 0
      ? await db
          .select(productCategorySelect)
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(inArray(products.id, productIdsInOrder))
      : []

  const productMap = new Map(
    productRows.map((r) => [r.id, mapProductRow(r as Parameters<typeof mapProductRow>[0])])
  )

  const items = itemRows.map((item) => ({
    ...item,
    product: item.productId ? (productMap.get(item.productId) ?? null) : null,
  }))

  return { ...order, items }
}
