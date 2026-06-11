import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Missing required server environment variable: STRIPE_SECRET_KEY\n' +
      'Add it to .env.local (dev) or your deployment environment (prod).'
  )
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-05-27.dahlia' as const,
  typescript: true,
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ''
