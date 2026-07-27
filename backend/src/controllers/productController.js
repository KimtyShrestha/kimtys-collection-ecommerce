import { listProducts, getProductBySlug } from '../services/productService.js'
import { sendSuccess } from '../utils/response.js'

// GET /api/products?featured=true&limit=8  (etc.)
export async function getProducts(req, res, next) {
  try {
    const products = await listProducts({
      featured: req.query.featured === 'true',
      newArrival: req.query.newArrival === 'true',
      popular: req.query.popular === 'true',
      sale: req.query.sale === 'true',
      limit: req.query.limit,
    })
    sendSuccess(res, {
      message: 'Products retrieved successfully.',
      data: { products },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/products/:slug
export async function getProduct(req, res, next) {
  try {
    const product = await getProductBySlug(req.params.slug)
    sendSuccess(res, {
      message: 'Product retrieved successfully.',
      data: { product },
    })
  } catch (error) {
    next(error)
  }
}