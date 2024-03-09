import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { env } from '@/env'

const migrationClient = postgres({
  host: env.DATABASE_HOST,
  db: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  pass: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
  max: 1,
})

const client = drizzle(migrationClient, { logger: true })

await (async () => {
  try {
    console.log('migration started...')
    await migrate(client, { migrationsFolder: 'drizzle' })
    console.log('migration finished...')
    process.exit(0)
  } catch (error) {
    console.log('migration failed...', error)
    process.exit(0)
  }
})()
