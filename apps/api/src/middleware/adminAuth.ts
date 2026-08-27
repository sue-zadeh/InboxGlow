import type { NextFunction, Request, Response } from 'express'
import { verifyAdminToken } from '../auth/token.js'

export const SESSION_COOKIE = 'inboxglow_session'

function readCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return ''
  const item = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim().split('='))
    .find(([cookieName]) => cookieName === name)
  return item?.slice(1).join('=') ?? ''
}

export function adminAuth(request: Request, response: Response, next: NextFunction) {
  const token = readCookie(request.header('cookie'), SESSION_COOKIE)
  if (!verifyAdminToken(token)) {
    response.status(401).json({ error: 'Authentication required' })
    return
  }

  next()
}
