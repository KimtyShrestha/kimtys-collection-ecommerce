import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

function mapReview(row, viewerId) {
  return {
    id: row.id,
    rating: row.rating,
    title: row.title,
    comment: row.comment,
    status: row.status,
    authorName: row.full_name,
    isMine: viewerId != null && row.user_id === viewerId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function productIdFromSlug(slug) {
  const result = await query(
    'SELECT id FROM products WHERE slug = $1 AND is_active = TRUE',
    [slug]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Product not found.')
  return result.rows[0].id
}

// Approved reviews for everyone + the viewer's own review whatever its status.
export async function listProductReviews(slug, viewerId = null) {
  const productId = await productIdFromSlug(slug)

  const reviewsResult = await query(
    `SELECT r.*, u.full_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
       AND (r.status = 'approved' OR r.user_id = $2)
     ORDER BY (r.user_id = $2) DESC, r.created_at DESC`,
    [productId, viewerId]
  )

  const summaryResult = await query(
    `SELECT COUNT(*) AS count, COALESCE(AVG(rating), 0) AS average
     FROM reviews
     WHERE product_id = $1 AND status = 'approved'`,
    [productId]
  )

  return {
    reviews: reviewsResult.rows.map((row) => mapReview(row, viewerId)),
    summary: {
      count: Number(summaryResult.rows[0].count),
      average: Math.round(Number(summaryResult.rows[0].average) * 10) / 10,
    },
  }
}

export async function createReview(userId, { productId, rating, title, comment }) {
  const product = await query(
    'SELECT id FROM products WHERE id = $1 AND is_active = TRUE',
    [productId]
  )
  if (product.rowCount === 0) throw new ApiError(404, 'Product not found.')

  const existing = await query(
    'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
    [productId, userId]
  )
  if (existing.rowCount > 0) {
    throw new ApiError(409, 'You have already reviewed this product. You can edit your existing review.')
  }

  const result = await query(
    `INSERT INTO reviews (product_id, user_id, rating, title, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, userId, rating, title || null, comment || null]
  )
  const withName = await query('SELECT full_name FROM users WHERE id = $1', [userId])
  return mapReview({ ...result.rows[0], full_name: withName.rows[0].full_name }, userId)
}

// Editing sends the review back to 'pending' for re-moderation.
export async function updateReview(userId, reviewId, { rating, title, comment }) {
  const result = await query(
    `UPDATE reviews
     SET rating = $1, title = $2, comment = $3, status = 'pending', updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [rating, title || null, comment || null, reviewId, userId]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Review not found.')
  const withName = await query('SELECT full_name FROM users WHERE id = $1', [userId])
  return mapReview({ ...result.rows[0], full_name: withName.rows[0].full_name }, userId)
}

export async function deleteReview(userId, reviewId) {
  const result = await query(
    'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
    [reviewId, userId]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Review not found.')
}