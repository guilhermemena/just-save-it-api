import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3030),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_NAME: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
