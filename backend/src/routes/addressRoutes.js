import { Router } from 'express'
import {
  getAddresses,
  postAddress,
  putAddress,
  removeAddress,
} from '../controllers/addressController.js'
import { addressRules } from '../validators/userValidators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', getAddresses)
router.post('/', addressRules, validate, postAddress)
router.put('/:id', addressRules, validate, putAddress)
router.delete('/:id', removeAddress)

export default router