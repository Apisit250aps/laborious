import { ObjectId } from 'mongodb'
import { Action } from './actions'
import { db } from '@/client'

export enum CardType {
  DANGER = 'DANGER',
  ROBINSON = 'ROBINSON',
  KNOWLEDGE = 'KNOWLEDGE',
  AGE = 'AGE'
}

export interface Card {
  _id?: ObjectId
  title: string
  type: CardType
  // สำหรับ DANGER
  pick?: number
  danger?: number[]
  // สำหรับ ROBINSON, KNOWLEDGE, AGE
  score?: number
  action?: Action | ObjectId
  token?: number
  // เฉพาะ AGE
  level?: 1 | 2
}

const cards = db.collection<Card>('cards')

export default cards
