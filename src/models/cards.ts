
import { db } from '@/client'
import { Card } from '@/types/card';


const cards = db.collection<Card>('cards')

export default cards
