import { Pagination } from "@/types/services";

export default function PageControl({
  pagination,
  setPagination
}: {
  pagination: Pagination
  setPagination: (pagination: Pagination) => void
}) {
  return (
    <div className="join">
      <button
        className="join-item btn"
        type="button"
        disabled={pagination.page == 1}
        onClick={() =>
          setPagination({ ...pagination, page: pagination.page - 1 })
        }
      >
        «
      </button>
      <button className="join-item btn">
        Page {pagination.page} / {pagination.totalPages}
      </button>
      <button
        className="join-item btn"
        type="button"
        disabled={pagination.page == pagination.totalPages}
        onClick={() =>
          setPagination({ ...pagination, page: pagination.page + 1 })
        }
      >
        »
      </button>
    </div>
  )
}
