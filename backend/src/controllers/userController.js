import { updateProfile, changePassword } from '../services/userService.js'
import { sendSuccess } from '../utils/response.js'

// PUT /api/users/profile
export async function putProfile(req, res, next) {
  try {
    const user = await updateProfile(req.user.id, req.body)
    sendSuccess(res, { message: 'Profile updated successfully.', data: { user } })
  } catch (error) {
    next(error)
  }
}

// PUT /api/users/password
export async function putPassword(req, res, next) {
  try {
    await changePassword(req.user.id, req.body)
    sendSuccess(res, { message: 'Password changed successfully.' })
  } catch (error) {
    next(error)
  }
}