import {
  listProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService.js'
import { sendSuccess } from '../utils/response.js'

// GET /api/products/:slug/reviews — public, richer when logged in
export async function getProductReviews(req, res, next) {
  try {
    const data = await listProductReviews(req.params.slug, req.user?.id ?? null)
    sendSuccess(res, { message: 'Reviews retrieved successfully.', data })
  } catch (error) {
    next(error)
  }
}

// POST /api/reviews
export async function postReview(req, res, next) {
  try {
    const review = await createReview(req.user.id, req.body)
    sendSuccess(res, {
      statusCode: 201,
      message: 'Review submitted — it will appear once approved.',
      data: { review },
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/reviews/:id
export async function putReview(req, res, next) {
  try {
    const review = await updateReview(req.user.id, req.params.id, req.body)
    sendSuccess(res, {
      message: 'Review updated — it will reappear once re-approved.',
      data: { review },
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/reviews/:id
export async function removeReview(req, res, next) {
  try {
    await deleteReview(req.user.id, req.params.id)
    sendSuccess(res, { message: 'Review deleted.' })
  } catch (error) {
    next(error)
  }
}