import {
  listWishlist,
  addToWishlist,
  removeFromWishlist,
  wishlistProductIds,
} from '../services/wishlistService.js'
import { sendSuccess } from '../utils/response.js'
import { ApiError } from '../utils/response.js'

export async function getWishlist(req, res, next) {
  try {
    const products = await listWishlist(req.user.id)
    sendSuccess(res, { message: 'Wishlist retrieved successfully.', data: { products } })
  } catch (error) {
    next(error)
  }
}

export async function getWishlistIds(req, res, next) {
  try {
    const productIds = await wishlistProductIds(req.user.id)
    sendSuccess(res, { message: 'Wishlist ids retrieved successfully.', data: { productIds } })
  } catch (error) {
    next(error)
  }
}

export async function postWishlistItem(req, res, next) {
  try {
    const productId = Number(req.body.productId)
    if (!Number.isInteger(productId) || productId < 1) {
      throw new ApiError(400, 'Invalid product.')
    }
    await addToWishlist(req.user.id, productId)
    sendSuccess(res, { statusCode: 201, message: 'Added to your wishlist.' })
  } catch (error) {
    next(error)
  }
}

export async function deleteWishlistItem(req, res, next) {
  try {
    await removeFromWishlist(req.user.id, Number(req.params.productId))
    sendSuccess(res, { message: 'Removed from your wishlist.' })
  } catch (error) {
    next(error)
  }
}