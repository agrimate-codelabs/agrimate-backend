import { z } from 'zod'

export const plantingInputSchema = z.object({
  farmlandId: z.string().uuid(),
  commodityId: z.string().uuid(),
  unit: z.string(),
  planting_size: z.number(),
  planting_type: z.string(),
  production_cost: z.number(),
  longitude: z.string(),
  latitude: z.string(),
  date: z.date()
})

export const updatePlantingSchema = plantingInputSchema.extend({
  id: z.string().uuid()
})