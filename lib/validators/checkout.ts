import { z } from 'zod'

export const shippingAddressSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be 100 characters or fewer'),
  address_line1: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be 200 characters or fewer'),
  address_line2: z
    .string()
    .trim()
    .max(200, 'Address line 2 must be 200 characters or fewer')
    .optional(),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be 100 characters or fewer'),
  state: z
    .string()
    .trim()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be 100 characters or fewer'),
  postal_code: z
    .string()
    .trim()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must be 20 characters or fewer'),
  country: z
    .string()
    .trim()
    .length(2, 'Country must be a 2-letter ISO code (e.g. US)')
    .toUpperCase(),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
