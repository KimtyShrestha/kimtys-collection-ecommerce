import api from './api'

export async function fetchProducts(params = {}) {
  const response = await api.get('/products', { params })
  return response.data.data.products
}

export async function fetchProductBySlug(slug) {
  const response = await api.get(`/products/${slug}`)
  return response.data.data.product
}

export async function fetchCategories() {
  const response = await api.get('/categories')
  return response.data.data.categories
}