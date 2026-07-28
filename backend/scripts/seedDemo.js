// Creates demonstration customers, addresses, orders across every status,
// and approved reviews — so screenshots show a realistic, active store.
// Safe to re-run: skips data that already exists.
// Usage: npm run seed:demo

import bcrypt from 'bcrypt'
import pg from 'pg'
import env from '../src/config/env.js'

const { Client } = pg
const PASSWORD = 'Demo#2026'

const CUSTOMERS = [
  { name: 'Kalpana Shrestha', email: 'kalpana@example.com', phone: '9841234501',
    address: { label: 'Home', city: 'Kathmandu', area: 'Basundhara', street: 'Ring Road', landmark: 'Near Basundhara Chowk' } },
  { name: 'Renuka Shrestha', email: 'renuka@example.com', phone: '9841234502',
    address: { label: 'Office', city: 'Kathmandu', area: 'Durbarmarg', street: 'Jamal Road', landmark: 'Opposite Hotel Annapurna' } },
  { name: 'Kumar Shrestha', email: 'kumar@example.com', phone: '9841234503',
    address: { label: 'Home', city: 'Kathmandu', area: 'Banasthali', street: null, landmark: 'Behind Banasthali School' } },
  { name: 'Melisha Adhikari', email: 'melisha@example.com', phone: '9841234504',
    address: { label: 'Home', city: 'Lalitpur', area: 'Pulchowk', street: 'Pulchowk Road', landmark: 'Near Engineering Campus' } },
  { name: 'Dipsha Thapa', email: 'dipsha@example.com', phone: '9841234505',
    address: { label: 'Home', city: 'Kathmandu', area: 'Hattigauda', street: null, landmark: 'Near Budhanilkantha Road' } },
]

// [customerIndex, [ [productSlug, qty], ... ], status, paymentMethod, daysAgo]
const ORDERS = [
  [0, [['newborn-cotton-bodysuit-5-pack', 2], ['muslin-swaddle-wrap-set-3', 1]], 'delivered', 'cod', 18],
  [1, [['ergonomic-school-backpack', 1], ['insulated-steel-water-bottle', 2], ['two-compartment-lunch-box', 1]], 'delivered', 'esewa', 14],
  [2, [['velcro-school-shoes', 2], ['cotton-socks-6-pack', 3]], 'delivered', 'cod', 11],
  [3, [['newborn-welcome-gift-hamper', 1]], 'shipped', 'khalti', 4],
  [0, [['floral-summer-dress-girls', 1], ['hair-accessories-gift-set', 1]], 'shipped', 'cod', 3],
  [4, [['wooden-building-blocks-60', 1], ['soft-plush-elephant-40cm', 1]], 'processing', 'esewa', 2],
  [1, [['hooded-winter-jacket-boys', 1], ['kids-woollen-beanie-glove-set', 2]], 'confirmed', 'cod', 1],
  [2, [['graphic-cotton-tshirt-3-pack-boys', 2]], 'pending', 'cod', 0],
  [3, [['remote-control-off-road-car', 1]], 'pending', 'khalti', 0],
  [4, [['light-up-sneakers', 1], ['sun-hat-chin-strap', 1]], 'cancelled', 'cod', 7],
]

const REVIEWS = [
  [0, 'newborn-cotton-bodysuit-5-pack', 5, 'Soft and well made', 'Bought these for my newborn and they have washed beautifully. The envelope neckline makes changing so much easier.'],
  [1, 'ergonomic-school-backpack', 5, 'Perfect for school', 'My daughter carries it every day and the padded straps really do make a difference. The bottle pocket is a nice touch.'],
  [2, 'velcro-school-shoes', 4, 'Good quality, sizing runs small', 'Comfortable and sturdy for daily school use. I would suggest ordering one size up.'],
  [3, 'newborn-welcome-gift-hamper', 5, 'Lovely gift', 'Gave this to my cousin for her baby shower and everyone was impressed with the presentation.'],
  [0, 'floral-summer-dress-girls', 5, 'My daughter loves it', 'The fabric is light and perfect for warm weather, and she loves how the skirt twirls.'],
  [4, 'wooden-building-blocks-60', 4, 'Keeps them busy', 'Well-sanded blocks with no rough edges. The storage tub is useful for tidying up afterwards.'],
]

const DELIVERY_FEE = 100
const FREE_ABOVE = 3000

async function main() {
  const client = new Client(env.db)
  await client.connect()

  try {
    await client.query('BEGIN')

    // --- Customers + addresses ---
    const passwordHash = await bcrypt.hash(PASSWORD, 10)
    const customerIds = []

    for (const customer of CUSTOMERS) {
      const result = await client.query(
        `INSERT INTO users (full_name, email, password_hash, phone, role)
         VALUES ($1,$2,$3,$4,'customer')
         ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
         RETURNING id`,
        [customer.name, customer.email, passwordHash, customer.phone]
      )
      const userId = result.rows[0].id
      customerIds.push(userId)

      const hasAddress = await client.query(
        'SELECT id FROM addresses WHERE user_id = $1', [userId]
      )
      if (hasAddress.rowCount === 0) {
        await client.query(
          `INSERT INTO addresses
            (user_id, label, recipient_name, phone, city, area, street, landmark, is_default)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)`,
          [
            userId, customer.address.label, customer.name, customer.phone,
            customer.address.city, customer.address.area,
            customer.address.street, customer.address.landmark,
          ]
        )
      }
    }
    console.log(`Customers ready: ${customerIds.length}`)

    // --- Orders ---
    const year = new Date().getFullYear()
    // Use the highest existing sequence, not the count — deleted orders
    // would otherwise cause collisions.
    const existingMax = await client.query(
      `SELECT COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)), 0) AS max_seq
       FROM orders WHERE order_number LIKE $1`,
      [`KC-${year}-%`]
    )
    let sequence = Number(existingMax.rows[0].max_seq)
    let ordersCreated = 0

    for (const [customerIndex, lines, status, payment, daysAgo] of ORDERS) {
      const userId = customerIds[customerIndex]
      const customer = CUSTOMERS[customerIndex]

      // Resolve products and prices.
      const items = []
      let subtotal = 0
      let missing = false

      for (const [slug, quantity] of lines) {
        const productResult = await client.query(
          'SELECT id, name, price, discount_price, stock FROM products WHERE slug = $1',
          [slug]
        )
        if (productResult.rowCount === 0) {
          console.log(`  skipping order — product not found: ${slug}`)
          missing = true
          break
        }
        const product = productResult.rows[0]
        const unitPrice = Number(product.discount_price ?? product.price)
        const lineTotal = unitPrice * quantity
        subtotal += lineTotal
        items.push({ ...product, quantity, unitPrice, lineTotal })
      }
      if (missing) continue

      sequence += 1
      const orderNumber = `KC-${year}-${String(sequence).padStart(4, '0')}`
      const deliveryFee = subtotal >= FREE_ABOVE ? 0 : DELIVERY_FEE
      const total = subtotal + deliveryFee
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      const paymentStatus = status === 'delivered' ? 'paid' : 'unpaid'

      const orderResult = await client.query(
        `INSERT INTO orders
          (order_number, user_id, status, payment_method, payment_status,
           shipping_name, shipping_phone, shipping_city, shipping_area,
           shipping_street, shipping_landmark,
           subtotal, delivery_fee, total, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$15)
         RETURNING id`,
        [
          orderNumber, userId, status, payment, paymentStatus,
          customer.name, customer.phone, customer.address.city, customer.address.area,
          customer.address.street, customer.address.landmark,
          subtotal, deliveryFee, total, createdAt,
        ]
      )
      const orderId = orderResult.rows[0].id

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items
            (order_id, product_id, product_name, unit_price, quantity, line_total)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderId, item.id, item.name, item.unitPrice, item.quantity, item.lineTotal]
        )
        // Cancelled orders never consumed stock.
        if (status !== 'cancelled') {
          await client.query(
            'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
            [item.quantity, item.id]
          )
        }
      }
      ordersCreated += 1
      console.log(`  ${orderNumber}  ${status.padEnd(10)} Rs. ${total}`)
    }
    console.log(`Orders created: ${ordersCreated}`)

    // --- Reviews (pre-approved so ratings appear in screenshots) ---
    let reviewsCreated = 0
    for (const [customerIndex, slug, rating, title, comment] of REVIEWS) {
      const productResult = await client.query(
        'SELECT id FROM products WHERE slug = $1', [slug]
      )
      if (productResult.rowCount === 0) continue

      const result = await client.query(
        `INSERT INTO reviews (product_id, user_id, rating, title, comment, status)
         VALUES ($1,$2,$3,$4,$5,'approved')
         ON CONFLICT (product_id, user_id) DO NOTHING
         RETURNING id`,
        [productResult.rows[0].id, customerIds[customerIndex], rating, title, comment]
      )
      if (result.rowCount > 0) reviewsCreated += 1
    }
    console.log(`Reviews created: ${reviewsCreated}`)

    await client.query('COMMIT')

    console.log(`\nDemo data ready. Customer login password: ${PASSWORD}`)
    console.log('Emails: ' + CUSTOMERS.map((c) => c.email).join(', '))
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Demo seed FAILED:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()