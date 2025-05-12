import { Action } from '@/models/actions'
import { IResponse } from '@/types/services'
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
