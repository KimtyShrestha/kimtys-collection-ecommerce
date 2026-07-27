// Creates (or resets) the demonstration admin account.
// Usage: npm run seed:admin
// Credentials are printed once here and documented in the README —
// they are never hard-coded anywhere in frontend source.

import bcrypt from 'bcrypt'
import pg from 'pg'
import env from '../src/config/env.js'

const { Client } = pg

const ADMIN = {
  fullName: 'Kimty Administrator',
  email: 'admin@kimtyscollection.com',
  password: 'AdminDemo#2026',
}

async function main() {
  const client = new Client(env.db)
  await client.connect()

  try {
    const passwordHash = await bcrypt.hash(ADMIN.password, 10)

    await client.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', is_active = TRUE`,
      [ADMIN.fullName, ADMIN.email, passwordHash]
    )

    console.log('Demo admin ready:')
    console.log(`  Email:    ${ADMIN.email}`)
    console.log(`  Password: ${ADMIN.password}`)
  } catch (error) {
    console.error('Admin seed FAILED:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()