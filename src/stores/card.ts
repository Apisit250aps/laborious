import { GetCardsService } from '@/services/cards'
import { Card } from '@/types/card'
import { Pagination } from '@/types/services'
import { create } from 'zustand'

type CardStore = {
  cards: Card[]
  pagination: Pagination
  loadCards: () => Promise<void>
  setPagination: (pagination: Pagination) => void
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  pagination: {
    totalCount: 0,
    page: 0,
    limit: 0,
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
          cards: result.data?.data,
          pagination: {
            totalCount: result.data!.totalCount,
            page: result.data!.page,
            limit: result.data!.limit,
            totalPages: result.data!.totalCount
          }
        }))
        return
      }
      throw new Error(result.message)
    } catch (error) {
      console.error(error)
      return
    }
  },
  setPagination: (pagination) => set(() => ({ pagination }))
}))
