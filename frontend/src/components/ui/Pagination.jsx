import { ChevronLeft, ChevronRight } from 'lucide-react'

// Compact page list: 1 … 4 5 [6] 7 8 … 12
function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const list = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
  const withGaps = []
  list.forEach((page, index) => {
    if (index > 0 && page - list[index - 1] > 1) withGaps.push('…')
    withGaps.push(page)
  })
  return withGaps
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageList(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-2 text-sm text-gray-400">…</span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`h-9 min-w-9 rounded-md border px-3 text-sm font-medium transition-colors ${
              item === page
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export default Pagination