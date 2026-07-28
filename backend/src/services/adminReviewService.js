import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

const VALID = ['pending', 'approved', 'hidden']

export async function listAdminReviews({ status, page = 1, pageSize = 20 } = {}) {
  const conditions = ['1 = 1']
  const params = []
  const add = (value) => { params.push(value); return `$${params.length}` }

  if (status && VALID.includes(status)) conditions.push(`r.status = ${add(status)}`)

  const where = conditions.join(' AND ')
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const safeSize = Math.min(50, Math.max(1, Number.parseInt(pageSize, 10) || 20))
  const offset = (safePage - 1) * safeSize

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM reviews r WHERE ${where}`, params
  )

  const listParams = [...params, safeSize, offset]
  const result = await query(
    `SELECT r.*, u.full_name, p.name AS product_name, p.slug AS product_slug
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN products p ON p.id = r.product_id
     WHERE ${where}
     ORDER BY (r.status = 'pending') DESC, r.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  )

  const total = Number(countResult.rows[0].total)
  return {
    reviews: result.rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      status: row.status,
      authorName: row.full_name,
      productName: row.product_name,
      productSlug: row.product_slug,
      createdAt: row.created_at,
    })),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  }
}

export async function moderateReview(id, status) {
  if (!VALID.includes(status)) throw new ApiError(400, 'Invalid review status.')
  const result = await query(
    'UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
    [status, id]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Review not found.')
}