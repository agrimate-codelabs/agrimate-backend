import { z } from 'zod'
export const getByIdSchema = z.string().uuid()
