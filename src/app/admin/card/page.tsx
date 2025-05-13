'use client'

import PageControl from '@/components/share/button/PageControl'
import AlertDisplay from '@/components/share/callback/AlertDisplay'
import CardContent from '@/components/share/layouts/CardContent'
import DataTable from '@/components/share/table/DataTable'
import { useCard } from '@/hooks/useCards'
import { Card } from '@/types/card'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

const columns: ColumnDef<Card>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'pick',
    header: 'Pick'
  },
  {
    accessorKey: 'danger',
    header: 'Danger'
  },
  {
    accessorKey: 'score',
    header: 'Score'
  },
  {
    accessorKey: 'actionData',
    header: 'Action',
    cell: ({ row }) => <>{row.original.actionData?.title}</>
  },
  {
    accessorKey: 'token',
    header: 'Token'
  },
  {
    accessorKey: 'level',
    header: 'Level'
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity'
  },
  {
    header: 'Action',
    cell: ({ row }) => (
      <>
        <Link
          href={`/admin/card/${row.original._id}`}
          className="btn btn-sm btn-outline"
        >
          <i className="ri-more-2-fill"></i>
        </Link>
      </>
    )
  }
]
export default function AdminCardPage() {
  const { cards, isLoading, error, pagination, setPagination } = useCard()

  return (
    <CardContent
      title="Card"
      actions={
        <PageControl pagination={pagination} setPagination={setPagination} />
      }
    >
      {error ? (
        <AlertDisplay message={error.message} />
      ) : (
        <DataTable data={cards || []} loading={isLoading} columns={columns} />
      )}
    </CardContent>
  )
}
