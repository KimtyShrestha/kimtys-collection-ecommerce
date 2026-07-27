import { Star } from 'lucide-react'

// Display-only stars (supports halves via rounding to nearest 0.5 visually
// simplified to filled/unfilled at 0.5 threshold per star).
export function RatingDisplay({ value, size = 'md', showValue = false }) {
  const dimension = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${dimension} ${
              value >= star - 0.5 ? 'fill-warning text-warning' : 'text-gray-200'
            }`}
            aria-hidden="true"
          />
        ))}
      </span>
      {showValue && (
        <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}</span>
      )}
    </span>
  )
}

// Interactive star input for the review form.
export function RatingInput({ value, onChange, error }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-gray-900">
        Your Rating <span className="text-danger">*</span>
      </p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                value >= star ? 'fill-warning text-warning' : 'text-gray-300 hover:text-warning'
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  )
}