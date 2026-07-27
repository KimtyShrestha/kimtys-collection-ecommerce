import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ImageIcon,
  Heart,
  ShoppingCart,
  Truck,
  Store,
  RotateCcw,
  PackageX,
} from 'lucide-react'
import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from '../../services/productService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import QuantitySelector from '../../components/ui/QuantitySelector'
import EmptyState from '../../components/ui/EmptyState'
import ProductCard from '../../components/product/ProductCard'
import PriceDisplay from '../../components/product/PriceDisplay'
import { useCart } from '../../context/CartContext'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

const AGE_LABELS = {
  '0-2': '0–2 years',
  '3-5': '3–5 years',
  '6-9': '6–9 years',
  '10-14': '10–14 years',
  all: 'All ages',
}

function DetailsSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-2">
      <div className="aspect-square rounded-lg bg-gray-100" />
      <div className="space-y-4">
        <div className="h-4 w-1/4 rounded bg-gray-100" />
        <div className="h-8 w-3/4 rounded bg-gray-100" />
        <div className="h-6 w-1/3 rounded bg-gray-100" />
        <div className="h-24 w-full rounded bg-gray-100" />
        <div className="h-12 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  )
}

function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setProduct(null)
    setQuantity(1)
    window.scrollTo({ top: 0 })

    fetchProductBySlug(slug)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setStatus(error.message === 'Product not found.' ? 'notfound' : 'error')
      })

    fetchRelatedProducts(slug)
      .then((data) => { if (!cancelled) setRelated(data) })
      .catch(() => { if (!cancelled) setRelated([]) })

    return () => { cancelled = true }
  }, [slug])

  function onAddToCart() {
    addItem(product, quantity)
    toast(`Added ${quantity} × ${product.name} to your cart.`, 'success')
  }

  function onWishlist() {
    if (!user) {
      toast('Please log in to save items to your wishlist.', 'info')
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    // Persisted in Phase 13.
    toast(`${product.name} saved to your wishlist.`, 'success')
  }

  if (status === 'notfound') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          message="This product may have been removed or is no longer available."
          action={<Link to="/shop"><Button>Browse All Products</Button></Link>}
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={PackageX}
          title="Something went wrong"
          message="We couldn't load this product right now. Please try again."
          action={<Button onClick={() => window.location.reload()}>Try Again</Button>}
        />
      </div>
    )
  }

  const onSale =
    product && product.discountPrice !== null && product.discountPrice !== undefined
  const inStock = product && product.stock > 0
  const lowStock = product && product.stock > 0 && product.stock <= 5

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {status === 'loading' ? (
        <DetailsSkeleton />
      ) : (
        <>
          <Breadcrumb
            items={[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: `/shop?category=${product.category.slug}`, label: product.category.name },
              { label: product.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* ===== Image area ===== */}
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {product.imagePath ? (
                <img
                  src={`${API_ORIGIN}${product.imagePath}`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <ImageIcon className="h-14 w-14 text-gray-300" aria-hidden="true" />
                  <p className="text-xs text-gray-400">Product photo coming soon</p>
                </div>
              )}
            </div>

            {/* ===== Information hierarchy (finding #5) ===== */}
            <div>
              {/* 1. Category + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/shop?category=${product.category.slug}`}
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  {product.category.name}
                </Link>
                {product.isNewArrival && <Badge variant="primary">New</Badge>}
                {onSale && <Badge variant="danger">Sale</Badge>}
              </div>

              {/* 2. Title */}
              <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* 3. Price */}
              <div className="mt-4">
                <PriceDisplay
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="lg"
                />
              </div>

              {/* 4. Availability */}
              <div className="mt-3">
                {inStock ? (
                  <Badge variant={lowStock ? 'warning' : 'success'}>
                    {lowStock ? `Only ${product.stock} left in stock` : 'In Stock'}
                  </Badge>
                ) : (
                  <Badge variant="neutral">Out of Stock</Badge>
                )}
              </div>

              {/* 5. Key details */}
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg bg-gray-50 p-4 text-sm">
                <div>
                  <dt className="text-gray-400">Age suitability</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {AGE_LABELS[product.ageGroup] || product.ageGroup}
                  </dd>
                </div>
                {product.size && (
                  <div>
                    <dt className="text-gray-400">Size</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{product.size}</dd>
                  </div>
                )}
                {product.colour && (
                  <div>
                    <dt className="text-gray-400">Colour</dt>
                    <dd className="mt-0.5 font-medium text-gray-900">{product.colour}</dd>
                  </div>
                )}
              </dl>

              {/* 6. Actions — dominant primary CTA (finding #8) */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, product.stock)}
                />
                <Button
                  size="lg"
                  onClick={onAddToCart}
                  disabled={!inStock}
                  className="flex-1 sm:flex-none sm:min-w-48"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onWishlist}
                  aria-label="Save to wishlist"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Wishlist</span>
                </Button>
              </div>

              {/* 7. Trust strip */}
              <ul className="mt-6 space-y-2 border-t border-gray-200 pt-5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Delivery across Kathmandu Valley in 1–3 days
                </li>
                <li className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" aria-hidden="true" />
                  Also available in our Banasthali, Basundhara & Hattigauda stores
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" aria-hidden="true" />
                  7-day exchange on unused items
                </li>
              </ul>
            </div>
          </div>

          {/* ===== Description ===== */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-900">Product Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {product.description || 'No description available for this product yet.'}
            </p>
          </section>

          {/* ===== Related products ===== */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900">You May Also Like</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default ProductDetails