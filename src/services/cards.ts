
import { Card, CardType } from '@/types/card';
import { IPagination, IResponse, Query } from '@/types/services'
import axios, { AxiosError } from 'axios'

// Interface for card query parameters
export interface CardQuery extends Query {
  type?: CardType
}

export async function CreateCardService(
  card: Omit<Card, '_id'>
): Promise<IResponse<Card>> {
  try {
    const { data: result } = await axios.post<IResponse<Card>>(
      '/api/card',
      card
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Card creation failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to create card due to server error',
        data: error.response?.data?.errors
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating the card'
    }
  }
}

export async function GetCardsService({
  limit,
  page,
  type
}: CardQuery = {}): Promise<IResponse<IPagination<Card>>> {
  try {
    const params: CardQuery = {}
    if (limit !== undefined) params.limit = limit
    if (page !== undefined) params.page = page
    if (type !== undefined) params.type = type

    const { data: result } = await axios.get<IResponse<IPagination<Card>>>(
      '/api/card',
      { params }
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Cards retrieval failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to get cards due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while retrieving the cards'
    }
  }
}

export async function UpdateCardService(
  id: string,
  card: Omit<Card, '_id'>
): Promise<IResponse<Card>> {
  try {
    const { data: result } = await axios.put<IResponse<Card>>(
      `/api/card/${id}`,
      card
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Card update failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to update card due to server error',
        data: error.response?.data?.errors
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while updating the card'
    }
  }
}

export async function GetCardByIdService(id: string): Promise<IResponse<Card>> {
  try {
    const { data: result } = await axios.get<IResponse<Card>>(
      `/api/card/${id}`
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Card not found')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to get card due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while fetching the card'
    }
  }
}

export async function DeleteCardService(id: string): Promise<IResponse<null>> {
  try {
    const { data: result } = await axios.delete<IResponse<null>>(
      `/api/card/${id}`
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Card deletion failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to delete card due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while deleting the card'
    }
  }
}

// Additional service functions for specific card operations

export async function GetCardsByTypeService(
  type: CardType,
  query: Query = {}
): Promise<IResponse<IPagination<Card>>> {
  return GetCardsService({ ...query, type })
}

export async function GetDangerCardsService(
  query: Query = {}
): Promise<IResponse<IPagination<Card>>> {
  return GetCardsByTypeService(CardType.DANGER, query)
}

export async function GetRobinsonCardsService(
  query: Query = {}
): Promise<IResponse<IPagination<Card>>> {
  return GetCardsByTypeService(CardType.ROBINSON, query)
}

export async function GetKnowledgeCardsService(
  query: Query = {}
): Promise<IResponse<IPagination<Card>>> {
  return GetCardsByTypeService(CardType.KNOWLEDGE, query)
}

export async function GetAgeCardsService(
  query: Query = {}
): Promise<IResponse<IPagination<Card>>> {
  return GetCardsByTypeService(CardType.AGE, query)
}
