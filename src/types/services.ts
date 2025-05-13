export interface IResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}
export interface IPagination<T = unknown> {
  data: T[]
  page: number
  limit: number
  totalPages: number
  totalCount: number
}

export type Pagination = {
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export interface Query {
  limit?: number
  page?: number
}
