import { createOrder, getOrderByNumber, listUserOrders } from '../services/orderService.js'

import { sendSuccess } from '../utils/response.js'

// POST /api/orders — logged-in customers
export async function placeOrder(req, res, next) {
  try {
    const order = await createOrder(req.user.id, req.body)
    sendSuccess(res, {
      statusCode: 201,
      message: 'Order placed successfully.',
      data: { order },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/orders/:orderNumber — owner only
export async function getOrder(req, res, next) {
  try {
    const order = await getOrderByNumber(req.user.id, req.params.orderNumber)
    sendSuccess(res, {
      message: 'Order retrieved successfully.',
      data: { order },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/orders — history for the logged-in customer
export async function getMyOrders(req, res, next) {
  try {
    const orders = await listUserOrders(req.user.id)
    sendSuccess(res, { message: 'Orders retrieved successfully.', data: { orders } })
  } catch (error) {
    next(error)
  }
}