import api from './api'

// Profile
export async function apiUpdateProfile(payload) {
  const response = await api.put('/users/profile', payload)
  return response.data.data.user
}

export async function apiChangePassword(payload) {
  const response = await api.put('/users/password', payload)
  return response.data.message
}

// Addresses
export async function apiListAddresses() {
  const response = await api.get('/addresses')
  return response.data.data.addresses
}

export async function apiCreateAddress(payload) {
  const response = await api.post('/addresses', payload)
  return response.data.data.address
}

export async function apiUpdateAddress(id, payload) {
  const response = await api.put(`/addresses/${id}`, payload)
  return response.data.data.address
}

export async function apiDeleteAddress(id) {
  await api.delete(`/addresses/${id}`)
}

// Wishlist
export async function apiGetWishlist() {
  const response = await api.get('/wishlist')
  return response.data.data.products
}

export async function apiGetWishlistIds() {
  const response = await api.get('/wishlist/ids')
  return response.data.data.productIds
}

export async function apiAddToWishlist(productId) {
  await api.post('/wishlist', { productId })
}

export async function apiRemoveFromWishlist(productId) {
  await api.delete(`/wishlist/${productId}`)
}

// Orders
export async function apiListMyOrders() {
  const response = await api.get('/orders')
  return response.data.data.orders
}