import { Link } from 'react-router-dom'
import { ImageIcon, ShoppingCart } from 'lucide-react'
import Badge from '../ui/Badge'
import PriceDisplay from './PriceDisplay'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

// The single product card used across the whole store.
function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const onSale = product.discountPrice !== null && product.discountPrice !== undefined
  const inStock = product.stock > 0

  function onQuickAdd(event) {
    // The whole card is a link — stop the click from navigating.
    event.preventDefault()
    event.stopPropagation()
    addItem(product, 1)
    toast(`Added ${product.name} to your cart.`, 'success')
  }

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
          {!inStock && <Badge variant="neutral">Out of Stock</Badge>}
        </div>

        {/* Quick add — appears on hover (desktop); always tappable on touch */}
        {inStock && (
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-all hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
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