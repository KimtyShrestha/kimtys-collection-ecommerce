import { getDashboardStats } from '../services/adminService.js'
import { sendSuccess } from '../utils/response.js'

// GET /api/admin/dashboard — admin only
export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats()
    sendSuccess(res, {
      message: 'Dashboard statistics retrieved successfully.',
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}