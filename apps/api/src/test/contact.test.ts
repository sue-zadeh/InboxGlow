import { describe, expect, it } from 'vitest'
import { contactSchema } from '../routes/contact.js'

describe('contactSchema', () => {
  it('accepts a valid enquiry', () => {
    const result = contactSchema.safeParse({
      name: 'Sue Zadeh',
      email: 'SUE@example.com',
      enquiryType: 'New project',
      message: 'I would like to discuss a new website.',
      website: '',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('sue@example.com')
  })

  it('rejects invalid email and short messages', () => {
    const result = contactSchema.safeParse({ name: 'S', email: 'invalid', enquiryType: '', message: 'Short' })
    expect(result.success).toBe(false)
  })

  it('rejects honeypot spam', () => {
    const result = contactSchema.safeParse({ name: 'Bot User', email: 'bot@example.com', enquiryType: 'Spam', message: 'This is automated spam.', website: 'https://spam.test' })
    expect(result.success).toBe(false)
  })
})
