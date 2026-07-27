import { Router } from 'express'
import {
  getWishlist,
  getWishlistIds,
  postWishlistItem,
  deleteWishlistItem,
} from '../controllers/wishlistController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', getWishlist)
router.get('/ids', getWishlistIds)
router.post('/', postWishlistItem)
router.delete('/:productId', deleteWishlistItem)

export default router