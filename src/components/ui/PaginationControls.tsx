type PaginationControlsProps = {
  currentPage: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
  isDisabled?: boolean
}

export const PaginationControls = ({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isDisabled,
}: PaginationControlsProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-white/80 px-2 py-3 text-sm text-slate-700">
    <p className="text-slate-600">
      Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
      <span className="font-semibold text-slate-900">{lastPage}</span>
      <span className="ml-2 text-slate-500">({total} total)</span>
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDisabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDisabled || currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  </div>
)
