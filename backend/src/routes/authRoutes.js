import { Router } from 'express'
import { register, login, me } from '../controllers/authController.js'
import { registerRules, loginRules } from '../validators/authValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register — public
router.post('/register', registerRules, validate, register)

// POST /api/auth/login — public
router.post('/login', loginRules, validate, login)

// GET /api/auth/me — requires a valid token
router.get('/me', requireAuth, me)

export default router