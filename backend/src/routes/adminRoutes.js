import { Router } from 'express'
import { getDashboard } from '../controllers/adminController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Every admin route requires a valid token AND the admin role.
router.use(requireAuth, requireAdmin)

router.get('/dashboard', getDashboard)

export default router