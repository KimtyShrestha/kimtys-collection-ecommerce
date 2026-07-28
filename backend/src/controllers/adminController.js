import { getDashboardStats } from '../services/adminService.js'
import {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProductImage,
} from '../services/adminProductService.js'
import {
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/adminCategoryService.js'
import { sendSuccess } from '../utils/response.js'
import {
  listAdminOrders, getAdminOrder, updateOrderStatus,
} from '../services/adminOrderService.js'
import { listCustomers, getCustomer } from '../services/adminCustomerService.js'
import { listAdminReviews, moderateReview } from '../services/adminReviewService.js'

// --- Dashboard ---
export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats()
    sendSuccess(res, { message: 'Dashboard statistics retrieved successfully.', data: stats })
  } catch (error) {
    next(error)
  }
}

// --- Products ---
export async function getProducts(req, res, next) {
  try {
    const data = await listAdminProducts(req.query)
    sendSuccess(res, { message: 'Products retrieved successfully.', data })
  } catch (error) {
    next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await getAdminProduct(req.params.id)
    sendSuccess(res, { message: 'Product retrieved successfully.', data: { product } })
  } catch (error) {
    next(error)
  }
}

export async function postProduct(req, res, next) {
  try {
    const product = await createProduct(req.body, req.files || [])
    sendSuccess(res, { statusCode: 201, message: 'Product created successfully.', data: { product } })
  } catch (error) {
    next(error)
  }
}

export async function putProduct(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body, req.files || [])
    sendSuccess(res, { message: 'Product updated successfully.', data: { product } })
  } catch (error) {
    next(error)
  }
}

export async function removeProduct(req, res, next) {
  try {
    await deactivateProduct(req.params.id)
    sendSuccess(res, { message: 'Product removed from the store.' })
  } catch (error) {
    next(error)
  }
}

export async function removeProductImage(req, res, next) {
  try {
    await deleteProductImage(req.params.id, req.params.imageId)
    sendSuccess(res, { message: 'Image deleted.' })
  } catch (error) {
    next(error)
  }
}

// --- Categories ---
export async function getCategories(req, res, next) {
  try {
    const categories = await listAdminCategories()
    sendSuccess(res, { message: 'Categories retrieved successfully.', data: { categories } })
  } catch (error) {
    next(error)
  }
}

export async function postCategory(req, res, next) {
  try {
    const category = await createCategory(req.body)
    sendSuccess(res, { statusCode: 201, message: 'Category created successfully.', data: { category } })
  } catch (error) {
    next(error)
  }
}

export async function putCategory(req, res, next) {
  try {
    const category = await updateCategory(req.params.id, req.body)
    sendSuccess(res, { message: 'Category updated successfully.', data: { category } })
  } catch (error) {
    next(error)
  }
}

export async function removeCategory(req, res, next) {
  try {
    await deleteCategory(req.params.id)
    sendSuccess(res, { message: 'Category deleted.' })
  } catch (error) {
    next(error)
  }
}

// --- Orders ---
export async function getOrders(req, res, next) {
  try {
    const data = await listAdminOrders(req.query)
    sendSuccess(res, { message: 'Orders retrieved successfully.', data })
  } catch (error) {
    next(error)
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await getAdminOrder(req.params.orderNumber)
    sendSuccess(res, { message: 'Order retrieved successfully.', data: { order } })
  } catch (error) {
    next(error)
  }
}

export async function patchOrderStatus(req, res, next) {
  try {
    const order = await updateOrderStatus(
      req.params.orderNumber, req.body.status, req.body.paymentStatus
    )
    sendSuccess(res, { message: 'Order status updated.', data: { order } })
  } catch (error) {
    next(error)
  }
}

// --- Customers ---
export async function getCustomers(req, res, next) {
  try {
    const data = await listCustomers(req.query)
    sendSuccess(res, { message: 'Customers retrieved successfully.', data })
  } catch (error) {
    next(error)
  }
}

export async function getCustomerDetail(req, res, next) {
  try {
    const customer = await getCustomer(req.params.id)
    sendSuccess(res, { message: 'Customer retrieved successfully.', data: { customer } })
  } catch (error) {
    next(error)
  }
}

// --- Reviews ---
export async function getReviews(req, res, next) {
  try {
    const data = await listAdminReviews(req.query)
    sendSuccess(res, { message: 'Reviews retrieved successfully.', data })
  } catch (error) {
    next(error)
  }
}

export async function patchReviewStatus(req, res, next) {
  try {
    await moderateReview(req.params.id, req.body.status)
    sendSuccess(res, { message: 'Review updated.' })
  } catch (error) {
    next(error)
  }
}