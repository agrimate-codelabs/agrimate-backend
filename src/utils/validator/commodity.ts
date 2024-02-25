import { z } from 'zod'

export const createCommoditySchema = z.object({
  name: z.string().min(1).max(255),
  planting_type: z.string().array(),
  icon: z.string().min(1).max(255)
})

export const updateCommoditySchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    name: z.string().min(1).max(255),
    icon: z.string().min(1).max(255)
  })
})
