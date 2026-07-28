import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag, ChevronRight } from 'lucide-react'
import { apiListAdminOrders } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { formatPrice } from '../../components/product/PriceDisplay'
import { ORDER_STATUS } from '../account/OrderHistory'

const STATUS_FILTERS = [
  { value: '', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PAYMENT_LABELS = { cod: 'COD', esewa: 'eSewa', khalti: 'Khalti' }

function AdminOrders() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setData(null)
    apiListAdminOrders({
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || 1,
    })
      .then(setData)
      .catch((error) => {
        toast(error.message, 'error')
        setData({ orders: [], total: 0, page: 1, totalPages: 1 })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function update(changes, { resetPage = true } = {}) {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => {
      if (!value) next.delete(key)
      else next.set(key, value)
    })
    if (resetPage) next.delete('page')
    setSearchParams(next)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        subtitle={data ? `${data.total} orders placed` : 'Loading…'}
      />

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={(event) => { event.preventDefault(); update({ search: searchInput.trim() || null }) }}
            className="relative min-w-56 flex-1"
          >
            <label htmlFor="order-search" className="sr-only">Search orders</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="order-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by order number, customer name or email…"
              className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>

          <label htmlFor="order-status" className="sr-only">Filter by status</label>
          <select
            id="order-status"
            value={searchParams.get('status') || ''}
            onChange={(event) => update({ status: event.target.value })}
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {STATUS_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>

          {[...searchParams.keys()].length > 0 && (
            <Button variant="ghost" onClick={() => { setSearchInput(''); setSearchParams(new URLSearchParams()) }}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {data === null ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : data.orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          message="Orders will appear here as customers place them."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Order</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Items</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Payment</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Total</th>
                  <th scope="col" className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.orders.map((order) => {
                  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{order.customer.fullName}</p>
                        <p className="text-xs text-gray-400">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.itemCount}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                      </td>
                      <td className="px-4 py-3"><Badge variant={status.variant}>{status.label}</Badge></td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/admin/orders/${order.orderNumber}`}>
                          <Button size="sm" variant="secondary">
                            View <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={(page) => update({ page: page > 1 ? String(page) : null }, { resetPage: false })}
          />
        </>
      )}
    </div>
  )
}

export default AdminOrders