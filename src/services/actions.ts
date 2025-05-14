
import { Action } from '@/types/action';
import { IPagination, IResponse, Query } from '@/types/services'
import axios, { AxiosError } from 'axios'

export async function CreateActionService(
  action: Action
): Promise<IResponse<Action>> {
  try {
    const { data: result } = await axios.post<IResponse<Action>>(
      '/api/action',
      action
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Action creation failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to create action due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating the action'
    }
  }
}

export async function GetActionService({
  limit,
  page
}: Query): Promise<IResponse<IPagination<Action>>> {
  try {
    const { data: result } = await axios.get<IResponse<IPagination<Action>>>(
      '/api/action',
      { params: { limit, page } }
    )
    if (result.success) {
      return result
    }
    throw new Error(result.message || 'Action get failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          'Failed to get action due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while get the action'
    }
  }
}

export async function UpdateActionService(
  id: string,
  action: Action
): Promise<IResponse<Action>> {
  try {
    const { data: result } = await axios.put<IResponse<Action>>(
      `/api/action/${id}`,
      action
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Action update failed')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? 'Failed to update action due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while updating the action'
    }
  }
}


export async function GetActionByIdService(id: string): Promise<IResponse<Action>> {
  try {
    const { data: result } = await axios.get<IResponse<Action>>(
      `/api/action/${id}`
    )

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Action not found')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? 'Failed to get action due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while fetching the action'
    }
  }
}

export async function DeleteActionService(id: string): Promise<IResponse<null>> {
  try {
    const { data: result } = await axios.delete<IResponse<null>>(`/api/action/${id}`)

    if (result.success) {
      return result
    }

    throw new Error(result.message || 'Failed to delete action')
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? 'Failed to delete action due to server error'
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while deleting the action'
    }
  }
}
