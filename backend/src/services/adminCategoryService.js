import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

function slugify(name) {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 78)
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    productCount: Number(row.product_count ?? 0),
  }
}

export async function listAdminCategories() {
  const result = await query(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.sort_order ASC, c.name ASC`
  )
  return result.rows.map(mapCategory)
}

export async function createCategory({ name, description, sortOrder, isActive }) {
  const slug = slugify(name)
  const clash = await query('SELECT id FROM categories WHERE slug = $1', [slug])
  if (clash.rowCount > 0) {
    throw new ApiError(409, 'A category with this name already exists.')
  }

  const result = await query(
    `INSERT INTO categories (name, slug, description, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      name.trim(), slug, description?.trim() || null,
      Number(sortOrder) || 0,
      isActive === undefined ? true : !!isActive,
    ]
  )
  return mapCategory(result.rows[0])
}

export async function updateCategory(id, { name, description, sortOrder, isActive }) {
  const existing = await query('SELECT id, name, slug FROM categories WHERE id = $1', [id])
  if (existing.rowCount === 0) throw new ApiError(404, 'Category not found.')

  let slug = existing.rows[0].slug
  if (name.trim() !== existing.rows[0].name) {
    slug = slugify(name)
    const clash = await query(
      'SELECT id FROM categories WHERE slug = $1 AND id <> $2', [slug, id]
    )
    if (clash.rowCount > 0) {
      throw new ApiError(409, 'A category with this name already exists.')
    }
  }

  const result = await query(
    `UPDATE categories
     SET name=$1, slug=$2, description=$3, sort_order=$4, is_active=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [
      name.trim(), slug, description?.trim() || null,
      Number(sortOrder) || 0,
      isActive === undefined ? true : !!isActive,
      id,
    ]
  )
  return mapCategory(result.rows[0])
}

// Categories holding products cannot be deleted (FK is RESTRICT) —
// we explain rather than let the database error leak through.
export async function deleteCategory(id) {
  const products = await query(
    'SELECT COUNT(*) AS count FROM products WHERE category_id = $1', [id]
  )
  if (Number(products.rows[0].count) > 0) {
    throw new ApiError(
      400,
      'This category still contains products. Move or remove them before deleting it.'
    )
  }
  const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id])
  if (result.rowCount === 0) throw new ApiError(404, 'Category not found.')
}