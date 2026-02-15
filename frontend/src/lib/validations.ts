import { z } from 'zod'

export const postTypes = ['place', 'hostel', 'people', 'bus', 'photo', 'other'] as const

export const postFormSchema = z.object({
  type: z.enum(postTypes),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  date: z.string().min(1, 'Date is required'),
})

export type PostFormValues = z.infer<typeof postFormSchema>

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
