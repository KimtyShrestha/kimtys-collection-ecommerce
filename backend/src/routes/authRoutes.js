import { Router } from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  me,
  forgotPassword,
  postResetPassword,
} from '../controllers/authController.js'
import { registerRules, loginRules } from '../validators/authValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', registerRules, validate, register)
router.post('/login', loginRules, validate, login)
router.get('/me', requireAuth, me)

// Simulated reset flow (academic demonstration — token returned, not emailed).
router.post(
  '/forgot-password',
  [body('email').trim().isEmail().withMessage('Please enter a valid email address.')],
  validate,
  forgotPassword
)
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required.'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters.'),
  ],
  validate,
  postResetPassword
)

export default router