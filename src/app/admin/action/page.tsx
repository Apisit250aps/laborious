'use client'

import PageControl from '@/components/share/button/PageControl'
import AlertDisplay from '@/components/share/callback/AlertDisplay';
import CardContent from '@/components/share/layouts/CardContent'
import DataTable from '@/components/share/table/DataTable'
import { useActions } from '@/hooks/useActions'
import { Action } from '@/models/actions'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<Action>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'codex',
    header: 'CODEX'
  },
  {
    accessorKey: 'value',
    header: 'Value'
  }
]
export default function ActionPage() {
  const { actions, isLoading, error, pagination, setPagination } = useActions()

  return (
    <CardContent
      title="Actions"
      actions={
        <PageControl pagination={pagination} setPagination={setPagination} />
      }
    >
      {error ? (
        <AlertDisplay message={error.message} />
      ) : (
        <DataTable data={actions || []} loading={isLoading} columns={columns} />
      )}
    </CardContent>
  )
}
