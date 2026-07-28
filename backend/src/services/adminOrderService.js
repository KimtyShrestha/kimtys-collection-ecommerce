import { query, getClient } from '../config/db.js'
import { ApiError } from '../utils/response.js'

const TERMINAL = ['delivered', 'cancelled']
const VALID_STATUSES = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
]

export async function listAdminOrders({ search, status, page = 1, pageSize = 20 } = {}) {
  const conditions = ['1 = 1']
  const params = []
  const add = (value) => { params.push(value); return `$${params.length}` }

  if (search?.trim()) {
    const term = `%${search.trim()}%`
    conditions.push(
      `(o.order_number ILIKE ${add(term)} OR u.full_name ILIKE ${add(term)} OR u.email ILIKE ${add(term)})`
    )
  }
  if (status && VALID_STATUSES.includes(status)) {
    conditions.push(`o.status = ${add(status)}`)
  }

  const where = conditions.join(' AND ')
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const safeSize = Math.min(50, Math.max(1, Number.parseInt(pageSize, 10) || 20))
  const offset = (safePage - 1) * safeSize

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.user_id WHERE ${where}`,
    params
  )
  const total = Number(countResult.rows[0].total)

  const listParams = [...params, safeSize, offset]
  const result = await query(
    `SELECT o.id, o.order_number, o.status, o.payment_method, o.payment_status,
            o.total, o.created_at, u.id AS customer_id, u.full_name, u.email,
            (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE ${where}
     ORDER BY o.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  )

  return {
    orders: result.rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      total: Number(row.total),
      itemCount: Number(row.item_count),
      createdAt: row.created_at,
      customer: { id: row.customer_id, fullName: row.full_name, email: row.email },
    })),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  }
}

export async function getAdminOrder(orderNumber) {
  const orderResult = await query(
    `SELECT o.*, u.id AS customer_id, u.full_name, u.email, u.phone
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.order_number = $1`,
    [orderNumber]
  )
  if (orderResult.rowCount === 0) throw new ApiError(404, 'Order not found.')
  const order = orderResult.rows[0]

  const itemsResult = await query(
    `SELECT oi.*, p.slug,
            (SELECT pi.image_path FROM product_images pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS image_path
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1 ORDER BY oi.id`,
    [order.id]
  )

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    shipping: {
      name: order.shipping_name,
      phone: order.shipping_phone,
      city: order.shipping_city,
      area: order.shipping_area,
      street: order.shipping_street,
      landmark: order.shipping_landmark,
    },
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.delivery_fee),
    total: Number(order.total),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    customer: {
      id: order.customer_id,
      fullName: order.full_name,
      email: order.email,
      phone: order.phone,
    },
    items: itemsResult.rows.map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      slug: item.slug,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
      imagePath: item.image_path,
    })),
  }
}

// Cancelling restores stock — inventory must never silently leak.
export async function updateOrderStatus(orderNumber, status, paymentStatus) {
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, 'Invalid order status.')
  }

  const client = await getClient()
  try {
    await client.query('BEGIN')

    const current = await client.query(
      'SELECT id, status FROM orders WHERE order_number = $1 FOR UPDATE',
      [orderNumber]
    )
    if (current.rowCount === 0) throw new ApiError(404, 'Order not found.')

    const order = current.rows[0]
    if (TERMINAL.includes(order.status) && order.status !== status) {
      throw new ApiError(
        400,
        `This order is already marked as ${order.status} and can no longer be changed.`
      )
    }

    if (status === 'cancelled' && order.status !== 'cancelled') {
      const items = await client.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [order.id]
      )
      for (const item of items.rows) {
        await client.query(
          'UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2',
          [item.quantity, item.product_id]
        )
      }
    }

    await client.query(
      `UPDATE orders
       SET status = $1,
           payment_status = COALESCE($2, payment_status),
           updated_at = NOW()
       WHERE id = $3`,
      [status, paymentStatus || null, order.id]
    )

    await client.query('COMMIT')
    return getAdminOrder(orderNumber)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}