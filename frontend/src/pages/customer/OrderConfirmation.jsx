import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, ImageIcon, PackageX, Banknote, Smartphone } from 'lucide-react'
import { apiGetOrder } from '../../services/orderService'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatPrice } from '../../components/product/PriceDisplay'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

const PAYMENT_LABELS = {
  cod: { label: 'Cash on Delivery', icon: Banknote },
  esewa: { label: 'eSewa (simulated)', icon: Smartphone },
  khalti: { label: 'Khalti (simulated)', icon: Smartphone },
}

function OrderConfirmation() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    apiGetOrder(orderNumber)
      .then((data) => {
        if (cancelled) return
        setOrder(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [orderNumber])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          message="We couldn't find this order. It may belong to a different account."
          action={<Link to="/shop"><Button>Continue Shopping</Button></Link>}
        />
      </div>
    )
  }

  const payment = PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.cod
  const PaymentIcon = payment.icon

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Success header */}
      <div className="text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Thank you — your order is confirmed
        </h1>
        <p className="mt-2 text-gray-600">
          Order number{' '}
          <span className="font-semibold text-gray-900">{order.orderNumber}</span>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          We'll contact you on{' '}
          <span className="font-medium text-gray-900">{order.shipping.phone}</span>{' '}
          to arrange delivery within 1–3 days.
        </p>
      </div>

      {/* Order details card */}
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Items */}
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                {item.imagePath ? (
                  <img
                    src={`${API_ORIGIN}${item.imagePath}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <Link
                  to={`/product/${item.slug}`}
                  className="line-clamp-1 text-sm font-medium text-gray-900 hover:text-primary"
                >
                  {item.name}
                </Link>
                <span className="text-xs text-gray-400">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <dl className="space-y-2 border-t border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="font-medium text-gray-900">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Delivery</dt>
            <dd className="font-medium text-gray-900">
              {order.deliveryFee === 0 ? <span className="text-success">Free</span> : formatPrice(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
            <dt className="font-semibold text-gray-900">Total</dt>
            <dd className="font-semibold text-gray-900">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Shipping + payment */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">Delivering to</h2>
          <p className="mt-2 text-sm text-gray-600">
            {order.shipping.name}
            <br />
            {order.shipping.area}, {order.shipping.city}
            {order.shipping.street && <><br />{order.shipping.street}</>}
            {order.shipping.landmark && <><br />{order.shipping.landmark}</>}
            <br />
            {order.shipping.phone}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <PaymentIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            {payment.label}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Status: {order.paymentStatus === 'paid' ? 'Paid' : 'Payable on delivery'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/account/orders"><Button variant="outline">View My Orders</Button></Link>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  )
}

export default OrderConfirmation