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