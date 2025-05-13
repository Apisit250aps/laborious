import { db } from '@/client'
import { Document, ObjectId } from 'mongodb'

export interface Action extends Document {
  _id?: ObjectId
  title: string
  codex: string
  description?: string
}

const actions = db.collection<Action>('actions')

export default actions
