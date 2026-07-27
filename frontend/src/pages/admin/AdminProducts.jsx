import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, ImageIcon, PackageSearch } from 'lucide-react'
import {
  apiListAdminProducts,
  apiDeleteProduct,
  apiListAdminCategories,
} from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { formatPrice } from '../../components/product/PriceDisplay'

const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api$/, '')

function stockBadge(stock) {
  if (stock === 0) return <Badge variant="danger">Out of stock</Badge>
  if (stock <= 5) return <Badge variant="warning">{stock} left</Badge>
  return <Badge variant="success">{stock} in stock</Badge>
}

function AdminProducts() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [categories, setCategories] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const params = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    stockLevel: searchParams.get('stockLevel') || undefined,
    status: searchParams.get('status') || undefined,
    page: searchParams.get('page') || 1,
    pageSize: 20,
  }

  async function load() {
    setData(null)
    try {
      setData(await apiListAdminProducts(params))
    } catch (error) {
      toast(error.message, 'error')
      setData({ products: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    apiListAdminCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  function update(changes, { resetPage = true } = {}) {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => {
      if (!value) next.delete(key)
      else next.set(key, value)
    })
    if (resetPage) next.delete('page')
    setSearchParams(next)
  }

  function onSearch(event) {
    event.preventDefault()
    update({ search: searchInput.trim() || null })
  }

  async function confirmDelete() {
    try {
      await apiDeleteProduct(deleteTarget.id)
      toast(`${deleteTarget.name} removed from the store.`, 'success')
      setDeleteTarget(null)
      load()
    } catch (error) {
      toast(error.message, 'error')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        subtitle={data ? `${data.total} products in the catalogue` : 'Loading…'}
        actions={
          <Link to="/admin/products/new">
            <Button><Plus className="h-4 w-4" aria-hidden="true" /> Add Product</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <form onSubmit={onSearch} className="relative min-w-56 flex-1">
            <label htmlFor="admin-product-search" className="sr-only">Search products</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="admin-product-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by product name…"
              className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>

          <div>
            <label htmlFor="filter-category" className="sr-only">Category</label>
            <select
              id="filter-category"
              value={searchParams.get('category') || ''}
              onChange={(event) => update({ category: event.target.value })}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-stock" className="sr-only">Stock level</label>
            <select
              id="filter-stock"
              value={searchParams.get('stockLevel') || ''}
              onChange={(event) => update({ stockLevel: event.target.value })}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All stock levels</option>
              <option value="low">Low stock (≤ 5)</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="sr-only">Status</label>
            <select
              id="filter-status"
              value={searchParams.get('status') || ''}
              onChange={(event) => update({ status: event.target.value })}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Removed</option>
            </select>
          </div>

          {[...searchParams.keys()].length > 0 && (
            <Button
              variant="ghost"
              onClick={() => { setSearchInput(''); setSearchParams(new URLSearchParams()) }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {data === null ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : data.products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          message="Try a different search or clear your filters."
          action={
            <Link to="/admin/products/new">
              <Button>Add Your First Product</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-215 text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Product</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Category</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Price</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Stock</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Flags</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="block h-10 w-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          {product.imagePath ? (
                            <img src={`${API_ORIGIN}${product.imagePath}`} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-gray-300" aria-hidden="true" />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-56 truncate font-medium text-gray-900">{product.name}</span>
                          <span className="text-xs text-gray-400">{product.ageGroup}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.categoryName}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {formatPrice(product.discountPrice ?? product.price)}
                      </span>
                      {product.discountPrice !== null && (
                        <s className="ml-1 text-xs text-gray-400">{formatPrice(product.price)}</s>
                      )}
                    </td>
                    <td className="px-4 py-3">{stockBadge(product.stock)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured && <Badge variant="primary">Featured</Badge>}
                        {product.isNewArrival && <Badge variant="neutral">New</Badge>}
                        {product.isPopular && <Badge variant="neutral">Popular</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.isActive
                        ? <Badge variant="success">Active</Badge>
                        : <Badge variant="neutral">Removed</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/products/${product.id}/edit`}>
                          <Button size="sm" variant="secondary" aria-label={`Edit ${product.name}`}>
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </Link>
                        {product.isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteTarget(product)}
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        )}
                      </div>
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

      {/* Remove confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove product?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{deleteTarget?.name}</span> will be
          hidden from the store. Existing orders keep their record of it, and you can
          restore the product later by editing it.
        </p>
      </Modal>
    </div>
  )
}

export default AdminProducts