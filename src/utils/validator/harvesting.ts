import {z} from 'zod'

export const harvestingSchema = z.object({
  plantingId: z.string().uuid(),
  date: z.date(),
  amount: z.number()
})