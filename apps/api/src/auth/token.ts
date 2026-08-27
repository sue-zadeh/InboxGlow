import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from '../config.js'

const SESSION_LENGTH_MS = 8 * 60 * 60 * 1000

type SessionPayload = {
  role: 'admin'
  expiresAt: number
}

function sign(value: string) {
  return createHmac('sha256', config.ADMIN_TOKEN_SECRET).update(value).digest('base64url')
}

export function createAdminToken(now = Date.now()) {
  const payload: SessionPayload = { role: 'admin', expiresAt: now + SESSION_LENGTH_MS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifyAdminToken(token: string, now = Date.now()) {
  const [encoded, suppliedSignature] = token.split('.')
  if (!encoded || !suppliedSignature) return false

  const expectedSignature = sign(encoded)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload
    return payload.role === 'admin' && Number.isFinite(payload.expiresAt) && payload.expiresAt > now
  } catch {
    return false
  }
}

export function passwordMatches(suppliedPassword: string) {
  const supplied = createHmac('sha256', 'inboxglow-password').update(suppliedPassword).digest()
  const expected = createHmac('sha256', 'inboxglow-password').update(config.ADMIN_PASSWORD).digest()
  return timingSafeEqual(supplied, expected)
}
