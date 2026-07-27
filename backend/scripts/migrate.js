// Minimal migration/seed runner.
// Usage:
//   npm run migrate                        -> runs all files in database/migrations (in name order)
//   npm run seed                           -> runs all files in database/seeds (in name order)
//   npm run migrate:rollback               -> runs migrations/rollback/001_drop_all.sql
// Applied migration files are recorded in schema_migrations and skipped on re-run.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import env from '../src/config/env.js'

const { Client } = pg

const MODE = process.argv[2] || 'migrate'

const DIRS = {
  migrate: path.resolve('../database/migrations'),
  seed: path.resolve('../database/seeds'),
  rollback: path.resolve('../database/migrations/rollback'),
}

async function main() {
  const dir = DIRS[MODE]
  if (!dir) {
    console.error(`Unknown mode "${MODE}". Use: migrate | seed | rollback`)
    process.exit(1)
  }

  const client = new Client(env.db)
  await client.connect()

  try {
    // Tracking table (used for migrations only).
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const files = (await readdir(dir))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      console.log(`No .sql files found in ${dir}`)
      return
    }

    for (const file of files) {
      if (MODE === 'migrate') {
        const done = await client.query(
          'SELECT 1 FROM schema_migrations WHERE filename = $1',
          [file]
        )
        if (done.rowCount > 0) {
          console.log(`skip   ${file} (already applied)`)
          continue
        }
      }

      const sql = await readFile(path.join(dir, file), 'utf8')
      console.log(`run    ${file} ...`)
      await client.query(sql)

      if (MODE === 'migrate') {
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file]
        )
      }

      if (MODE === 'rollback') {
        await client.query('DELETE FROM schema_migrations')
        console.log('       migration history cleared')
      }

      console.log(`done   ${file}`)
    }

    console.log(`\n${MODE} completed successfully.`)
  } catch (error) {
    console.error(`\n${MODE} FAILED:`, error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()