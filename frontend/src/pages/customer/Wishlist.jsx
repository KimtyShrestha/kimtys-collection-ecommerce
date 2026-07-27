import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ImageIcon, ShoppingCart, Trash2 } from 'lucide-react'
import { apiGetWishlist, apiRemoveFromWishlist } from '../../services/accountService'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import PriceDisplay from '../../components/product/PriceDisplay'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

function Wishlist() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [products, setProducts] = useState(null)

  useEffect(() => {
    apiGetWishlist().then(setProducts).catch(() => setProducts([]))
  }, [])

  async function remove(product) {
    try {
      await apiRemoveFromWishlist(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      toast(`${product.name} removed from your wishlist.`, 'success')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  async function moveToCart(product) {
    addItem(product, 1)
    await remove(product)
    toast(`${product.name} moved to your cart.`, 'success')
  }

  if (products === null) {
    return (
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-16 sm:px-6">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Wishlist</h1>
      <p className="mt-1 text-sm text-gray-600">
        {products.length} {products.length === 1 ? 'item' : 'items'} saved
      </p>

      {products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Tap the heart on any product to save it here for later."
            action={<Link to="/shop"><Button>Browse Products</Button></Link>}
          />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const inStock = product.stock > 0
            return (
              <li
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <Link to={`/product/${product.slug}`} className="relative block aspect-square bg-gray-50">
                  {product.imagePath ? (
                    <img
                      src={`${API_ORIGIN}${product.imagePath}`}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-300" aria-hidden="true" />
                    </span>
                  )}
                  {!inStock && (
                    <span className="absolute left-3 top-3">
                      <Badge variant="neutral">Out of Stock</Badge>
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-xs text-gray-400">{product.category.name}</p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="mt-0.5 line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-auto pt-2">
                    <PriceDisplay price={product.price} discountPrice={product.discountPrice} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={!inStock}
                      onClick={() => moveToCart(product)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                      {inStock ? 'Move to Cart' : 'Out of Stock'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Wishlist