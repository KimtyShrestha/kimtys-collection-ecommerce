import { listCategories } from '../services/categoryService.js'
import { sendSuccess } from '../utils/response.js'

// GET /api/categories
export async function getCategories(req, res, next) {
  try {
    const categories = await listCategories()
    sendSuccess(res, {
      message: 'Categories retrieved successfully.',
      data: { categories },
    })
  } catch (error) {
    next(error)
  }
}