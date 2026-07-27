import { Minus, Plus } from 'lucide-react'

// Bounded quantity control — prevents invalid quantities by design.
function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  function clamp(next) {
    return Math.min(max, Math.max(min, next))
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center rounded-l-lg text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10)
          if (Number.isInteger(parsed)) onChange(clamp(parsed))
        }}
        aria-label="Quantity"
        className="h-10 w-14 border-x border-gray-200 text-center text-sm font-medium text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center rounded-r-lg text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export default QuantitySelector