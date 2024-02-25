import { z } from 'zod'

export const DiseasesPlantsInputSchema = z.object({
  name: z.string(),
  symtomps: z.string(),
  image: z.string().min(1).max(255),
  howTo: z.string()
})

export const UpdateDiseasesPlantsInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  symtomps: z.string().optional(),
  image: z.string().min(1).max(255).optional(),
  howTo: z.string().optional()
})
