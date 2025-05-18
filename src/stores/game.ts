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
  id: number
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
  onGameStart: boolean

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
  setDanger: (danger: Danger, allDangers: Danger[]) => void
  setDangerScore: (score: number) => void
  setChat: (logs: ChatLogs) => void
  setFight: (danger: Danger) => void
  setWhiteFlag: (danger: Danger) => void

  // --- Game logic ---
  setup: (cards: Card[]) => Promise<boolean>
  loadSave: () => Promise<void>
  save: () => void
  drawCard: () => Card | null
  adventureCard: () => Danger[]
  score: () => number
  setEndRound: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // --- State Initialization ---
  field: 0 as 0 | 1 | 2,
  health: 200,
  drawPoint: 0,
  dangerSelected: {} as Danger,
  dangerScore: 0,
  onDraw: false,
  onGameStart: false,

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

  setDanger: (danger, allDangers) => {
    const { field, onDeck } = get()

    const unchosen = allDangers.filter((d) => d.id !== danger.id)

    // เอาการ์ด danger/knowledge จาก danger ที่ไม่ได้เลือก
    const toDeck = unchosen.flatMap((d) => [d.danger, d.knowledge])

    set(() => ({
      dangerSelected: danger,
      dangerScore: danger.danger.danger?.[field] ?? 0,
      drawPoint: danger.danger.pick,
      onDraw: true,
      onDeck: [...onDeck, ...toDeck]
    }))
  },
  setChat: (log) => set((state) => ({ chatLogs: [...state.chatLogs, log] })),

  score: () => get().onHand.reduce((sum, item) => sum + (item.score ?? 0), 0),
  setFight: (danger) => {
    const { onHand } = get()
    const handCard = onHand.map((card) => {
      const { isActive, ...rest } = card
      console.log(isActive)
      return rest
    })
    set((state) => ({
      onDeck: [...state.onDeck, danger.knowledge, ...handCard],
      trash: [...state.trash, danger.danger],
      onHand: []
    }))
  },

  setWhiteFlag: (danger) => {
    const { onHand } = get()
    const handCard = onHand.map((card) => {
      const { isActive, ...rest } = card
      console.log(isActive)
      return rest
    })
    set((state) => ({
      onDeck: [...state.onDeck, danger.knowledge, danger.danger, ...handCard],
      onHand: []
    }))
  },
  // --- Card Mechanics ---
  drawCard: () => {
    const state = get()

    // ถ้า drawPoint หมด ก็ไม่สามารถจั่วได้
    if (state.drawPoint <= 0) return null

    // ถ้า robinsonCard หมด → เอาจาก onDeck มาเติม
    if (state.robinsonCard.length === 0) {
      const newDeck = [...state.onDeck]
      const robinsonDeck = newDeck.filter((c) =>
        ['ROBINSON', 'AGE', 'KNOWLEDGE'].includes(c.type)
      )
      const [age, ...a] = get().ageCard
      const remainingDeck = newDeck.filter(
        (c) => !['ROBINSON', 'AGE', 'KNOWLEDGE'].includes(c.type)
      )

      console.log(a)

      const reshuffled = shuffle([...robinsonDeck, age])

      set(() => ({
        robinsonCard: reshuffled,
        onDeck: remainingDeck
      }))
    }

    // หลังจากเติมแล้ว ลองจั่วอีกที (ใช้ get() ใหม่เพื่อดึงค่าอัปเดต)
    const { robinsonCard, drawPoint, onHand } = get()
    if (robinsonCard.length === 0) return null

    const [card, ...remaining] = robinsonCard

    set(() => ({
      robinsonCard: remaining,
      onHand: [...onHand, { ...card, isActive: true }],
      drawPoint: drawPoint - 1
    }))

    return card
  },
  adventureCard: () => {
    let dangerCards = [...get().dangerCard]
    let knowledgeCards = [...get().knowledgeCard]

    const onDeck = [...get().onDeck]

    // ถ้า danger หรือ knowledge หมด → ดึงจาก onDeck มาเติม และเพิ่ม field
    if (dangerCards.length === 0 || knowledgeCards.length === 0) {
      const newDangerCards = onDeck.filter((c) => c.type === 'DANGER')
      const newKnowledgeCards = onDeck.filter((c) => c.type === 'KNOWLEDGE')
      const remainingDeck = onDeck.filter(
        (c) => !['DANGER', 'KNOWLEDGE'].includes(c.type)
      )

      dangerCards = shuffle(newDangerCards)
      knowledgeCards = shuffle(newKnowledgeCards)

      set((state) => ({
        onDeck: remainingDeck,
        field: (state.field + 1) as 0 | 1 | 2
      }))
    }

    const pairs: Danger[] = []

    for (let i = 0; i < 2; i++) {
      if (dangerCards.length === 0 || knowledgeCards.length === 0) break

      const danger = dangerCards.splice(0, 1)[0]
      const knowledge = knowledgeCards.splice(0, 1)[0]
      pairs.push({ danger, knowledge, id: i })
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
      ageCard: shuffle(ageExt),
      robinsonCard: shuffle([...robinsonExt]),
      dangerCard: shuffle(dangerExt),
      knowledgeCard: shuffle(knowledgeExt),
      onGameStart: true
    }))
    return true
  },

  loadSave: async () => {
    const save = localStorage.getItem('save')
    if (!save) return
    try {
      const saveObj = JSON.parse(save)
      set(() => ({ ...saveObj }))
    } catch (err) {
      console.error('Failed to load save:', err)
    }
  },
  save: () => {
    const store = get()
    const save = JSON.stringify(store)
    localStorage.setItem('save', save)
  },
  setEndRound: () =>
    set(() => ({
      onDraw: false,
      drawPoint: 0,
      dangerScore: 0,
      dangerSelected: {} as Danger
    }))
}))
