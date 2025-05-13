
import { GetActionService } from '@/services/actions';
import { Pagination } from '@/types/services';
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function useActions() {
  const [pagination, setPagination] = useState<Pagination>({
    limit: 100,
    page: 1,
    totalCount: 0,
    totalPages: 0
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ['actions', pagination.page, pagination.limit],
    queryFn: async () => {
      const result = await GetActionService({
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

      throw new Error(result.message || 'Failed to fetch actions')
    }
  })
  return { actions: data, isLoading, error, pagination, setPagination }
}