import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(40).optional().transform((value) => value || null),
  company: z.string().trim().max(100).optional().transform((value) => value || null),
  enquiryType: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(),
})

const router = Router()

router.post(
  '/',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false }),
  async (request, response, next) => {
    try {
      const result = contactSchema.safeParse(request.body)
      if (!result.success) {
        response.status(400).json({ error: 'Please check the form fields.', details: result.error.flatten().fieldErrors })
        return
      }

      const { website: _website, ...messageData } = result.data
      void _website
      const message = await prisma.contactMessage.create({ data: messageData })
      response.status(201).json({ id: message.id, message: 'Your message has been received.' })
    } catch (error) {
      next(error)
    }
  },
)

export default router
