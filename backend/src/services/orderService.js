import { getClient, query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

const DELIVERY_FEE = 100
const FREE_DELIVERY_ABOVE = 3000

// KC-2026-0001 style: year + zero-padded sequence within the year.
async function nextOrderNumber(client) {
  const year = new Date().getFullYear()
  const result = await client.query(
    `SELECT COUNT(*) AS count FROM orders
     WHERE order_number LIKE $1`,
    [`KC-${year}-%`]
  )
  const sequence = Number(result.rows[0].count) + 1
  return `KC-${year}-${String(sequence).padStart(4, '0')}`
}

function mapOrder(orderRow, itemRows) {
  return {
    id: orderRow.id,
    orderNumber: orderRow.order_number,
    status: orderRow.status,
    paymentMethod: orderRow.payment_method,
    paymentStatus: orderRow.payment_status,
    shipping: {
      name: orderRow.shipping_name,
      phone: orderRow.shipping_phone,
      city: orderRow.shipping_city,
      area: orderRow.shipping_area,
      street: orderRow.shipping_street,
      landmark: orderRow.shipping_landmark,
    },
    subtotal: Number(orderRow.subtotal),
    deliveryFee: Number(orderRow.delivery_fee),
    total: Number(orderRow.total),
    createdAt: orderRow.created_at,
    items: itemRows.map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
      slug: item.slug,
      imagePath: item.image_path,
    })),
  }
}

// Creates an order inside a single transaction.
// Client sends ONLY { productId, quantity } — prices come from the DB.
export async function createOrder(userId, { items, paymentMethod, shipping }) {
  // Merge duplicate product lines defensively.
  const merged = new Map()
  for (const item of items) {
    const id = Number(item.productId)
    merged.set(id, (merged.get(id) || 0) + Number(item.quantity))
  }

  const client = await getClient()
  try {
    await client.query('BEGIN')

    // Lock the product rows so concurrent orders can't oversell.
    const ids = [...merged.keys()]
    const productResult = await client.query(
      `SELECT id, name, price, discount_price, stock, is_active
       FROM products WHERE id = ANY($1) FOR UPDATE`,
      [ids]
    )

    const products = new Map(productResult.rows.map((row) => [row.id, row]))

    // Validate every line against live data.
    let subtotal = 0
    const lines = []
    for (const [productId, quantity] of merged) {
      const product = products.get(productId)
      if (!product || !product.is_active) {
        throw new ApiError(400, 'One of the items in your cart is no longer available. Please review your cart.')
      }
      if (product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} of "${product.name}" ${product.stock === 1 ? 'is' : 'are'} in stock. Please adjust your cart.`)
      }
      const unitPrice = Number(product.discount_price ?? product.price)
      const lineTotal = unitPrice * quantity
      subtotal += lineTotal
      lines.push({ productId, name: product.name, unitPrice, quantity, lineTotal })
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
    const total = subtotal + deliveryFee
    const orderNumber = await nextOrderNumber(client)

    // Insert the order (shipping snapshotted).
    const orderResult = await client.query(
      `INSERT INTO orders
        (order_number, user_id, payment_method,
         shipping_name, shipping_phone, shipping_city, shipping_area,
         shipping_street, shipping_landmark,
         subtotal, delivery_fee, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        orderNumber, userId, paymentMethod,
        shipping.name, shipping.phone, shipping.city, shipping.area,
        shipping.street || null, shipping.landmark || null,
        subtotal, deliveryFee, total,
      ]
    )
    const order = orderResult.rows[0]

    // Insert items (name/price snapshotted) and decrement stock.
    for (const line of lines) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, unit_price, quantity, line_total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, line.productId, line.name, line.unitPrice, line.quantity, line.lineTotal]
      )
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [line.quantity, line.productId]
      )
    }

    await client.query('COMMIT')

    return mapOrder(order, lines.map((line) => ({
      product_id: line.productId,
      product_name: line.name,
      unit_price: line.unitPrice,
      quantity: line.quantity,
      line_total: line.lineTotal,
    })))
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Fetch one order by number — owner only (admin access arrives Phase 18).
export async function getOrderByNumber(userId, orderNumber) {
  const orderResult = await query(
    'SELECT * FROM orders WHERE order_number = $1 AND user_id = $2',
    [orderNumber, userId]
  )
  if (orderResult.rowCount === 0) {
    throw new ApiError(404, 'Order not found.')
  }
  const order = orderResult.rows[0]

  const itemsResult = await query(
    `SELECT oi.*, p.slug,
            (SELECT pi.image_path FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS image_path
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [order.id]
  )

  return mapOrder(order, itemsResult.rows)
}

// Order history for the logged-in customer (newest first).
export async function listUserOrders(userId) {
  const result = await query(
    `SELECT o.order_number, o.status, o.payment_method, o.total, o.created_at,
            COUNT(oi.id) AS item_count
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  )
  return result.rows.map((row) => ({
    orderNumber: row.order_number,
    status: row.status,
    paymentMethod: row.payment_method,
    total: Number(row.total),
    itemCount: Number(row.item_count),
    createdAt: row.created_at,
  }))
}