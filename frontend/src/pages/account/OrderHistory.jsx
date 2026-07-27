import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { apiListMyOrders } from '../../services/accountService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatPrice } from '../../components/product/PriceDisplay'

// One place for status → badge styling, reused by Order Details.
export const ORDER_STATUS = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'primary' },
  processing: { label: 'Processing', variant: 'primary' },
  shipped: { label: 'Shipped', variant: 'primary' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
}

const PAYMENT_SHORT = { cod: 'Cash on Delivery', esewa: 'eSewa', khalti: 'Khalti' }

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function OrderHistory() {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    apiListMyOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  if (orders === null) {
    return (
      <section className="flex justify-center rounded-lg border border-gray-200 bg-white p-12">
        <Spinner size="lg" />
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="When you place an order, it will appear here with its status."
          action={<Link to="/shop"><Button>Start Shopping</Button></Link>}
        />
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
      <p className="mt-1 text-sm text-gray-600">
        {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
      </p>

      <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {orders.map((order) => {
          const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
          return (
            <li key={order.orderNumber}>
              <Link
                to={`/account/orders/${order.orderNumber}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.createdAt)} · {order.itemCount}{' '}
                    {order.itemCount === 1 ? 'item' : 'items'} ·{' '}
                    {PAYMENT_SHORT[order.paymentMethod] || order.paymentMethod}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default OrderHistory