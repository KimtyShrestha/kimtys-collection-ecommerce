import { registerUser, loginUser, createResetToken, resetPassword } from '../services/authService.js'
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

// POST /api/auth/forgot-password — simulated (token returned, not emailed)
export async function forgotPassword(req, res, next) {
  try {
    const token = await createResetToken(req.body.email)
    sendSuccess(res, {
      message: 'If an account exists for this email, a reset link has been generated.',
      data: token ? { resetToken: token, simulated: true } : { simulated: true },
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/reset-password
export async function postResetPassword(req, res, next) {
  try {
    await resetPassword(req.body.token, req.body.newPassword)
    sendSuccess(res, { message: 'Password reset successfully. You can now log in.' })
  } catch (error) {
    next(error)
  }
}