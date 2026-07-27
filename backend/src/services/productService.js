import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

// Columns exposed to the client for product listings.
const LIST_COLUMNS = `
  p.id, p.name, p.slug, p.price, p.discount_price, p.stock,
  p.age_group, p.is_featured, p.is_new_arrival, p.is_popular,
  c.name AS category_name, c.slug AS category_slug,
  (SELECT pi.image_path FROM product_images pi
   WHERE pi.product_id = p.id
   ORDER BY pi.is_primary DESC, pi.sort_order ASC
   LIMIT 1) AS image_path
`

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    discountPrice: row.discount_price === null ? null : Number(row.discount_price),
    stock: row.stock,
    ageGroup: row.age_group,
    isFeatured: row.is_featured,
    isNewArrival: row.is_new_arrival,
    isPopular: row.is_popular,
    category: { name: row.category_name, slug: row.category_slug },
    imagePath: row.image_path,
  }
}

// List products with simple flag filters and a limit.
// (Extended with search/sort/pagination in Phase 9.)
export async function listProducts({ featured, newArrival, popular, sale, limit } = {}) {
  const conditions = ['p.is_active = TRUE']
  const params = []

  if (featured) conditions.push('p.is_featured = TRUE')
  if (newArrival) conditions.push('p.is_new_arrival = TRUE')
  if (popular) conditions.push('p.is_popular = TRUE')
  if (sale) conditions.push('p.discount_price IS NOT NULL')

  let limitClause = ''
  const safeLimit = Number(limit)
  if (Number.isInteger(safeLimit) && safeLimit > 0 && safeLimit <= 50) {
    params.push(safeLimit)
    limitClause = `LIMIT $${params.length}`
  }

  const result = await query(
    `SELECT ${LIST_COLUMNS}
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY p.created_at DESC
     ${limitClause}`,
    params
  )

  return result.rows.map(mapProduct)
}

export async function getProductBySlug(slug) {
  const result = await query(
    `SELECT ${LIST_COLUMNS}, p.description, p.size, p.colour, p.category_id
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1 AND p.is_active = TRUE`,
    [slug]
  )

  if (result.rowCount === 0) {
    throw new ApiError(404, 'Product not found.')
  }

  const row = result.rows[0]
  return {
    ...mapProduct(row),
    description: row.description,
    size: row.size,
    colour: row.colour,
  }
}

// Related products: same category, excluding the product itself.
export async function getRelatedProducts(slug, limit = 4) {
  const result = await query(
    `SELECT ${LIST_COLUMNS}
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = TRUE
       AND p.slug <> $1
       AND p.category_id = (SELECT category_id FROM products WHERE slug = $1)
     ORDER BY p.is_popular DESC, p.created_at DESC
     LIMIT $2`,
    [slug, Math.min(8, Math.max(1, Number(limit) || 4))]
  )
  return result.rows.map(mapProduct)
}