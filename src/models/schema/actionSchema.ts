
import { z } from 'zod'

export const actionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  codex: z.string().min(1, 'Codex is required'),
  value: z
    .number()
    .int()
    .min(-10, 'Value must be greater than or equal to -10')
    .max(10, 'Value must be less than or equal to 10'),
  description: z.string().optional()
})
