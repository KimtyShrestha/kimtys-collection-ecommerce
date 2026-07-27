import { query } from '../config/db.js'

// Get (or lazily create) the user's wishlist id.
async function wishlistId(userId) {
  const existing = await query(
    'SELECT id FROM wishlists WHERE user_id = $1',
    [userId]
  )
  if (existing.rowCount > 0) return existing.rows[0].id
  const created = await query(
    'INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id',
    [userId]
  )
  return created.rows[0].id
}

export async function listWishlist(userId) {
  const id = await wishlistId(userId)
  const result = await query(
    `SELECT p.id, p.name, p.slug, p.price, p.discount_price, p.stock, p.age_group,
            p.is_new_arrival, c.name AS category_name, c.slug AS category_slug,
            (SELECT pi.image_path FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS image_path
     FROM wishlist_items wi
     JOIN products p ON p.id = wi.product_id AND p.is_active = TRUE
     JOIN categories c ON c.id = p.category_id
     WHERE wi.wishlist_id = $1
     ORDER BY wi.created_at DESC`,
    [id]
  )
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    discountPrice: row.discount_price === null ? null : Number(row.discount_price),
    stock: row.stock,
    ageGroup: row.age_group,
    isNewArrival: row.is_new_arrival,
    category: { name: row.category_name, slug: row.category_slug },
    imagePath: row.image_path,
  }))
}

// Idempotent add (ON CONFLICT ignores duplicates).
export async function addToWishlist(userId, productId) {
  const id = await wishlistId(userId)
  await query(
    `INSERT INTO wishlist_items (wishlist_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (wishlist_id, product_id) DO NOTHING`,
    [id, productId]
  )
}

export async function removeFromWishlist(userId, productId) {
  const id = await wishlistId(userId)
  await query(
    'DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2',
    [id, productId]
  )
}

// Product ids only — lets the frontend show filled hearts cheaply.
export async function wishlistProductIds(userId) {
  const id = await wishlistId(userId)
  const result = await query(
    'SELECT product_id FROM wishlist_items WHERE wishlist_id = $1',
    [id]
  )
  return result.rows.map((row) => row.product_id)
}