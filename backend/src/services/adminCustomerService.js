import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

export async function listCustomers({ search, page = 1, pageSize = 20 } = {}) {
  const conditions = ["u.role = 'customer'"]
  const params = []
  const add = (value) => { params.push(value); return `$${params.length}` }

  if (search?.trim()) {
    const term = `%${search.trim()}%`
    conditions.push(`(u.full_name ILIKE ${add(term)} OR u.email ILIKE ${add(term)} OR u.phone ILIKE ${add(term)})`)
  }

  const where = conditions.join(' AND ')
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const safeSize = Math.min(50, Math.max(1, Number.parseInt(pageSize, 10) || 20))
  const offset = (safePage - 1) * safeSize

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM users u WHERE ${where}`, params
  )
  const total = Number(countResult.rows[0].total)

  const listParams = [...params, safeSize, offset]
  const result = await query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.created_at,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     WHERE ${where}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  )

  return {
    customers: result.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      isActive: row.is_active,
      orderCount: Number(row.order_count),
      totalSpent: Number(row.total_spent),
      createdAt: row.created_at,
    })),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  }
}

export async function getCustomer(id) {
  const result = await query(
    `SELECT id, full_name, email, phone, is_active, created_at
     FROM users WHERE id = $1 AND role = 'customer'`,
    [id]
  )
  if (result.rowCount === 0) throw new ApiError(404, 'Customer not found.')
  const customer = result.rows[0]

  const orders = await query(
    `SELECT order_number, status, total, created_at,
            (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
     FROM orders o WHERE user_id = $1 ORDER BY created_at DESC`,
    [id]
  )

  const addresses = await query(
    'SELECT label, recipient_name, phone, city, area, street, landmark, is_default FROM addresses WHERE user_id = $1 ORDER BY is_default DESC',
    [id]
  )

  return {
    id: customer.id,
    fullName: customer.full_name,
    email: customer.email,
    phone: customer.phone,
    isActive: customer.is_active,
    createdAt: customer.created_at,
    orders: orders.rows.map((row) => ({
      orderNumber: row.order_number,
      status: row.status,
      total: Number(row.total),
      itemCount: Number(row.item_count),
      createdAt: row.created_at,
    })),
    addresses: addresses.rows.map((row) => ({
      label: row.label,
      recipientName: row.recipient_name,
      phone: row.phone,
      city: row.city,
      area: row.area,
      street: row.street,
      landmark: row.landmark,
      isDefault: row.is_default,
    })),
  }
}