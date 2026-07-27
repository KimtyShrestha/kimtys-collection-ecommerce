import { query, getClient } from '../config/db.js'
import { ApiError } from '../utils/response.js'

function mapAddress(row) {
  return {
    id: row.id,
    label: row.label,
    recipientName: row.recipient_name,
    phone: row.phone,
    city: row.city,
    area: row.area,
    street: row.street,
    landmark: row.landmark,
    isDefault: row.is_default,
  }
}

export async function listAddresses(userId) {
  const result = await query(
    `SELECT * FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, created_at DESC`,
    [userId]
  )
  return result.rows.map(mapAddress)
}

// Setting an address as default must clear the previous default —
// done in a transaction so there is never zero-or-two defaults mid-way.
async function withDefaultHandling(userId, isDefault, work) {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    if (isDefault) {
      await client.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
        [userId]
      )
    }
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function createAddress(userId, data) {
  // First address automatically becomes the default.
  const countResult = await query(
    'SELECT COUNT(*) AS count FROM addresses WHERE user_id = $1',
    [userId]
  )
  const isFirst = Number(countResult.rows[0].count) === 0
  const isDefault = isFirst || !!data.isDefault

  return withDefaultHandling(userId, isDefault, async (client) => {
    const result = await client.query(
      `INSERT INTO addresses
        (user_id, label, recipient_name, phone, city, area, street, landmark, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        userId, data.label, data.recipientName, data.phone,
        data.city, data.area, data.street || null, data.landmark || null,
        isDefault,
      ]
    )
    return mapAddress(result.rows[0])
  })
}

export async function updateAddress(userId, addressId, data) {
  const owned = await query(
    'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
    [addressId, userId]
  )
  if (owned.rowCount === 0) {
    throw new ApiError(404, 'Address not found.')
  }

  return withDefaultHandling(userId, !!data.isDefault, async (client) => {
    const result = await client.query(
      `UPDATE addresses
       SET label = $1, recipient_name = $2, phone = $3, city = $4,
           area = $5, street = $6, landmark = $7,
           is_default = CASE WHEN $8 THEN TRUE ELSE is_default END,
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        data.label, data.recipientName, data.phone, data.city,
        data.area, data.street || null, data.landmark || null,
        !!data.isDefault, addressId,
      ]
    )
    return mapAddress(result.rows[0])
  })
}

export async function deleteAddress(userId, addressId) {
  const result = await query(
    'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING is_default',
    [addressId, userId]
  )
  if (result.rowCount === 0) {
    throw new ApiError(404, 'Address not found.')
  }
  // If the default was deleted, promote the newest remaining address.
  if (result.rows[0].is_default) {
    await query(
      `UPDATE addresses SET is_default = TRUE
       WHERE id = (SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1)`,
      [userId]
    )
  }
}