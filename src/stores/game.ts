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

export type ChatLogs = {
  role: 'system' | 'player'
  message: string
  send: Date
}

type GameStore = {
  field: 0 | 1 | 2
  health: number
  drawPoint: number
  robinsonCard: Card[]
  dangerCard: Card[]
  knowledgeCard: Card[]
  ageCard: Card[]
  onDeck: Card[]
  onHand: Card[]
  trash: Card[]
  //
  onDraw: boolean
  dangerSelected: Danger
  dangerScore: number
  //
  chatLogs: ChatLogs[]
  addChat: (logs: ChatLogs) => void
  //
  setDanger: (danger: Danger) => void
  setDangerScore: (score: number) => void
  score: () => number

  //
  setup: (card: Card[]) => Promise<boolean>
  loadSave: () => void
  //
  drawCard: () => Card | null
  adventureCard: () => Danger[]
  setDrawPoint: (point: number) => void
  setHealth: (point: number) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  field: 0 as 0 | 1 | 2, // field level
  health: 20, // health
  drawPoint: 0, // draw point
  dangerSelected: {} as Danger, // danger selected
  score: () => get().onHand.reduce((sum, item) => sum + item.score! || 0, 0), // score on hand
  robinsonCard: [], // robinson card
  dangerCard: [], // dangerous card
  knowledgeCard: [], // knowledge card
  ageCard: [], // age card
  onDeck: [], // card on deck
  onHand: [], //
  trash: [],
  onDraw: false,
  dangerScore: 0,
  //
  chatLogs: [],
  addChat: (logs) => {
    set((state) => ({ chatLogs: [...state.chatLogs, logs] }))
  },
  //
  setDanger: (danger) => {
    const { field } = get()
    set(() => ({
      dangerSelected: danger,
      dangerScore: danger.danger.danger![field],
      drawPoint: danger.danger.pick,
      onDraw: true
    }))
  },
  setDangerScore: (score) =>
    set((state) => ({ dangerScore: state.dangerScore + score })),
  loadSave: () => {
    const save = localStorage.getItem('save') as string
    const saveObj = JSON.parse(save)
    set(() => ({ ...saveObj }))
  },
  setHealth: (point) => set((state) => ({ health: state.health + point })),
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
    const drawPoint = get().drawPoint
    const cards = get().robinsonCard

    if (!drawPoint) return null
    if (cards.length === 0) return null
    const [firstCard, ...remaining] = cards
    set((state) => ({
      robinsonCard: remaining,
      onHand: [...state.onHand, firstCard],
      drawPoint: state.drawPoint - 1
    }))
    return firstCard
  },
  adventureCard: () => {
    const dangerCards = get().dangerCard
    const knowledgeCards = get().knowledgeCard

    const pairs: Danger[] = []

    for (let i = 0; i < 2; i++) {
      if (dangerCards.length > 0 && knowledgeCards.length > 0) {
        const danger = dangerCards.splice(0, 1)[0]
        const knowledge = knowledgeCards.splice(0, 1)[0]

        pairs.push({ danger, knowledge })
      }
    }

    // อัปเดต state หลังจากลบการ์ดออกจาก array
    set({
      dangerCard: dangerCards,
      knowledgeCard: knowledgeCards
    })

    return pairs
  }
}))
