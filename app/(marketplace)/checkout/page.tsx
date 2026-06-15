import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { CheckoutForm } from './CheckoutForm'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  await requireAuth('/checkout')
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
