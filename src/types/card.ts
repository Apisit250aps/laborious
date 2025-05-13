import { Action } from '@/models/actions'
import { ObjectId } from 'mongodb'

export enum CardType {
  DANGER = 'DANGER',
  ROBINSON = 'ROBINSON',
  KNOWLEDGE = 'KNOWLEDGE',
  AGE = 'AGE'
}

export interface Card extends Document {
  _id?: ObjectId | string
  title: string
  type: CardType
  quantity: number
  // สำหรับ DANGER
  pick?: number
  danger?: number[]
  // สำหรับ ROBINSON, KNOWLEDGE, AGE
  score?: number
  action?: ObjectId | string
  actionData?: Action
  token?: number
  // เฉพาะ AGE
  level?: 1 | 2
}
