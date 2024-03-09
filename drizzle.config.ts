import type { Config } from 'drizzle-kit'

import { env } from './src/env'

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  verbose: true,
  dbCredentials: {
    database: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    host: env.DATABASE_HOST,
    password: env.DATABASE_PASSWORD,
    port: env.DATABASE_PORT,
  },
} satisfies Config
