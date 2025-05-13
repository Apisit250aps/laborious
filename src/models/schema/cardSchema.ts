import { z } from 'zod'
import { CardType } from '@/models/cards'

export const cardSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.nativeEnum(CardType, {
      errorMap: () => ({ message: 'Invalid card type' })
    }),
    pick: z.number().min(1).optional(),
    danger: z.array(z.number().min(0)).optional(),
    score: z.number().min(0).optional(),
    action: z.string().optional(), // Action ObjectId as string
    token: z.number().min(0).optional(),
    level: z.union([z.literal(1), z.literal(2)]).optional()
  })
  .refine(
    (data) => {
      // Validate required fields based on card type
      if (data.type === CardType.DANGER) {
        if (!data.pick || !data.danger || data.danger.length === 0) {
          return false
        }
      } else if (
        [CardType.ROBINSON, CardType.KNOWLEDGE, CardType.AGE].includes(
          data.type
        )
      ) {
        if (data.score === undefined) {
          return false
        }
      }

      // Validate AGE specific fields
      if (data.type === CardType.AGE && !data.level) {
        return false
      }

      return true
    },
    {
      message: 'Required fields are missing for the selected card type'
    }
  )
