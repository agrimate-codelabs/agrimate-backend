import { z } from 'zod'

export const companyInputSchema = z.object({
  offtakerId: z.string().uuid(),
  nib: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
  provinceId: z.string().optional(),
  cityId: z.string().optional(),
  districtId: z.string().optional(),
  villageId: z.string().optional(),
  address: z.string().min(3).max(255)
})
