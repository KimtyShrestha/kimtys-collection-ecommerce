import { registerUser, loginUser } from '../services/authService.js'
import { sendSuccess } from '../utils/response.js'

export async function register(req, res, next) {
  try {
    const data = await registerUser(req.body)
    sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully.',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const data = await loginUser(req.body)
    sendSuccess(res, { message: 'Logged in successfully.', data })
  } catch (error) {
    next(error)
  }
}

// requireAuth has already attached req.user.
export function me(req, res) {
  sendSuccess(res, {
    message: 'Current user retrieved.',
    data: {
      user: {
        id: req.user.id,
        fullName: req.user.full_name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    },
  })
}