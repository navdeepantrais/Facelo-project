import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number | string): string {
  return `$${Number(value).toFixed(2)}`
}

export function formatOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}

export function orderProgressPercent(status: OrderStatus): number {
  switch (status) {
    case 'pending':
      return 15
    case 'paid':
      return 40
    case 'processing':
      return 70
    case 'completed':
      return 100
    default:
      return 0
  }
}

export function orderProgressLabels(status: OrderStatus): [string, string] {
  switch (status) {
    case 'pending':
      return ['Order Placed', 'Awaiting Payment']
    case 'paid':
      return ['Payment Confirmed', 'Preparing']
    case 'processing':
      return ['Processing', 'On Its Way']
    case 'completed':
      return ['Delivered', 'Complete']
    default:
      return ['Order Placed', 'Complete']
  }
}

export function orderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'cancelled':
    case 'refunded':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return ''
  }
}
