import { z } from 'zod'

export const offtakerInputSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(3).max(255),
  phone: z.string().min(3).max(255)
})
