import { Router } from 'express'
import { postReview, putReview, removeReview } from '../controllers/reviewController.js'
import { createReviewRules, reviewRules } from '../validators/reviewValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.post('/', createReviewRules, validate, postReview)
router.put('/:id', reviewRules, validate, putReview)
router.delete('/:id', removeReview)

export default router