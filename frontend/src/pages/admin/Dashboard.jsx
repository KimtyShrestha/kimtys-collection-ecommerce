import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  Package, FolderTree, ShoppingBag, Users, Wallet, Clock, AlertTriangle, Star,
} from 'lucide-react'
import { apiGetDashboard } from '../../services/adminService'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { formatPrice } from '../../components/product/PriceDisplay'
import { ORDER_STATUS } from '../account/OrderHistory'

function StatCard({ icon: Icon, label, value, to, tone = 'default' }) {
  const body = (
    <div
      className={`rounded-lg border bg-white p-5 transition-shadow ${
        tone === 'alert' ? 'border-warning/40' : 'border-gray-200'
      } ${to ? 'hover:shadow-sm' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{label}</p>
        <Icon
          className={`h-4 w-4 ${tone === 'alert' ? 'text-warning' : 'text-primary'}`}
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
  return to ? <Link to={to} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg">{body}</Link> : body
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function Dashboard() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    apiGetDashboard().then(setData).catch(() => setFailed(true))
  }, [])

  if (failed) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Could not load dashboard"
        message="Please check your connection and try again."
        action={<Button onClick={() => window.location.reload()}>Try Again</Button>}
      />
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const { totals, ordersPerDay, recentOrders, recentCustomers, topProducts, lowStockProducts } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Store activity at a glance</p>
      </div>

      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Revenue" value={formatPrice(totals.revenue)} />
        <StatCard icon={ShoppingBag} label="Orders" value={totals.orders} to="/admin/orders" />
        <StatCard icon={Package} label="Products" value={totals.products} to="/admin/products" />
        <StatCard icon={Users} label="Customers" value={totals.customers} to="/admin/customers" />
      </div>

      {/* Attention stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={totals.pendingOrders}
          to="/admin/orders"
          tone={totals.pendingOrders > 0 ? 'alert' : 'default'}
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={totals.lowStockCount}
          to="/admin/products"
          tone={totals.lowStockCount > 0 ? 'alert' : 'default'}
        />
        <StatCard
          icon={Star}
          label="Reviews Awaiting Approval"
          value={totals.pendingReviews}
          to="/admin/reviews"
          tone={totals.pendingReviews > 0 ? 'alert' : 'default'}
        />
        <StatCard icon={FolderTree} label="Categories" value={totals.categories} to="/admin/categories" />
      </div>

      {/* Chart + top products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900">Orders — Last 7 Days</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersPerDay} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#EFF6FF' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                />
                <Bar dataKey="orders" fill="#2563EB" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No sales recorded yet.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {topProducts.map((product, index) => (
                <li key={product.name} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{product.name}</span>
                  <span className="text-sm font-medium text-gray-600">{product.quantity} sold</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {recentOrders.map((order) => {
                const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
                return (
                  <li key={order.orderNumber} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="truncate text-xs text-gray-400">
                        {order.customerName} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Customers</h2>
            <Link to="/admin/customers" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No customers yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                    {customer.fullName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{customer.fullName}</p>
                    <p className="truncate text-xs text-gray-400">{customer.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(customer.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Low stock */}
      {lowStockProducts.length > 0 && (
        <section className="rounded-lg border border-warning/40 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
            Low Stock Alert
          </h2>
          <ul className="mt-4 divide-y divide-gray-200">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{product.name}</span>
                <Badge variant={product.stock === 0 ? 'danger' : 'warning'}>
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Dashboard