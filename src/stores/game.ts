import { create } from 'zustand'
import { shuffle } from 'lodash'
import { Card } from '@/types/card'
import { GetCardsService } from '@/services/cards'

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
  id: number
}
type ChatType = 'error' | 'success' | 'warning' | 'info'

export type ChatLogs = {
  role: 'system' | 'player'
  message: string
  send: Date
  type?: ChatType
}

type GameStore = {
  // Core status
  field: 0 | 1 | 2
  round: number
  health: number
  drawPoint: number
  onGameStart: boolean
  win: number
  lose: number
  // Card groups
  cards: Card[]
  robinsonCard: Card[]
  dangerCard: Card[]
  knowledgeCard: Card[]
  ageCard: Card[]
  onDeck: Card[]
  onHand: HandCard[]
  onDestroy: Card[]
  onGraveyard: Card[]

  // Game states
  onDraw: boolean
  dangerSelected: Danger | null

  // Chat
  chatLogs: ChatLogs[]

  // --- Actions ---
  setDrawPoint: (point: number) => void
  setHealth: (point: number) => void
  setOnDraw: (state: boolean) => void
  setDanger: (danger: Danger, allDangers: Danger[]) => void
  setChat: (logs: ChatLogs) => void
  setFight: (danger: Danger) => void
  setWhiteFlag: (danger: Danger) => void

  // --- Game logic ---
  setup: () => Promise<boolean>
  loadCard: () => Promise<void>
  loadSave: () => Promise<void>
  save: () => void
  drawCard: () => Card | null
  adventureCard: () => Danger[]
  attackScore: () => number
  dangerScore: () => number
  setEndRound: () => void
  ageCardAction: (card: Card) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // --- State Initialization ---
  field: 0 as 0 | 1 | 2,
  round: 1,
  health: 20,
  win: 0,
  lose: 0,
  drawPoint: 0,
  dangerSelected: null,

  onDraw: false,
  onGameStart: false,

  // Cards
  cards: [],
  robinsonCard: [],
  dangerCard: [],
  knowledgeCard: [],
  ageCard: [],
  onDeck: [],
  onHand: [],
  onDestroy: [],
  onGraveyard: [],
  // Chat
  chatLogs: [],

  // --- Core Functions ---
  setDrawPoint: (point) =>
    set((state) => ({ drawPoint: state.drawPoint + point })),

  setHealth: (point) => set((state) => ({ health: state.health + point })),

  setOnDraw: (onDraw) => set(() => ({ onDraw })),
  setDanger: (danger, allDangers) => {
    const { onDeck } = get()

    const unchosen = allDangers.filter((d) => d.id !== danger.id)

    // เอาการ์ด danger/knowledge จาก danger ที่ไม่ได้เลือก
    const toDeck = unchosen.flatMap((d) => [d.danger, d.knowledge])

    set(() => ({
      dangerSelected: danger,
      drawPoint: danger.danger.pick,
      onDraw: true,
      onGraveyard: [...onDeck, ...toDeck]
    }))
  },
  setChat: (log) => set((state) => ({ chatLogs: [...state.chatLogs, log] })),

  attackScore: () =>
    get().onHand.reduce((sum, item) => sum + (item.score ?? 0), 0),
  dangerScore: () => {
    const { field, dangerSelected } = get()

    const danger = dangerSelected ? dangerSelected.danger.danger![field] : 0
    return danger - get().attackScore()
  },
  setFight: (danger) => {
    const { onHand } = get()
    const handCard = onHand.map((card) => {
      const { isActive, ...rest } = card
      console.log(isActive)
      return rest
    })

    set((state) => ({
      onDeck: [...state.onDeck, danger.knowledge, ...handCard],
      onDestroy: [...state.onDestroy, danger.danger],
      win: state.win + 1,
      onHand: []
    }))
  },

  setWhiteFlag: (danger) => {
    const { onHand, dangerScore } = get()
    const handCard = onHand.map((card) => {
      const { isActive, ...rest } = card
      console.log(isActive)
      return rest
    })
    set((state) => ({
      onDeck: [...state.onDeck, ...handCard],
      onHand: [],
      health: state.health - dangerScore(),
      lose: state.lose + 1,
      onGraveyard: [...state.onGraveyard, danger.knowledge, danger.danger]
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
      onHand: [...onHand, { ...card, isActive: true, id: onHand.length }],
      drawPoint: drawPoint - 1
    }))

    return card
  },
  adventureCard: () => {
    let dangerCards = [...get().dangerCard]
    let knowledgeCards = [...get().knowledgeCard]

    const onDeck = [...get().onGraveyard]

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
  setup: async () => {
    await get().loadCard()

    const cards = get().cards
    const byType = (type: string) => cards.filter((card) => card.type === type)
    const robinsonExt = extractCard(byType('ROBINSON'))
    const ageExt = extractCard(byType('AGE'))
    const dangerExt = extractCard(byType('DANGER'))
    const knowledgeExt = extractCard(byType('KNOWLEDGE'))

    set(() => ({
      ageCard: shuffle(ageExt),
      robinsonCard: shuffle([...robinsonExt, ...shuffle(ageExt)]),
      dangerCard: shuffle(dangerExt),
      knowledgeCard: shuffle(knowledgeExt),
      onGameStart: true
    }))
    return true
  },

  loadCard: async () => {
    const { success, message, data } = await GetCardsService({ limit: 1000 })
    if (success) {
      set(() => ({ cards: data!.data }))
    } else {
      throw new Error(message)
    }
    return
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
    set((state) => ({
      round: state.round + 1,
      onDraw: false,
      drawPoint: 0,
      dangerSelected: null
    })),
  ageCardAction: (card) => {
    const { codex, value } = card.actionData!
    switch (codex) {
      case 'HP':
        set((state) => ({ health: state.health + value }))
        break
      case 'CARD':
        set((state) => ({ drawPoint: state.drawPoint + value }))
        break
      case 'STOP':
        set(() => ({ drawPoint: 0 }))
        break
      case 'ZERO':
        set((state) => {
          const maxScore = Math.max(...state.onHand.map((c) => c.score ?? 0))
          const newHand = state.onHand.map((c) =>
            (c.score ?? 0) === maxScore ? { ...c, score: 0 } : c
          )
          return { onHand: newHand }
        })
        break
      default:
        break
    }
  }
}))
