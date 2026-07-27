import { query } from '../config/db.js'

// Everything the dashboard needs, gathered in one round trip.
export async function getDashboardStats() {
  const [
    counts,
    revenue,
    ordersPerDay,
    recentOrders,
    recentCustomers,
    topProducts,
    categoryBreakdown,
    lowStock,
  ] = await Promise.all([
    query(`
      SELECT
        (SELECT COUNT(*) FROM products WHERE is_active = TRUE)        AS products,
        (SELECT COUNT(*) FROM categories WHERE is_active = TRUE)      AS categories,
        (SELECT COUNT(*) FROM orders)                                 AS orders,
        (SELECT COUNT(*) FROM users WHERE role = 'customer')          AS customers,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending')        AS pending_orders,
        (SELECT COUNT(*) FROM reviews WHERE status = 'pending')       AS pending_reviews
    `),

    query(`
      SELECT COALESCE(SUM(total), 0) AS revenue
      FROM orders WHERE status <> 'cancelled'
    `),

    // Last 7 days, including days with zero orders.
    query(`
      SELECT to_char(d, 'DD Mon') AS label,
             COUNT(o.id)          AS orders,
             COALESCE(SUM(o.total), 0) AS revenue
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') AS d
      LEFT JOIN orders o
        ON o.created_at::date = d::date AND o.status <> 'cancelled'
      GROUP BY d
      ORDER BY d
    `),

    query(`
      SELECT o.order_number, o.status, o.total, o.created_at, u.full_name
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `),

    query(`
      SELECT id, full_name, email, created_at
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
      LIMIT 5
    `),

    query(`
      SELECT oi.product_name, SUM(oi.quantity) AS quantity
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id AND o.status <> 'cancelled'
      GROUP BY oi.product_name
      ORDER BY quantity DESC
      LIMIT 5
    `),

    query(`
      SELECT c.name, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY product_count DESC, c.name ASC
      LIMIT 6
    `),

    query(`
      SELECT id, name, stock
      FROM products
      WHERE is_active = TRUE AND stock <= 5
      ORDER BY stock ASC, name ASC
      LIMIT 5
    `),
  ])

  const c = counts.rows[0]

  return {
    totals: {
      products: Number(c.products),
      categories: Number(c.categories),
      orders: Number(c.orders),
      customers: Number(c.customers),
      pendingOrders: Number(c.pending_orders),
      pendingReviews: Number(c.pending_reviews),
      revenue: Number(revenue.rows[0].revenue),
      lowStockCount: lowStock.rowCount,
    },
    ordersPerDay: ordersPerDay.rows.map((row) => ({
      label: row.label,
      orders: Number(row.orders),
      revenue: Number(row.revenue),
    })),
    recentOrders: recentOrders.rows.map((row) => ({
      orderNumber: row.order_number,
      status: row.status,
      total: Number(row.total),
      customerName: row.full_name,
      createdAt: row.created_at,
    })),
    recentCustomers: recentCustomers.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      createdAt: row.created_at,
    })),
    topProducts: topProducts.rows.map((row) => ({
      name: row.product_name,
      quantity: Number(row.quantity),
    })),
    categoryBreakdown: categoryBreakdown.rows.map((row) => ({
      name: row.name,
      productCount: Number(row.product_count),
    })),
    lowStockProducts: lowStock.rows.map((row) => ({
      id: row.id,
      name: row.name,
      stock: row.stock,
    })),
  }
}