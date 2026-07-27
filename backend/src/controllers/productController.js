
import { sendSuccess } from '../utils/response.js'
import { listProducts, getProductBySlug, getRelatedProducts } from '../services/productService.js'

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

// GET /api/products/:slug/related
export async function getRelated(req, res, next) {
  try {
    const products = await getRelatedProducts(req.params.slug)
    sendSuccess(res, {
      message: 'Related products retrieved successfully.',
      data: { products },
    })
  } catch (error) {
    next(error)
  }
}