import { Router } from 'express'
import { putProfile, putPassword } from '../controllers/userController.js'
import { updateProfileRules, changePasswordRules } from '../validators/userValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// PUT /api/users/profile
router.put('/profile', updateProfileRules, validate, putProfile)

// PUT /api/users/password
router.put('/password', changePasswordRules, validate, putPassword)

export default router