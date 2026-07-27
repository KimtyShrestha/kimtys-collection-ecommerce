import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ImageIcon, PackageX, ArrowLeft, Check } from 'lucide-react'
import { apiGetOrder } from '../../services/orderService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatPrice } from '../../components/product/PriceDisplay'
import { ORDER_STATUS } from './OrderHistory'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
const PAYMENT_LABELS = {
  cod: 'Cash on Delivery',
  esewa: 'eSewa (simulated)',
  khalti: 'Khalti (simulated)',
}

// Progress steps for the status timeline (cancelled handled separately).
const TIMELINE = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function OrderDetails() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    apiGetOrder(orderNumber)
      .then((data) => {
        if (cancelled) return
        setOrder(data)
        setStatus('ready')
      })
      .catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [orderNumber])

  if (status === 'loading') {
    return (
      <section className="flex justify-center rounded-lg border border-gray-200 bg-white p-12">
        <Spinner size="lg" />
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          message="We couldn't find this order in your account."
          action={<Link to="/account/orders"><Button>Back to My Orders</Button></Link>}
        />
      </section>
    )
  }

  const statusInfo = ORDER_STATUS[order.status] || ORDER_STATUS.pending
  const isCancelled = order.status === 'cancelled'
  const currentStep = TIMELINE.indexOf(order.status)

  return (
    <div className="space-y-4">
      {/* Header card */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> My Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {/* Status timeline */}
        {!isCancelled && (
          <ol className="mt-6 flex items-center">
            {TIMELINE.map((step, index) => {
              const reached = index <= currentStep
              const label = ORDER_STATUS[step].label
              return (
                <li key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        reached ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {reached ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className={`mt-1.5 hidden text-[11px] sm:block ${reached ? 'text-gray-900' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                  {index < TIMELINE.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`mx-1 h-0.5 flex-1 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        )}
        {isCancelled && (
          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
            This order was cancelled.
          </p>
        )}
      </section>

      {/* Items */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                {item.imagePath ? (
                  <img src={`${API_ORIGIN}${item.imagePath}`} alt="" className="h-full w-full object-cover" />
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
              <span className="text-sm font-medium text-gray-900">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
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
      </section>

      {/* Shipping + payment */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">Delivering to</h3>
          <p className="mt-2 text-sm text-gray-600">
            {order.shipping.name}<br />
            {order.shipping.area}, {order.shipping.city}
            {order.shipping.street && <><br />{order.shipping.street}</>}
            {order.shipping.landmark && <><br />{order.shipping.landmark}</>}
            <br />{order.shipping.phone}
          </p>
        </section>
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
          <p className="mt-2 text-sm text-gray-600">
            {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Status: {order.paymentStatus === 'paid' ? 'Paid' : 'Payable on delivery'}
          </p>
        </section>
      </div>
    </div>
  )
}

export default OrderDetails