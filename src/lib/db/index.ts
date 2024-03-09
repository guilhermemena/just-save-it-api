import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

import { env } from '@/env'
import * as schema from './schema'

const queryClient = postgres({
  host: env.DATABASE_HOST,
  db: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  pass: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
})

const db = drizzle(queryClient, { schema })

export default db
