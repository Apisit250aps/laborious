import { create } from 'zustand'
import { shuffle } from 'lodash'
import { Card } from '@/types/card'

/** Utility: สร้างสำเนาการ์ดตาม quantity */
const extractCard = (cards: Card[]) =>
  cards.flatMap((card) =>
    Array.from({ length: card.quantity }, () => ({ ...card }))
  )

/** ประเภทการ์ดผจญภัย */
export type Danger = {
  danger: Card
  knowledge: Card
}

export interface HandCard extends Card {
  isActive: boolean
}

export type ChatLogs = {
  role: 'system' | 'player'
  message: string
  send: Date
}

type GameStore = {
  // Core status
  field: 0 | 1 | 2
  health: number
  drawPoint: number

  // Card groups
  robinsonCard: Card[]
  dangerCard: Card[]
  knowledgeCard: Card[]
  ageCard: Card[]
  onDeck: Card[]
  onHand: HandCard[]
  trash: Card[]

  // Game states
  onDraw: boolean
  dangerSelected: Danger
  dangerScore: number

  // Chat
  chatLogs: ChatLogs[]

  // --- Actions ---
  setDrawPoint: (point: number) => void
  setHealth: (point: number) => void
  setOnDraw: (state: boolean) => void
  setDanger: (danger: Danger) => void
  setDangerScore: (score: number) => void
  setChat: (logs: ChatLogs) => void
  setFight: (danger: Danger) => void
  setWhiteFlag: (danger: Danger) => void

  // --- Game logic ---
  setup: (cards: Card[]) => Promise<boolean>
  loadSave: () => void
  drawCard: () => Card | null
  adventureCard: () => Danger[]
  score: () => number
  setEndRound: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // --- State Initialization ---
  field: 0,
  health: 20,
  drawPoint: 0,
  dangerSelected: {} as Danger,
  dangerScore: 0,
  onDraw: false,

  // Cards
  robinsonCard: [],
  dangerCard: [],
  knowledgeCard: [],
  ageCard: [],
  onDeck: [],
  onHand: [],
  trash: [],

  // Chat
  chatLogs: [],

  // --- Core Functions ---
  setDrawPoint: (point) =>
    set((state) => ({ drawPoint: state.drawPoint + point })),

  setHealth: (point) => set((state) => ({ health: state.health + point })),

  setOnDraw: (onDraw) => set(() => ({ onDraw })),

  setDangerScore: (score) =>
    set((state) => ({ dangerScore: state.dangerScore + score })),

  setDanger: (danger) => {
    const { field } = get()
    set(() => ({
      dangerSelected: danger,
      dangerScore: danger.danger.danger?.[field] ?? 0,
      drawPoint: danger.danger.pick,
      onDraw: true
    }))
  },

  setChat: (log) => set((state) => ({ chatLogs: [...state.chatLogs, log] })),

  score: () => get().onHand.reduce((sum, item) => sum + (item.score ?? 0), 0),
  setFight: (danger) => {
    set((state) => ({
      onDeck: [...state.onDeck, danger.knowledge],
      trash: [...state.trash, danger.danger]
    }))
  },
  setWhiteFlag: (danger) => {
    set((state) => ({
      onDeck: [...state.onDeck, danger.knowledge, danger.danger]
    }))
  },
  // --- Card Mechanics ---
  drawCard: () => {
    const state = get()
    if (state.drawPoint <= 0 || state.robinsonCard.length === 0) return null

    const [card, ...remaining] = state.robinsonCard
    set(() => ({
      robinsonCard: remaining,
      onHand: [...state.onHand, { ...card, isActive: true }],
      drawPoint: state.drawPoint - 1
    }))
    return card
  },

  adventureCard: () => {
    const dangerCards = [...get().dangerCard]
    const knowledgeCards = [...get().knowledgeCard]
    const pairs: Danger[] = []

    for (let i = 0; i < 2; i++) {
      if (dangerCards.length === 0 || knowledgeCards.length === 0) break

      const danger = dangerCards.splice(0, 1)[0]
      const knowledge = knowledgeCards.splice(0, 1)[0]
      pairs.push({ danger, knowledge })
    }

    set({
      dangerCard: dangerCards,
      knowledgeCard: knowledgeCards
    })

    return pairs
  },

  setup: async (cards) => {
    const byType = (type: string) => cards.filter((card) => card.type === type)

    const robinsonExt = extractCard(byType('ROBINSON'))
    const ageExt = extractCard(byType('AGE'))
    const dangerExt = extractCard(byType('DANGER'))
    const knowledgeExt = extractCard(byType('KNOWLEDGE'))

    set(() => ({
      ageCard: byType('AGE'),
      robinsonCard: shuffle([...robinsonExt, ...ageExt]),
      dangerCard: shuffle(dangerExt),
      knowledgeCard: shuffle(knowledgeExt)
    }))

    return true
  },

  loadSave: () => {
    const save = localStorage.getItem('save')
    if (!save) return
    try {
      const saveObj = JSON.parse(save)
      set(() => ({ ...saveObj }))
    } catch (err) {
      console.error('Failed to load save:', err)
    }
  },
  setEndRound: () =>
    set(() => ({
      onDraw: false,
      drawPoint: 0,
      dangerScore: 0,
      dangerSelected: {} as Danger
    }))
}))
