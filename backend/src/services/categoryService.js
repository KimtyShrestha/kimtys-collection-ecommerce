import { query } from '../config/db.js'

// Active categories with a live product count per category.
export async function listCategories() {
  const result = await query(
    `SELECT c.id, c.name, c.slug, c.description, c.image_path, c.sort_order,
            COUNT(p.id) FILTER (WHERE p.is_active = TRUE) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     WHERE c.is_active = TRUE
     GROUP BY c.id
     ORDER BY c.sort_order ASC, c.name ASC`
  )

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imagePath: row.image_path,
    productCount: Number(row.product_count),
  }))
}