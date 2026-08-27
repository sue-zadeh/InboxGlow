import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../app.js'
import { createAdminToken, verifyAdminToken } from '../auth/token.js'

describe('admin authentication', () => {
  it('creates a valid token that expires', () => {
    const now = 1_000_000
    const token = createAdminToken(now)
    expect(verifyAdminToken(token, now + 1_000)).toBe(true)
    expect(verifyAdminToken(token, now + 9 * 60 * 60 * 1000)).toBe(false)
    expect(verifyAdminToken(`${token}changed`, now + 1_000)).toBe(false)
  })

  it('rejects an incorrect password', async () => {
    const response = await request(app).post('/api/auth/login').send({ password: 'incorrect-password' })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Incorrect password')
  })

  it('creates an HTTP-only session for the configured password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'change-me-before-production' })
    expect(response.status).toBe(200)
    expect(response.headers['set-cookie']?.[0]).toContain('HttpOnly')
  })
})
