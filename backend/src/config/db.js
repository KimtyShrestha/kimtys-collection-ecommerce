import pg from 'pg'
import env from './env.js'

const { Pool } = pg

// A pool manages multiple reusable connections. Every part of the
// application queries the database through this single pool.
const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
})

// Central query helper — ALWAYS use parameterised queries:
//   query('SELECT * FROM products WHERE id = $1', [id])
// Never build SQL strings from user input.
export function query(text, params) {
  return pool.query(text, params)
}

// Used for multi-statement transactions (e.g. placing an order).
export function getClient() {
  return pool.connect()
}

export default pool