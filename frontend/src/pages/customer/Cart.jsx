import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ImageIcon, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import QuantitySelector from '../../components/ui/QuantitySelector'
import { formatPrice } from '../../components/product/PriceDisplay'
import { usePageTitle } from '../../hooks/usePageTitle'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
const DELIVERY_FEE = 100 // Rs., flat valley-wide; free above threshold
const FREE_DELIVERY_ABOVE = 3000

function Cart() {
  usePageTitle('Shopping Cart')
  const { items, count, subtotal, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [removeTarget, setRemoveTarget] = useState(null)

  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE || subtotal === 0 ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  function confirmRemove() {
    removeItem(removeTarget.id)
    toast(`${removeTarget.name} removed from your cart.`, 'success')
    setRemoveTarget(null)
  }

  function onCheckout() {
    if (!user) {
      toast('Please log in to continue to checkout.', 'info')
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Browse our collection to find something your little one will love."
          action={<Link to="/shop"><Button>Continue Shopping</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Shopping Cart</h1>
      <p className="mt-1 text-sm text-gray-600">
        {count} {count === 1 ? 'item' : 'items'} in your cart
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ===== Items ===== */}
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {items.map((item) => {
            const unitPrice = item.discountPrice ?? item.price
            return (
              <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                {/* Image */}
                <Link
                  to={`/product/${item.slug}`}
                  className="block h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                >
                  {item.imagePath ? (
                    <img
                      src={`${API_ORIGIN}${item.imagePath}`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" aria-hidden="true" />
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(item)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-danger-light hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {formatPrice(unitPrice)} each
                    {item.discountPrice !== null && (
                      <s className="ml-2 text-xs text-gray-400">{formatPrice(item.price)}</s>
                    )}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(quantity) => updateQuantity(item.id, quantity)}
                      max={Math.max(1, item.stock)}
                    />
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* ===== Summary (finding #9 groundwork) ===== */}
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 lg:sticky lg:top-36">
          <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt>
              <dd className="font-medium text-gray-900">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Delivery</dt>
              <dd className="font-medium text-gray-900">
                {deliveryFee === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </dd>
            </div>
            {deliveryFee > 0 && (
              <p className="rounded-md bg-primary-light px-3 py-2 text-xs text-primary">
                Add {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery.
              </p>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-semibold text-gray-900">Total</dt>
              <dd className="font-semibold text-gray-900">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button size="lg" className="mt-5 w-full" onClick={onCheckout}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Link to="/shop" className="mt-3 block">
            <Button variant="ghost" className="w-full">Continue Shopping</Button>
          </Link>
        </aside>
      </div>

      {/* Remove confirmation — destructive action (Section 15 rule) */}
      <Modal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remove item?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmRemove}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Remove <span className="font-medium text-gray-900">{removeTarget?.name}</span> from
          your cart? You can add it again at any time.
        </p>
      </Modal>
    </div>
  )
}

export default Cart