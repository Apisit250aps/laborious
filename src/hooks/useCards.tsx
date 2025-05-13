
import { GetCardsService } from '@/services/cards';
import { Pagination } from '@/types/services';
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function useCard() {
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    page: 1,
    totalCount: 0,
    totalPages: 0
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ['cards', pagination.page, pagination.limit],
    queryFn: async () => {
      const result = await GetCardsService({
        page: pagination.page,
        limit: pagination.limit
      })
     
      if (result.success) {
        setPagination((prev) => ({
          ...prev,
          totalCount: result.data!.totalCount,
          totalPages: result.data!.totalPages
        }))
        return result.data?.data || []
      }

      throw new Error(result.message || 'Failed to fetch cards')
    }
  })
  return { cards: data, isLoading, error, pagination, setPagination }
}