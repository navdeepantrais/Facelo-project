import { requireAuth } from '@/lib/auth'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  await requireAuth('/checkout')
  return <>{children}</>
}
