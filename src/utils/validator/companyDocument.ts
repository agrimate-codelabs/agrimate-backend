import { z } from 'zod'

export const companyDocumentInputSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(3).max(255),
  document: z.string().min(3).max(255)
})
