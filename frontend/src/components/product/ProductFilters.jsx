import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'

const AGE_OPTIONS = [
  { value: '', label: 'All ages' },
  { value: '0-2', label: '0–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-9', label: '6–9 years' },
  { value: '10-14', label: '10–14 years' },
]

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-b border-gray-200 py-5 first:pt-0 last:border-b-0">
      <legend className="text-sm font-semibold text-gray-900">{title}</legend>
      <div className="mt-3 space-y-2">{children}</div>
    </fieldset>
  )
}

// Controlled filter panel. Radio-style choices apply instantly;
// price range applies on "Apply" (typing shouldn't refetch per key).
function ProductFilters({ categories, values, onChange, onClearAll }) {
  const [minPrice, setMinPrice] = useState(values.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(values.maxPrice || '')

  // Keep local price fields in sync when the URL changes (e.g. Clear all).
  useEffect(() => {
    setMinPrice(values.minPrice || '')
    setMaxPrice(values.maxPrice || '')
  }, [values.minPrice, values.maxPrice])

  function applyPrice(event) {
    event.preventDefault()
    onChange({ minPrice: minPrice || null, maxPrice: maxPrice || null })
  }

  const hasActiveFilters =
    values.category || values.age || values.minPrice || values.maxPrice ||
    values.inStock || values.sale

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="category"
            checked={!values.category}
            onChange={() => onChange({ category: null })}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm text-gray-600">All categories</span>
        </label>
        {categories.map((category) => (
          <label key={category.slug} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={values.category === category.slug}
              onChange={() => onChange({ category: category.slug })}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-gray-600">
              {category.name}
              <span className="text-gray-400"> ({category.productCount})</span>
            </span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Age Group">
        {AGE_OPTIONS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="age"
              checked={(values.age || '') === option.value}
              onChange={() => onChange({ age: option.value || null })}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range (Rs.)">
        <form onSubmit={applyPrice} className="flex items-center gap-2">
          <label htmlFor="filter-min" className="sr-only">Minimum price</label>
          <input
            id="filter-min"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min"
            className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-gray-400">–</span>
          <label htmlFor="filter-max" className="sr-only">Maximum price</label>
          <input
            id="filter-max"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max"
            className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button type="submit" size="sm" variant="secondary">Apply</Button>
        </form>
      </FilterGroup>

      <FilterGroup title="Availability & Offers">
        <Checkbox
          id="filter-instock"
          label="In stock only"
          checked={!!values.inStock}
          onChange={(event) => onChange({ inStock: event.target.checked ? 'true' : null })}
        />
        <Checkbox
          id="filter-sale"
          label="On sale"
          checked={!!values.sale}
          onChange={(event) => onChange({ sale: event.target.checked ? 'true' : null })}
        />
      </FilterGroup>
    </div>
  )
}

export default ProductFilters