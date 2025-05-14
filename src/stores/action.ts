import { create } from 'zustand'
import { Pagination } from '@/types/services'
import { Action } from '@/types/action'
import {
  CreateActionService,
  DeleteActionService,
  GetActionService,
  UpdateActionService
} from '@/services/actions'

type ActionStore = {
  actions: Action[]
  pagination: Pagination
  loadActions: () => Promise<void>
  setPagination: (pagination: Pagination) => void
  addAction: (action: Action) => Promise<Action>
  editAction: (id: string, action: Action) => Promise<Action>
  deleteAction: (id: string) => Promise<void>
}

export const useActionStore = create<ActionStore>((set, get) => ({
  actions: [],
  pagination: {
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },

  loadActions: async () => {
    try {
      const {
        pagination: { limit, page }
      } = get()
      const result = await GetActionService({ limit, page })
      if (result.success && result.data) {
        set(() => ({
          actions: result.data!.data,
          pagination: {
            totalCount: result.data!.totalCount,
            page: result.data!.page,
            limit: result.data!.limit,
            totalPages: result.data!.totalPages
          }
        }))
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error(error)
    }
  },

  setPagination: (pagination) => set(() => ({ pagination })),

  addAction: async (action: Action) => {
    const result = await CreateActionService(action)
    if (result.success && result.data) {
      set((state) => ({
        actions: [...state.actions, result.data!.data]
      }))
      return result.data
    } else {
      throw new Error(result.message)
    }
  },

  editAction: async (id: string, action: Action) => {
    const result = await UpdateActionService(id, action)
    if (result.success && result.data) {
      set((state) => ({
        actions: state.actions.map((a) => (a._id === id ? result.data! : a))
      }))
      return result.data
    } else {
      throw new Error(result.message)
    }
  },

  deleteAction: async (id: string) => {
    const result = await DeleteActionService(id)
    if (result.success) {
      set((state) => ({
        actions: state.actions.filter((a) => a._id?.toString() !== id)
      }))
    } else {
      throw new Error(result.message)
    }
  }
}))
