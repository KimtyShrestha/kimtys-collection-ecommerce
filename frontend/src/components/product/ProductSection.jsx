import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchProducts } from '../../services/productService'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

// A titled homepage section that loads its own products.
// Silently renders nothing on error/empty — the homepage must
// never show a broken section.
function ProductSection({ title, subtitle, params, viewAllTo }) {
  const [products, setProducts] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProducts({ ...params, limit: 8 })
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed || (products && products.length === 0)) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <Link
          to={viewAllTo}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products === null
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  )
}

export default ProductSection