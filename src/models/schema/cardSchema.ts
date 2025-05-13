import { z } from 'zod'
import { CardType } from '../cards';

export const baseCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.nativeEnum(CardType)
})

// Schema สำหรับ DangerCard
const dangerCardSchema = baseCardSchema.extend({
  type: z.literal(CardType.DANGER),
  pick: z.number().min(1, 'Pick must be at least 1'),
  danger: z.array(z.number()).min(1, 'At least one danger required')
})

// Schema สำหรับ RobinsonCard & KnowledgeCard
const robinsonCardSchema = baseCardSchema.extend({
  type: z.union([z.literal(CardType.ROBINSON), z.literal(CardType.KNOWLEDGE)]),
  score: z.number(),
  action: z.union([z.string(), z.object({})]), // แนะนำให้ใช้ z.string().regex(/^[a-f\d]{24}$/i) ถ้าเป็น ObjectId
  token: z.number()
})

// Schema สำหรับ AgeCard (extends Robinson)
const ageCardSchema = robinsonCardSchema.extend({
  type: z.literal(CardType.AGE),
  level: z.union([z.literal(1), z.literal(2)])
})

// Union Schema
export const cardSchema = z.discriminatedUnion('type', [
  dangerCardSchema,
  robinsonCardSchema,
  ageCardSchema
])

// สำหรับ validate array
export const cardArraySchema = z.array(cardSchema)
