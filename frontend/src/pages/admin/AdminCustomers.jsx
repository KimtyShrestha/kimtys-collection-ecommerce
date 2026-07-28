import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Users, ChevronRight } from 'lucide-react'
import { apiListCustomers } from '../../services/adminService'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { formatPrice } from '../../components/product/PriceDisplay'

function AdminCustomers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setData(null)
    apiListCustomers({
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || 1,
    })
      .then(setData)
      .catch(() => setData({ customers: [], total: 0, page: 1, totalPages: 1 }))
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
        title="Customers"
        subtitle={data ? `${data.total} registered customers` : 'Loading…'}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <form
          onSubmit={(event) => { event.preventDefault(); update({ search: searchInput.trim() || null }) }}
          className="relative"
        >
          <label htmlFor="customer-search" className="sr-only">Search customers</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="customer-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, email or phone…"
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>
      </div>

      {data === null ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : data.customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" message="Try a different search." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Orders</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Total Spent</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th scope="col" className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                          {customer.fullName.charAt(0).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-medium text-gray-900">{customer.fullName}</span>
                          <span className="text-xs text-gray-400">{customer.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.orderCount}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/customers/${customer.id}`}>
                        <Button size="sm" variant="secondary">
                          View <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
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

export default AdminCustomers