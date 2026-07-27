import { Router } from 'express'
import {
  getDashboard,
  getProducts, getProduct, postProduct, putProduct, removeProduct, removeProductImage,
  getCategories, postCategory, putCategory, removeCategory,
} from '../controllers/adminController.js'
import { productRules, categoryRules } from '../validators/adminValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { handleUpload } from '../middleware/upload.js'

const router = Router()

// Every admin route requires a valid token AND the admin role.
router.use(requireAuth, requireAdmin)

// Dashboard
router.get('/dashboard', getDashboard)

// Products (multipart: handleUpload must run before validation so
// text fields are parsed out of the form data first)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.post('/products', handleUpload, productRules, validate, postProduct)
router.put('/products/:id', handleUpload, productRules, validate, putProduct)
router.delete('/products/:id', removeProduct)
router.delete('/products/:id/images/:imageId', removeProductImage)

// Categories
router.get('/categories', getCategories)
router.post('/categories', categoryRules, validate, postCategory)
router.put('/categories/:id', categoryRules, validate, putCategory)
router.delete('/categories/:id', removeCategory)

export default router