import { db } from '@/client'
import { Document } from 'mongodb'

export interface Action extends Document {
  title: string
  description?: string
}

const actions = db.collection<Action>('actions')

export default actions
