import { Router } from 'express'
import { getProducts, getProduct } from '../controllers/productController.js'

const router = Router()

// GET /api/products — public, supports ?featured/newArrival/popular/sale/limit
router.get('/', getProducts)

// GET /api/products/:slug — public
router.get('/:slug', getProduct)

export default router