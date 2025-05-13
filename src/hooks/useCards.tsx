import { GetCardsService } from '@/services/cards'
import { useCardStore } from '@/stores/card'
import { useQuery } from '@tanstack/react-query'

export function useCard() {
  const { pagination, setPagination } = useCardStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['cards', pagination.page, pagination.limit],
    queryFn: async () => {
      const result = await GetCardsService({
        page: pagination.page,
        limit: pagination.limit
      })

      if (result.success) {
        setPagination({
          page: result.data!.page,
          limit: result.data!.limit,
          totalCount: result.data!.totalCount,
          totalPages: result.data!.totalPages
        })
        return result.data?.data || []
      }

      throw new Error(result.message || 'Failed to fetch cards')
    }
  })
  return { cards: data, isLoading, error, pagination, setPagination }
}