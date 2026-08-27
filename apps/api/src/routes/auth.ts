import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { createAdminToken, passwordMatches } from '../auth/token.js'
import { config } from '../config.js'
import { adminAuth, SESSION_COOKIE } from '../middleware/adminAuth.js'

const router = Router()
const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production' || config.COOKIE_CROSS_SITE,
  sameSite: config.COOKIE_CROSS_SITE ? 'none' as const : 'lax' as const,
  maxAge: 8 * 60 * 60 * 1000,
  path: '/',
}

router.post(
  '/login',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false }),
  (request, response) => {
    const result = z.object({ password: z.string().min(1).max(200) }).safeParse(request.body)
    if (!result.success || !passwordMatches(result.data.password)) {
      response.status(401).json({ error: 'Incorrect password' })
      return
    }

    response.cookie(SESSION_COOKIE, createAdminToken(), cookieOptions)
    response.json({ authenticated: true })
  },
)

router.get('/session', adminAuth, (_request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.json({ authenticated: true })
})

router.post('/logout', (_request, response) => {
  response.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined })
  response.json({ authenticated: false })
})

export default router
