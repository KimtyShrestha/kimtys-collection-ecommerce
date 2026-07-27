import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

const SALT_ROUNDS = 10

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  })
}

// Shape returned to the client — NEVER includes password_hash.
function publicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
}

export async function registerUser({ fullName, email, password, phone }) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rowCount > 0) {
    throw new ApiError(409, 'An account with this email already exists.')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, phone, role`,
    [fullName, email, passwordHash, phone || null]
  )

  const user = result.rows[0]
  return { user: publicUser(user), token: signToken(user) }
}

export async function loginUser({ email, password }) {
  const result = await query(
    `SELECT id, full_name, email, phone, role, is_active, password_hash
     FROM users WHERE email = $1`,
    [email]
  )
  const user = result.rows[0]

  // Same message for wrong email and wrong password:
  // never reveal which one failed.
  const invalid = new ApiError(401, 'Invalid email or password.')

  if (!user || !user.is_active) throw invalid

  const matches = await bcrypt.compare(password, user.password_hash)
  if (!matches) throw invalid

  return { user: publicUser(user), token: signToken(user) }
}

// --- Simulated password reset (academic demonstration) ---
// Real deployments email the token; here it is returned directly
// and labelled as simulated in the UI.

export async function createResetToken(email) {
  const result = await query(
    'SELECT id FROM users WHERE email = $1 AND is_active = TRUE',
    [email]
  )
  // Always behave identically whether or not the email exists.
  if (result.rowCount === 0) return null

  const token = jwt.sign(
    { id: result.rows[0].id, purpose: 'reset' },
    env.jwt.secret,
    { expiresIn: '15m' }
  )
  return token
}

export async function resetPassword(token, newPassword) {
  let payload
  try {
    payload = jwt.verify(token, env.jwt.secret)
  } catch {
    throw new ApiError(400, 'This reset link is invalid or has expired.')
  }
  if (payload.purpose !== 'reset') {
    throw new ApiError(400, 'This reset link is invalid or has expired.')
  }
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [passwordHash, payload.id]
  )
}