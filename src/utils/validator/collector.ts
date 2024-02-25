import { z } from 'zod'

export const addCommoditySchema = z.object({
  commodityId: z.string().uuid({ message: 'Invalid commodity id' }),
  price: z.string().regex(/^[0-9]+$/, { message: 'Invalid price' }),
  period: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: 'Invalid Format, YYYY-mm-dd' })
    .refine(
      (value) => {
        const date = new Date(value)
        return date.toString() !== 'Invalid Date'
      },
      { message: 'Invalid period' }
    )
})
export const deleteCommoditySchema = z.object({
  id: z.string().uuid({ message: 'Invalid commodity id' })
})
