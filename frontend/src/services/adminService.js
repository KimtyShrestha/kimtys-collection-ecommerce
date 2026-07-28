import api from './api'

export async function apiGetDashboard() {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

// --- Products ---
export async function apiListAdminProducts(params = {}) {
  const response = await api.get('/admin/products', { params })
  return response.data.data
}

export async function apiGetAdminProduct(id) {
  const response = await api.get(`/admin/products/${id}`)
  return response.data.data.product
}

// formData: multipart (text fields + optional image files)
export async function apiCreateProduct(formData) {
  const response = await api.post('/admin/products', formData)
  return response.data.data.product
}

export async function apiUpdateProduct(id, formData) {
  const response = await api.put(`/admin/products/${id}`, formData)
  return response.data.data.product
}

export async function apiDeleteProduct(id) {
  await api.delete(`/admin/products/${id}`)
}

export async function apiDeleteProductImage(productId, imageId) {
  await api.delete(`/admin/products/${productId}/images/${imageId}`)
}

// --- Categories ---
export async function apiListAdminCategories() {
  const response = await api.get('/admin/categories')
  return response.data.data.categories
}

export async function apiCreateCategory(payload) {
  const response = await api.post('/admin/categories', payload)
  return response.data.data.category
}

export async function apiUpdateCategory(id, payload) {
  const response = await api.put(`/admin/categories/${id}`, payload)
  return response.data.data.category
}

export async function apiDeleteCategory(id) {
  await api.delete(`/admin/categories/${id}`)
}

// --- Orders ---
export async function apiListAdminOrders(params = {}) {
  const response = await api.get('/admin/orders', { params })
  return response.data.data
}

export async function apiGetAdminOrder(orderNumber) {
  const response = await api.get(`/admin/orders/${orderNumber}`)
  return response.data.data.order
}

export async function apiUpdateOrderStatus(orderNumber, payload) {
  const response = await api.patch(`/admin/orders/${orderNumber}/status`, payload)
  return response.data.data.order
}

// --- Customers ---
export async function apiListCustomers(params = {}) {
  const response = await api.get('/admin/customers', { params })
  return response.data.data
}

export async function apiGetCustomer(id) {
  const response = await api.get(`/admin/customers/${id}`)
  return response.data.data.customer
}

// --- Reviews ---
export async function apiListAdminReviews(params = {}) {
  const response = await api.get('/admin/reviews', { params })
  return response.data.data
}

export async function apiModerateReview(id, status) {
  await api.patch(`/admin/reviews/${id}/status`, { status })
}