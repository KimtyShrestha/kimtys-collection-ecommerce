import bcrypt from 'bcrypt'
import { query } from '../config/db.js'
import { ApiError } from '../utils/response.js'

const SALT_ROUNDS = 10

export async function updateProfile(userId, { fullName, phone }) {
  const result = await query(
    `UPDATE users
     SET full_name = $1, phone = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, full_name, email, phone, role`,
    [fullName, phone || null, userId]
  )
  const user = result.rows[0]
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const result = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  )
  const matches = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
  if (!matches) {
    throw new ApiError(401, 'Your current password is incorrect.')
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId]
  )
}