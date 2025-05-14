import { Card } from '@/types/card'
import { create } from 'zustand'
import { shuffle } from 'lodash'

type GameStore = {
  field: 1 | 2 | 3
  health: number
  robinsonCard: Card[]
  ageCard: Card[]
  onDeck: Card[]
  onHand: Card[]
  trash: Card[]
  score: () => number

  //
  setup: (card: Card[]) => boolean
  drawCard: () => Card | null
}

export const useGameStore = create<GameStore>((set, get) => ({
  field: 1,
  health: 20,
  score: () => get().onHand.reduce((sum, item) => sum + item.score! || 0, 0),
  robinsonCard: [],
  ageCard: [],
  onDeck: [],
  onHand: [],
  trash: [],
  setup: (card) => {
    const robinson = card.filter((card) => card.type == 'ROBINSON')
    const age = card.filter((card) => card.type == 'AGE')
    const robinsonEx = robinson.flatMap((card) =>
      Array.from({ length: card.quantity }, () => ({ ...card }))
    )
    set(() => ({
      ageCard: age,
      robinsonCard: shuffle([...robinsonEx, ...age])
    }))
    return true
  },
  drawCard: () => {
    const cards = get().robinsonCard
    if (cards.length === 0) return null
    const [firstCard, ...remaining] = cards
    set((state) => ({
      robinsonCard: remaining,
      onHand: [...state.onHand, firstCard]
    }))
    return firstCard
  }
}))
