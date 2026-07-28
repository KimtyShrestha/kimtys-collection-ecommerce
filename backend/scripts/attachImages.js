// Attaches images in backend/uploads/products/ to products by filename.
// Filename (without extension) must match the product slug.
//   e.g. floral-summer-dress-girls.jpg -> product with slug floral-summer-dress-girls
// Safe to re-run: skips products that already have images.
// Usage: npm run seed:images

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import env from '../src/config/env.js'

const { Client } = pg
const DIR = 'uploads/products'
const VALID = ['.jpg', '.jpeg', '.png', '.webp']

async function main() {
  const client = new Client(env.db)
  await client.connect()

  try {
    const files = (await readdir(DIR)).filter((file) =>
      VALID.includes(path.extname(file).toLowerCase())
    )

    if (files.length === 0) {
      console.log(`No images found in ${DIR}. Add images named after product slugs.`)
      return
    }

    let attached = 0
    let skipped = 0
    let unmatched = []

    for (const file of files) {
      const slug = path.basename(file, path.extname(file))

      const product = await client.query(
        'SELECT id, name FROM products WHERE slug = $1',
        [slug]
      )

      if (product.rowCount === 0) {
        unmatched.push(file)
        continue
      }

      const productId = product.rows[0].id
      const imagePath = `/uploads/products/${file}`

      const existing = await client.query(
        'SELECT id FROM product_images WHERE product_id = $1 AND image_path = $2',
        [productId, imagePath]
      )
      if (existing.rowCount > 0) {
        skipped += 1
        continue
      }

      const count = await client.query(
        'SELECT COUNT(*) AS count FROM product_images WHERE product_id = $1',
        [productId]
      )
      const isFirst = Number(count.rows[0].count) === 0

      await client.query(
        `INSERT INTO product_images (product_id, image_path, is_primary, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, imagePath, isFirst, Number(count.rows[0].count)]
      )
      attached += 1
      console.log(`attached  ${file} -> ${product.rows[0].name}`)
    }

    // Report coverage so you know what still needs a photo.
    const without = await client.query(
      `SELECT slug FROM products p
       WHERE p.is_active = TRUE
         AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)
       ORDER BY slug`
    )

    console.log(`\nAttached: ${attached} · Already present: ${skipped}`)
    if (unmatched.length > 0) {
      console.log(`\nNo matching product for these files (check the slug):`)
      unmatched.forEach((file) => console.log(`  ${file}`))
    }
    if (without.rowCount > 0) {
      console.log(`\nProducts still without an image (${without.rowCount}):`)
      without.rows.forEach((row) => console.log(`  ${row.slug}`))
    } else {
      console.log('\nEvery active product has at least one image.')
    }
  } catch (error) {
    console.error('Image attach FAILED:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()