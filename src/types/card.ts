import { Action } from "@/models/actions";
import { ObjectId } from "mongodb";

export enum CardType {
  DANGER = 'DANGER',
  ROBINSON = 'ROBINSON',
  KNOWLEDGE = 'KNOWLEDGE',
  AGE = 'AGE'
}

export interface Card extends Document {
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