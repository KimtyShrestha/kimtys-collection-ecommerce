import { Link } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'
import Badge from '../ui/Badge'
import PriceDisplay from './PriceDisplay'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

// The single product card used across the whole store.
// Whole card is one link (large touch target); image area shows a
// neutral placeholder until product images arrive (Phase 17/22).
function ProductCard({ product }) {
  const onSale = product.discountPrice !== null && product.discountPrice !== undefined

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50">
        {product.imagePath ? (
          <img
            src={`${API_ORIGIN}${product.imagePath}`}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gray-300" aria-hidden="true" />
          </div>
        )}

        {/* Status badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && <Badge variant="danger">Sale</Badge>}
          {product.isNewArrival && <Badge variant="primary">New</Badge>}
          {product.stock === 0 && <Badge variant="neutral">Out of Stock</Badge>}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-gray-400">{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} />
        </div>
      </div>
    </Link>
  )
}

export default ProductCard