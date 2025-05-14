import { ObjectId, Document } from "mongodb";

export interface Action extends Document {
  _id?: ObjectId | string
  title: string
  codex: string
  description?: string
}