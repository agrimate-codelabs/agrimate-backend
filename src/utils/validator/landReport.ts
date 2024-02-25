import z from "zod"

export const landReportValidator = z.object({
  landId: z.string(),
  report: z.string(),
})