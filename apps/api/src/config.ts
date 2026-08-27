import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  ADMIN_PASSWORD: z.string().min(12).default('change-me-before-production'),
  ADMIN_TOKEN_SECRET: z.string().min(32).default('development-token-secret-change-me-now'),
  COOKIE_CROSS_SITE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
})

export const config = schema.parse(process.env)
