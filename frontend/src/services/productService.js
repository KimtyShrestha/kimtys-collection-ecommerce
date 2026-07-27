import api from './api'

// Returns { products, total, page, pageSize, totalPages }.
export async function fetchProductList(params = {}) {
  const response = await api.get('/products', { params })
  return response.data.data
}

// Convenience for places that only need the array (homepage sections).
export async function fetchProducts(params = {}) {
  const data = await fetchProductList(params)
  return data.products
}

export async function fetchProductBySlug(slug) {
  const response = await api.get(`/products/${slug}`)
  return response.data.data.product
}

export async function fetchCategories() {
  const response = await api.get('/categories')
  return response.data.data.categories
}