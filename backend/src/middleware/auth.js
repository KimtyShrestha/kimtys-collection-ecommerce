import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { ApiError } from '../utils/response.js'
import { query } from '../config/db.js'

// Verifies "Authorization: Bearer <token>" and attaches req.user.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      throw new ApiError(401, 'Please log in to continue.')
    }

    let payload
    try {
      payload = jwt.verify(token, env.jwt.secret)
    } catch {
      throw new ApiError(401, 'Your session has expired. Please log in again.')
    }

    // Confirm the account still exists and is active.
    const result = await query(
      'SELECT id, full_name, email, phone, role, is_active FROM users WHERE id = $1',
      [payload.id]
    )
    const user = result.rows[0]

    if (!user || !user.is_active) {
      throw new ApiError(401, 'This account is no longer active.')
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

// Use AFTER requireAuth on admin-only routes.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'You do not have permission to access this.'))
  }
  next()
}

// Attaches req.user when a valid token is present, but never blocks.
// Used on public routes whose response is richer for logged-in users.
export async function attachUserIfPresent(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()

    let payload
    try {
      payload = jwt.verify(token, env.jwt.secret)
    } catch {
      return next() // invalid token = treat as guest
    }

    const result = await query(
      'SELECT id, full_name, email, phone, role, is_active FROM users WHERE id = $1',
      [payload.id]
    )
    const user = result.rows[0]
    if (user && user.is_active) req.user = user
    next()
  } catch (error) {
    next(error)
  }
}