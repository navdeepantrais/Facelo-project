import { z } from 'zod'

const optionalUrl = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().url('Enter a valid URL (must start with https://)').optional()
)

export const becomeCreatorSchema = z.object({
  bio: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().max(500, 'Bio must be 500 characters or fewer').optional()
  ),
  promoCode: z.preprocess(
    (v) => {
      if (typeof v !== 'string' || v.trim() === '') return undefined
      return v.trim().toLowerCase()
    },
    z
      .string()
      .min(3, 'Must be at least 3 characters')
      .max(30, 'Must be 30 characters or fewer')
      .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
      .optional()
  ),
  instagram: optionalUrl,
  youtube: optionalUrl,
  tiktok: optionalUrl,
})

export type BecomeCreatorInput = z.infer<typeof becomeCreatorSchema>
