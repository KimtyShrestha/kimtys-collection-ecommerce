import { Router } from 'express'
import { getProducts, getProduct, getRelated } from '../controllers/productController.js'
import { getProductReviews } from '../controllers/reviewController.js'
import { attachUserIfPresent } from '../middleware/auth.js'

const router = Router()

// GET /api/products — public catalogue
router.get('/', getProducts)

// Sub-routes must precede /:slug.
router.get('/:slug/related', getRelated)
router.get('/:slug/reviews', attachUserIfPresent, getProductReviews)

// GET /api/products/:slug — public detail
router.get('/:slug', getProduct)

export default router