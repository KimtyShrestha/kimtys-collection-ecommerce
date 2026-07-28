import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, SearchX, PackageSearch } from 'lucide-react'
import { fetchProductList, fetchCategories } from '../../services/productService'
import ProductCard from '../../components/product/ProductCard'
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton'
import ProductFilters from '../../components/product/ProductFilters'
import Pagination from '../../components/ui/Pagination'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { usePageTitle } from '../../hooks/usePageTitle'
import ErrorState from '../../components/ui/ErrorState'

const SORT_CHOICES = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Popular' },
  { value: 'name', label: 'Name (A–Z)' },
]

const FLAG_TITLES = {
  featured: 'Featured Products',
  new: 'New Arrivals',
  popular: 'Popular Products',
  sale: 'Sale',
}

// isSearch=true when rendered at /search — same machinery,
// search-focused heading and empty state.
function Shop({ isSearch = false }) {
  usePageTitle(isSearch ? 'Search' : 'Shop')
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [result, setResult] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  useBodyScrollLock(drawerOpen)

  const queryText = searchParams.get('q') || ''
  const filterFlag = searchParams.get('filter') // featured | new | popular | sale

  const values = useMemo(
    () => ({
      category: searchParams.get('category'),
      age: searchParams.get('age'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      inStock: searchParams.get('inStock'),
      sale: searchParams.get('sale'),
      sort: searchParams.get('sort') || 'newest',
      page: Number(searchParams.get('page')) || 1,
    }),
    [searchParams]
  )

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  function loadProducts() {
  setResult(null)
  setFailed(false)

  fetchProductList({
    search: queryText || undefined,
    category: values.category || undefined,
    age: values.age || undefined,
    minPrice: values.minPrice || undefined,
    maxPrice: values.maxPrice || undefined,
    inStock: values.inStock || undefined,
    sale: values.sale || (filterFlag === 'sale' ? 'true' : undefined),
    featured: filterFlag === 'featured' ? 'true' : undefined,
    newArrival: filterFlag === 'new' ? 'true' : undefined,
    popular: filterFlag === 'popular' ? 'true' : undefined,
    sort: values.sort,
    page: values.page,
    pageSize: 12,
  })
    .then(setResult)
    .catch(() => setFailed(true))
}

useEffect(() => {
  loadProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchParams])
  // Merge changes into the URL; any filter change resets to page 1.
  function updateParams(changes, { resetPage = true } = {}) {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') next.delete(key)
      else next.set(key, value)
    })
    if (resetPage) next.delete('page')
    setSearchParams(next)
  }

  function clearAll() {
    const next = new URLSearchParams()
    if (queryText) next.set('q', queryText)
    setSearchParams(next)
  }

  function changePage(page) {
    updateParams({ page: page > 1 ? String(page) : null }, { resetPage: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Active filter chips.
  const chips = []
  if (values.category) {
    const category = categories.find((item) => item.slug === values.category)
    chips.push({ key: 'category', label: category?.name || values.category })
  }
  if (values.age) chips.push({ key: 'age', label: `Age ${values.age}` })
  if (values.minPrice || values.maxPrice) {
    chips.push({
      key: 'price',
      label: `Rs. ${values.minPrice || 0} – ${values.maxPrice || '∞'}`,
      clear: { minPrice: null, maxPrice: null },
    })
  }
  if (values.inStock) chips.push({ key: 'inStock', label: 'In stock' })
  if (values.sale) chips.push({ key: 'sale', label: 'On sale' })

  const heading = isSearch
    ? queryText ? `Search results for "${queryText}"` : 'Search'
    : filterFlag && FLAG_TITLES[filterFlag]
      ? FLAG_TITLES[filterFlag]
      : values.category
        ? categories.find((item) => item.slug === values.category)?.name || 'Shop'
        : 'Shop All Products'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Heading + result count */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{heading}</h1>
          {result && (
            <p className="mt-1 text-sm text-gray-600">
              {result.total} {result.total === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {chips.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                {chips.length}
              </span>
            )}
          </Button>

          {/* Sort */}
          <label htmlFor="sort" className="sr-only">Sort products</label>
          <select
            id="sort"
            value={values.sort}
            onChange={(event) => updateParams({ sort: event.target.value === 'newest' ? null : event.target.value })}
            className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SORT_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => updateParams(chip.clear || { [chip.key]: null })}
              className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-sm text-primary transition-colors hover:bg-primary-border"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Desktop sidebar — filters always visible (finding #2) */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-lg border border-gray-200 bg-white p-5">
            <ProductFilters
              categories={categories}
              values={values}
              onChange={updateParams}
              onClearAll={clearAll}
            />
          </div>
        </aside>

        {/* Results */}
        <div>
          {failed ? (
            <ErrorState
              message="We couldn't load products right now. Please check your connection and try again."
              onRetry={loadProducts}
            />
          ) : result === null ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : result.products.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={isSearch && queryText ? `No results for "${queryText}"` : 'No products found'}
              message="Try different keywords, or remove some filters to see more products."
              action={
                <div className="flex gap-3">
                  {chips.length > 0 && (
                    <Button variant="secondary" onClick={clearAll}>Clear Filters</Button>
                  )}
                  <Link to="/shop"><Button>Browse All Products</Button></Link>
                </div>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onChange={changePage}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ProductFilters
                categories={categories}
                values={values}
                onChange={updateParams}
                onClearAll={clearAll}
              />
            </div>
            <div className="border-t border-gray-200 p-4">
              <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                Show Results{result ? ` (${result.total})` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shop