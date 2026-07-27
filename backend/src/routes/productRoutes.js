import { Router } from 'express'
import { getProducts, getProduct, getRelated } from '../controllers/productController.js'

const router = Router()

// GET /api/products — public catalogue (search/filter/sort/paginate)
router.get('/', getProducts)

// GET /api/products/:slug/related — public (must precede /:slug)
router.get('/:slug/related', getRelated)

// GET /api/products/:slug — public detail
router.get('/:slug', getProduct)

export default router