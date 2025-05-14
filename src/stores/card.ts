import {
  GetCardsService,
  DeleteCardService,
  CreateCardService,
  UpdateCardService
} from '@/services/cards'
import { Card } from '@/types/card'
import { Pagination } from '@/types/services'
import { create } from 'zustand'

type CardStore = {
  cards: Card[]
  pagination: Pagination
  loadCards: () => Promise<boolean>
  setPagination: (pagination: Pagination) => void
  addCard: (card: Card) => Promise<Card>
  editCard: (id: string, card: Card) => Promise<Card>
  deleteCard: (id: string) => Promise<void>
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  pagination: {
    totalCount: 0,
    page: 1,
    limit: 1000,
    totalPages: 0
  },

  loadCards: async () => {
    try {
      const {
        pagination: { limit, page }
      } = get()
      const result = await GetCardsService({ limit, page })
      if (result.success) {
        set(() => ({
          cards: result.data?.data || [],
          pagination: {
            totalCount: result.data!.totalCount,
            page: result.data!.page,
            limit: result.data!.limit,
            totalPages: Math.ceil(result.data!.totalCount / result.data!.limit)
          }
        }))
        return result.success 
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error(error)
      return false
    }
  },

  setPagination: (pagination) => set(() => ({ pagination })),

  addCard: async (card: Card) => {
    const result = await CreateCardService(card)
    if (result.success && result.data) {
      set((state) => ({
        cards: [...state.cards, result.data!]
      }))
      return result.data
    } else {
      throw new Error(result.message)
    }
  },

  editCard: async (id: string, card: Card) => {
    const result = await UpdateCardService(id, card)
    if (result.success && result.data) {
      set((state) => ({
        cards: state.cards.map((c) => (c._id === id ? result.data! : c))
      }))
      return result.data
    } else {
      throw new Error(result.message)
    }
  },

  deleteCard: async (id: string) => {
    const result = await DeleteCardService(id)
    if (result.success) {
      set((state) => ({
        cards: state.cards.filter((c) => c._id !== id)
      }))
    } else {
      throw new Error(result.message)
    }
  }
}))
