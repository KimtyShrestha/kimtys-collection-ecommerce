import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, ArrowRight } from 'lucide-react'
import { fetchCategories } from '../../services/productService'
import EmptyState from '../../components/ui/EmptyState'

function Categories() {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-gray-600">
        Browse our collection by what you need
      </p>

      {categories === null ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FolderOpen}
            title="No categories available"
            message="Please check back soon."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-primary-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary">
                  {category.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{category.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories