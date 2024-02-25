import { z } from 'zod'

export const createFarmerLandSchema = z.object({
  name: z.string().optional(),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  village: z.string(),
  address: z.string(),
  photo: z.string(),
  landArea: z.number(),
  polygon: z.string()
})

export const updateFarmerLandSchema = createFarmerLandSchema.extend({
  id: z.string()
})