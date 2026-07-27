import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MessageSquare, Pencil, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { RatingDisplay, RatingInput } from '../ui/RatingStars'

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function ReviewSection({ productId, slug }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [data, setData] = useState(null) // { reviews, summary }
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [rating, setRating] = useState(0)
  const [ratingError, setRatingError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function load() {
    try {
      const response = await api.get(`/products/${slug}/reviews`)
      setData(response.data.data)
    } catch {
      setData({ reviews: [], summary: { count: 0, average: 0 } })
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user])

  const myReview = data?.reviews.find((review) => review.isMine)

  function openWrite() {
    if (!user) {
      toast('Please log in to write a review.', 'info')
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    setEditing(null)
    setRating(0)
    setRatingError('')
    reset({ title: '', comment: '' })
    setFormOpen(true)
  }

  function openEdit(review) {
    setEditing(review)
    setRating(review.rating)
    setRatingError('')
    reset({ title: review.title || '', comment: review.comment || '' })
    setFormOpen(true)
  }

  async function onSubmit(values) {
    if (rating < 1) {
      setRatingError('Please select a rating.')
      return
    }
    try {
      if (editing) {
        await api.put(`/reviews/${editing.id}`, { rating, ...values })
        toast('Review updated — it will reappear once re-approved.', 'success')
      } else {
        await api.post('/reviews', { productId, rating, ...values })
        toast('Review submitted — it will appear once approved.', 'success')
      }
      setFormOpen(false)
      load()
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/reviews/${deleteTarget.id}`)
      toast('Review deleted.', 'success')
      setDeleteTarget(null)
      load()
    } catch (error) {
      toast(error.message, 'error')
      setDeleteTarget(null)
    }
  }

  if (data === null) {
    return (
      <section className="mt-12 flex justify-center py-8">
        <Spinner />
      </section>
    )
  }

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
          {data.summary.count > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <RatingDisplay value={data.summary.average} showValue />
              <span className="text-sm text-gray-600">
                · {data.summary.count} {data.summary.count === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-600">No reviews yet — be the first.</p>
          )}
        </div>
        {!myReview && (
          <Button variant="outline" onClick={openWrite}>Write a Review</Button>
        )}
      </div>

      {data.reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <MessageSquare className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <p className="mt-3 text-sm text-gray-600">
            Share your experience to help other parents decide.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {data.reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <RatingDisplay value={review.rating} />
                    {review.isMine && review.status === 'pending' && (
                      <Badge variant="warning">Pending approval</Badge>
                    )}
                    {review.isMine && review.status === 'hidden' && (
                      <Badge variant="neutral">Hidden by moderator</Badge>
                    )}
                  </div>
                  {review.title && (
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{review.title}</h3>
                  )}
                </div>
                {review.isMine && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(review)} aria-label="Edit review">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(review)} aria-label="Delete review">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.comment}</p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                {review.authorName} · {formatDate(review.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Write / edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Your Review' : 'Write a Review'}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <RatingInput value={rating} onChange={(v) => { setRating(v); setRatingError('') }} error={ratingError} />
          <Input
            id="review-title"
            label="Title"
            placeholder="Sum it up in a few words (optional)"
            error={errors.title?.message}
            {...register('title', { maxLength: { value: 120, message: 'Title must be 120 characters or fewer.' } })}
          />
          <Textarea
            id="review-comment"
            label="Your Review"
            placeholder="What did you (and your little one) think? (optional)"
            error={errors.comment?.message}
            {...register('comment', { maxLength: { value: 2000, message: 'Comment must be 2000 characters or fewer.' } })}
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>
              {editing ? 'Save Changes' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete your review?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">This will permanently remove your review.</p>
      </Modal>
    </section>
  )
}

export default ReviewSection