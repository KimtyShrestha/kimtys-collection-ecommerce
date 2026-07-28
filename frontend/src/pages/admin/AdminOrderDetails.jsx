import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImageIcon, PackageX, User, Phone, Mail } from 'lucide-react'
import { apiGetAdminOrder, apiUpdateOrderStatus } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatPrice } from '../../components/product/PriceDisplay'
import { ORDER_STATUS } from '../account/OrderHistory'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PAYMENT_LABELS = {
  cod: 'Cash on Delivery', esewa: 'eSewa (simulated)', khalti: 'Khalti (simulated)',
}

function AdminOrderDetails() {
  const { orderNumber } = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [failed, setFailed] = useState(false)
  const [nextStatus, setNextStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  async function load() {
    try {
      const data = await apiGetAdminOrder(orderNumber)
      setOrder(data)
      setNextStatus(data.status)
    } catch {
      setFailed(true)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber])

  async function applyStatus(status) {
    setSaving(true)
    try {
      const updated = await apiUpdateOrderStatus(orderNumber, { status })
      setOrder(updated)
      setNextStatus(updated.status)
      toast('Order status updated.', 'success')
    } catch (error) {
      toast(error.message, 'error')
      setNextStatus(order.status)
    } finally {
      setSaving(false)
      setConfirmCancel(false)
    }
  }

  function onSave() {
    if (nextStatus === 'cancelled' && order.status !== 'cancelled') {
      setConfirmCancel(true)
      return
    }
    applyStatus(nextStatus)
  }

  async function markPaid() {
    setSaving(true)
    try {
      const updated = await apiUpdateOrderStatus(orderNumber, {
        status: order.status, paymentStatus: 'paid',
      })
      setOrder(updated)
      toast('Payment marked as received.', 'success')
    } catch (error) {
      toast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (failed) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        message="This order does not exist."
        action={<Link to="/admin/orders"><Button>Back to Orders</Button></Link>}
      />
    )
  }

  if (!order) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
  const isTerminal = ['delivered', 'cancelled'].includes(order.status)

  return (
    <div className="space-y-6">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Orders
      </Link>

      <AdminPageHeader
        title={order.orderNumber}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}`}
        actions={<Badge variant={status.variant}>{status.label}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <h2 className="border-b border-gray-200 px-5 py-4 text-base font-semibold text-gray-900">
              Items ({order.items.length})
            </h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 p-4">
                  <span className="block h-14 w-14 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                    {item.imagePath ? (
                      <img src={`${API_ORIGIN}${item.imagePath}`} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link to={`/product/${item.slug}`} className="line-clamp-1 text-sm font-medium text-gray-900 hover:text-primary">
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
                  {order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold text-gray-900">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">Delivery Address</h3>
              <p className="mt-2 text-sm text-gray-600">
                {order.shipping.name}<br />
                {order.shipping.area}, {order.shipping.city}
                {order.shipping.street && <><br />{order.shipping.street}</>}
                {order.shipping.landmark && <><br />{order.shipping.landmark}</>}
                <br />{order.shipping.phone}
              </p>
            </section>
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">Customer</h3>
              <p className="mt-2 space-y-1 text-sm text-gray-600">
                <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />{order.customer.fullName}</span>
                <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />{order.customer.email}</span>
                {order.customer.phone && (
                  <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />{order.customer.phone}</span>
                )}
              </p>
              <Link
                to={`/admin/customers/${order.customer.id}`}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                View customer profile
              </Link>
            </section>
          </div>
        </div>

        {/* Status panel */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Update Status</h2>
            {isTerminal ? (
              <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
                This order is {order.status} and can no longer be changed.
              </p>
            ) : (
              <>
                <Select
                  id="status-select"
                  label="Order Status"
                  className="mt-4"
                  options={STATUS_OPTIONS}
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value)}
                />
                <Button
                  className="mt-4 w-full"
                  loading={saving}
                  disabled={nextStatus === order.status}
                  onClick={onSave}
                >
                  Save Status
                </Button>
              </>
            )}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Payment</h2>
            <p className="mt-2 text-sm text-gray-600">
              {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
            </p>
            <p className="mt-1">
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </Badge>
            </p>
            {order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
              <Button variant="secondary" className="mt-4 w-full" loading={saving} onClick={markPaid}>
                Mark as Paid
              </Button>
            )}
          </section>
        </aside>
      </div>

      <Modal
        open={confirmCancel}
        onClose={() => { setConfirmCancel(false); setNextStatus(order.status) }}
        title="Cancel this order?"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setConfirmCancel(false); setNextStatus(order.status) }}>
              Keep Order
            </Button>
            <Button variant="danger" loading={saving} onClick={() => applyStatus('cancelled')}>
              Cancel Order
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Cancelling returns all items to stock and cannot be undone. The customer
          will see this order as cancelled in their account.
        </p>
      </Modal>
    </div>
  )
}

export default AdminOrderDetails