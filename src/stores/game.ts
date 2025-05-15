import { Card } from '@/types/card'
import { create } from 'zustand'
import { shuffle } from 'lodash'

const extractCard = (card: Card[]) =>
  card.flatMap((card) =>
    Array.from({ length: card.quantity }, () => ({ ...card }))
  )

export type Danger = {
  danger: Card
  knowledge: Card
}

type GameStore = {
  field: 1 | 2 | 3
  health: number
  drawPoint: number
  robinsonCard: Card[]
  dangerCard: Card[]
  knowledgeCard: Card[]
  ageCard: Card[]
  onDeck: Card[]
  onHand: Card[]
  trash: Card[]
  score: () => number
  //
  setup: (card: Card[]) => Promise<boolean>
  loadSave: () => void
  //
  drawCard: () => Card | null
  adventureCard: () => Danger[]
  setDrawPoint: (point: number) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  field: 1 as 1 | 2 | 3,
  health: 20,
  drawPoint: 0,
  score: () => get().onHand.reduce((sum, item) => sum + item.score! || 0, 0),
  robinsonCard: [],
  dangerCard: [],
  knowledgeCard: [],
  ageCard: [],
  onDeck: [],
  onHand: [],
  trash: [],
  loadSave: () => {
    const save = localStorage.getItem('save') as string
    const saveObj = JSON.parse(save)
    set(() => ({ ...saveObj }))
  },
  setup: async (card) => {
    const robinson = card.filter(({ type }) => type == 'ROBINSON')
    const age = card.filter(({ type }) => type == 'AGE')
    const danger = card.filter(({ type }) => type == 'DANGER')
    const knowledge = card.filter(({ type }) => type == 'KNOWLEDGE')
    // extract
    const robinsonExt = extractCard(robinson)
    const ageExt = extractCard(age)
    const dangerExt = extractCard(danger)
    const knowledgeExt = extractCard(knowledge)
    // set
    set(() => ({
      ageCard: age,
      robinsonCard: shuffle([...robinsonExt, ...ageExt]),
      dangerCard: shuffle([...dangerExt]),
      knowledgeCard: shuffle([...knowledgeExt])
    }))
    return true
  },
  setDrawPoint: (point) =>
    set((state) => ({ drawPoint: state.drawPoint + point })),
  drawCard: () => {
    const cards = get().robinsonCard
    if (cards.length === 0) return null
    const [firstCard, ...remaining] = cards
    set((state) => ({
      robinsonCard: remaining,
      onHand: [...state.onHand, firstCard]
    }))
    return firstCard
  },
  adventureCard: () => {
    const dangerCards = get().dangerCard
    const knowledgeCards = get().knowledgeCard

    const pairs: Danger[] = []

    for (let i = 0; i < 2; i++) {
      if (dangerCards[i] && knowledgeCards[i]) {
        pairs.push({
          danger: dangerCards[i],
          knowledge: knowledgeCards[i]
        })
      }
    }
    return pairs
  }
}))
