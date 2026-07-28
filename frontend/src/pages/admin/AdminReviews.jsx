import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, Check, EyeOff, RotateCcw } from 'lucide-react'
import { apiListAdminReviews, apiModerateReview } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { RatingDisplay } from '../../components/ui/RatingStars'

const FILTERS = [
  { value: '', label: 'All reviews' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'hidden', label: 'Hidden' },
]

const STATUS_BADGE = {
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  hidden: { label: 'Hidden', variant: 'neutral' },
}

function AdminReviews() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setData(null)
    try {
      setData(await apiListAdminReviews({
        status: searchParams.get('status') || undefined,
        page: searchParams.get('page') || 1,
      }))
    } catch {
      setData({ reviews: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function moderate(review, status) {
    setBusyId(review.id)
    try {
      await apiModerateReview(review.id, status)
      toast(
        status === 'approved' ? 'Review approved and published.' :
        status === 'hidden' ? 'Review hidden from the store.' :
        'Review returned to pending.',
        'success'
      )
      load()
    } catch (error) {
      toast(error.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

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
        title="Reviews"
        subtitle={data ? `${data.total} reviews submitted` : 'Loading…'}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label htmlFor="review-status" className="sr-only">Filter reviews</label>
        <select
          id="review-status"
          value={searchParams.get('status') || ''}
          onChange={(event) => update({ status: event.target.value })}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {FILTERS.map((filter) => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>
      </div>

      {data === null ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : data.reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews to moderate"
          message="Customer reviews will appear here for approval."
        />
      ) : (
        <>
          <ul className="space-y-4">
            {data.reviews.map((review) => {
              const badge = STATUS_BADGE[review.status]
              return (
                <li key={review.id} className="rounded-lg border border-gray-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <RatingDisplay value={review.rating} />
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      {review.title && (
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">{review.title}</h3>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {review.authorName} on{' '}
                        <Link to={`/product/${review.productSlug}`} className="text-primary hover:underline">
                          {review.productName}
                        </Link>{' '}
                        · {new Date(review.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {review.status !== 'approved' && (
                        <Button size="sm" loading={busyId === review.id} onClick={() => moderate(review, 'approved')}>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve
                        </Button>
                      )}
                      {review.status !== 'hidden' && (
                        <Button size="sm" variant="secondary" loading={busyId === review.id} onClick={() => moderate(review, 'hidden')}>
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Hide
                        </Button>
                      )}
                      {review.status !== 'pending' && (
                        <Button size="sm" variant="ghost" loading={busyId === review.id} onClick={() => moderate(review, 'pending')}>
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 border-t border-gray-200 pt-3 text-sm leading-relaxed text-gray-600">
                      {review.comment}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>

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

export default AdminReviews