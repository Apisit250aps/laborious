import { ObjectId } from 'mongodb'
import { Action } from './actions'
import { db } from '@/client'

export enum CardType {
  DANGER = 'DANGER',
  ROBINSON = 'ROBINSON',
  KNOWLEDGE = 'KNOWLEDGE',
  AGE = 'AGE'
}

interface BaseCard {
  _id?: ObjectId
  title: string
  type: CardType
}

export interface RobinsonCard extends BaseCard {
  type: CardType.ROBINSON | CardType.KNOWLEDGE
  score: number
  action: Action | ObjectId  
  token: number
}

export interface AgeCard extends BaseCard {
  type: CardType.AGE
  score: number
  action: Action | ObjectId
  token: number
  level: 1 | 2
}

export interface DangerCard extends BaseCard {
  type: CardType.DANGER
  pick: number
  danger: number[]
}

export type Card = RobinsonCard | AgeCard | DangerCard

const cards = db.collection<Card>('cards')

export default cards
