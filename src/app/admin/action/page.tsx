'use client'

import PageControl from '@/components/share/button/PageControl'
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
export default function LocationsPage() {
  const { actions, isLoading, error, pagination, setPagination } = useActions()

  return (
    <CardContent
      title="Locations"
      actions={
        <PageControl pagination={pagination} setPagination={setPagination} />
      }
    >
      {error ? (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{error.message}</span>
        </div>
      ) : (
        <DataTable data={actions || []} loading={isLoading} columns={columns} />
      )}
    </CardContent>
  )
}
