import { z } from 'zod'

// RFC 5321 limits email to 254 chars.
// bcrypt silently truncates at 72 bytes — cap password there to make the limit explicit.
// fullName is a display field; 100 chars is a generous practical ceiling.
const emailField = z.string().trim().email('Enter a valid email address').max(254)
const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required').max(72),
  redirectTo: z.string().optional(),
})

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: emailField,
  password: passwordRules,
})

export const resetPasswordSchema = z.object({
  email: emailField,
})

export const updatePasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password').max(72),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
