import { ReactNode } from 'react'

interface LazyTableProps {
  span: number
  isLoading: boolean
  data: unknown[]
  children?: ReactNode
  emptyMessage?: string
}

export default function LazyTable({
  isLoading,
  data,
  span,
  children,
  emptyMessage = 'Empty'
}: LazyTableProps) {
  return (
    <>
      {isLoading ? (
        <tr>
          <td colSpan={span} className="text-center">
            <span className="loading loading-dots loading-sm"></span>
          </td>
        </tr>
      ) : (
        <>
          {!data.length ? (
            <tr>
              <td colSpan={span} className="text-center">
                <p>{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            <>{children}</>
          )}
        </>
      )}
    </>
  )
}
