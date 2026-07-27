import { Router } from 'express'
import { placeOrder, getOrder } from '../controllers/orderController.js'
import { createOrderRules } from '../validators/orderValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All order routes require login.
router.use(requireAuth)

// POST /api/orders
router.post('/', createOrderRules, validate, placeOrder)

// GET /api/orders/:orderNumber
router.get('/:orderNumber', getOrder)

export default router