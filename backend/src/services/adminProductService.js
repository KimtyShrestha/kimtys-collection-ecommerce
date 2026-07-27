import fs from 'node:fs/promises'
import path from 'node:path'
import { query, getClient } from '../config/db.js'
import { ApiError } from '../utils/response.js'

// URL-safe slug from a product name.
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 170)
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base
  let suffix = 1
  // Loop until the slug is free (excluding the product being edited).
  for (;;) {
    const result = await query(
      'SELECT id FROM products WHERE slug = $1 AND ($2::int IS NULL OR id <> $2)',
      [slug, excludeId]
    )
    if (result.rowCount === 0) return slug
    suffix += 1
    slug = `${base}-${suffix}`
  }
}

function mapAdminProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    discountPrice: row.discount_price === null ? null : Number(row.discount_price),
    stock: row.stock,
    ageGroup: row.age_group,
    size: row.size,
    colour: row.colour,
    isFeatured: row.is_featured,
    isNewArrival: row.is_new_arrival,
    isPopular: row.is_popular,
    isActive: row.is_active,
    categoryId: row.category_id,
    categoryName: row.category_name,
    imagePath: row.image_path,
    createdAt: row.created_at,
  }
}

// Admin listing: includes inactive products, supports search/filters.
export async function listAdminProducts({
  search, category, stockLevel, status, page = 1, pageSize = 20,
} = {}) {
  const conditions = ['1 = 1']
  const params = []
  const add = (value) => { params.push(value); return `$${params.length}` }

  if (search?.trim()) {
    conditions.push(`p.name ILIKE ${add(`%${search.trim()}%`)}`)
  }
  if (category) conditions.push(`c.slug = ${add(category)}`)
  if (stockLevel === 'out') conditions.push('p.stock = 0')
  if (stockLevel === 'low') conditions.push('p.stock > 0 AND p.stock <= 5')
  if (status === 'active') conditions.push('p.is_active = TRUE')
  if (status === 'inactive') conditions.push('p.is_active = FALSE')

  const where = conditions.join(' AND ')
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const safeSize = Math.min(50, Math.max(1, Number.parseInt(pageSize, 10) || 20))
  const offset = (safePage - 1) * safeSize

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM products p
     JOIN categories c ON c.id = p.category_id WHERE ${where}`,
    params
  )
  const total = Number(countResult.rows[0].total)

  const listParams = [...params, safeSize, offset]
  const result = await query(
    `SELECT p.*, c.name AS category_name,
            (SELECT pi.image_path FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS image_path
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE ${where}
     ORDER BY p.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  )

  return {
    products: result.rows.map(mapAdminProduct),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  }
}

export async function getAdminProduct(id) {
  const result = await query(
    `SELECT p.*, c.name AS category_name
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Product not found.')

  const images = await query(
    `SELECT id, image_path, is_primary, sort_order
     FROM product_images WHERE product_id = $1
     ORDER BY is_primary DESC, sort_order ASC`,
    [id]
  )

  return {
    ...mapAdminProduct(result.rows[0]),
    images: images.rows.map((row) => ({
      id: row.id,
      imagePath: row.image_path,
      isPrimary: row.is_primary,
    })),
  }
}

function parseProductBody(body) {
  const price = Number(body.price)
  const discountPrice = body.discountPrice === '' || body.discountPrice == null
    ? null : Number(body.discountPrice)

  if (discountPrice !== null && discountPrice >= price) {
    throw new ApiError(400, 'Discount price must be lower than the regular price.')
  }

  return {
    categoryId: Number(body.categoryId),
    name: body.name.trim(),
    description: body.description?.trim() || null,
    price,
    discountPrice,
    stock: Number(body.stock),
    ageGroup: body.ageGroup || 'all',
    size: body.size?.trim() || null,
    colour: body.colour?.trim() || null,
    isFeatured: body.isFeatured === 'true' || body.isFeatured === true,
    isNewArrival: body.isNewArrival === 'true' || body.isNewArrival === true,
    isPopular: body.isPopular === 'true' || body.isPopular === true,
    isActive: body.isActive === undefined ? true : (body.isActive === 'true' || body.isActive === true),
  }
}

export async function createProduct(body, files = []) {
  const data = parseProductBody(body)
  const slug = await uniqueSlug(slugify(data.name))

  const client = await getClient()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      `INSERT INTO products
        (category_id, name, slug, description, price, discount_price, stock,
         age_group, size, colour, is_featured, is_new_arrival, is_popular, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        data.categoryId, data.name, slug, data.description, data.price,
        data.discountPrice, data.stock, data.ageGroup, data.size, data.colour,
        data.isFeatured, data.isNewArrival, data.isPopular, data.isActive,
      ]
    )
    const product = result.rows[0]

    for (const [index, file] of files.entries()) {
      await client.query(
        `INSERT INTO product_images (product_id, image_path, is_primary, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [product.id, `/uploads/products/${file.filename}`, index === 0, index]
      )
    }

    await client.query('COMMIT')
    return getAdminProduct(product.id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateProduct(id, body, files = []) {
  const existing = await query('SELECT id, name, slug FROM products WHERE id = $1', [id])
  if (existing.rowCount === 0) throw new ApiError(404, 'Product not found.')

  const data = parseProductBody(body)
  // Only regenerate the slug if the name actually changed.
  const slug = data.name === existing.rows[0].name
    ? existing.rows[0].slug
    : await uniqueSlug(slugify(data.name), Number(id))

  const client = await getClient()
  try {
    await client.query('BEGIN')
    await client.query(
      `UPDATE products SET
        category_id=$1, name=$2, slug=$3, description=$4, price=$5,
        discount_price=$6, stock=$7, age_group=$8, size=$9, colour=$10,
        is_featured=$11, is_new_arrival=$12, is_popular=$13, is_active=$14,
        updated_at=NOW()
       WHERE id=$15`,
      [
        data.categoryId, data.name, slug, data.description, data.price,
        data.discountPrice, data.stock, data.ageGroup, data.size, data.colour,
        data.isFeatured, data.isNewArrival, data.isPopular, data.isActive, id,
      ]
    )

    if (files.length > 0) {
      const countResult = await client.query(
        'SELECT COUNT(*) AS count FROM product_images WHERE product_id = $1',
        [id]
      )
      let sortStart = Number(countResult.rows[0].count)
      for (const file of files) {
        await client.query(
          `INSERT INTO product_images (product_id, image_path, is_primary, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [id, `/uploads/products/${file.filename}`, sortStart === 0, sortStart]
        )
        sortStart += 1
      }
    }

    await client.query('COMMIT')
    return getAdminProduct(id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Soft delete: order history must survive (order_items FK is RESTRICT).
export async function deactivateProduct(id) {
  const result = await query(
    'UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Product not found.')
}

export async function deleteProductImage(productId, imageId) {
  const result = await query(
    'DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING image_path, is_primary',
    [imageId, productId]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Image not found.')

  // Promote another image to primary if we removed the primary one.
  if (result.rows[0].is_primary) {
    await query(
      `UPDATE product_images SET is_primary = TRUE
       WHERE id = (SELECT id FROM product_images WHERE product_id = $1
                   ORDER BY sort_order ASC LIMIT 1)`,
      [productId]
    )
  }

  // Remove the file from disk; ignore if already gone.
  try {
    await fs.unlink(path.join('uploads/products', path.basename(result.rows[0].image_path)))
  } catch {
    // File missing — nothing to clean up.
  }
}