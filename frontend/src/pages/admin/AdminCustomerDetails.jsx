import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, UserX } from 'lucide-react'
import { apiGetCustomer } from '../../services/adminService'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatPrice } from '../../components/product/PriceDisplay'
import { ORDER_STATUS } from '../account/OrderHistory'

function AdminCustomerDetails() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    apiGetCustomer(id).then(setCustomer).catch(() => setFailed(true))
  }, [id])

  if (failed) {
    return (
      <EmptyState
        icon={UserX}
        title="Customer not found"
        message="This customer does not exist."
        action={<Link to="/admin/customers"><Button>Back to Customers</Button></Link>}
      />
    )
  }

  if (!customer) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  const totalSpent = customer.orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Customers
      </Link>

      <AdminPageHeader title={customer.fullName} subtitle={customer.email} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{customer.orders.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatPrice(totalSpent)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">Saved Addresses</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{customer.addresses.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Orders */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <h2 className="border-b border-gray-200 px-5 py-4 text-base font-semibold text-gray-900">
            Order History
          </h2>
          {customer.orders.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">This customer has not placed any orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {customer.orders.map((order) => {
                const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending
                return (
                  <li key={order.orderNumber}>
                    <Link to={`/admin/orders/${order.orderNumber}`} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-gray-900">{order.orderNumber}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })} · {order.itemCount} items
                        </span>
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Contact + addresses */}
        <aside className="space-y-4">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />{customer.email}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />{customer.phone || '—'}</li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                Joined {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </li>
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Addresses</h2>
            {customer.addresses.length === 0 ? (
              <p className="mt-3 text-sm text-gray-400">No saved addresses.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {customer.addresses.map((address, index) => (
                  <li key={index} className="rounded-md border border-gray-200 p-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{address.label}</span>
                      {address.isDefault && <Badge variant="primary">Default</Badge>}
                    </div>
                    <p className="mt-1">
                      {address.recipientName}<br />
                      {address.area}, {address.city}
                      {address.landmark && <><br />{address.landmark}</>}
                      <br />{address.phone}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default AdminCustomerDetails