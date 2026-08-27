import { MessageStatus } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
router.use(adminAuth)
router.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store')
  next()
})

router.get('/messages', async (_request, response, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    response.json({ messages })
  } catch (error) {
    next(error)
  }
})

router.patch('/messages/:id', async (request, response, next) => {
  try {
    const result = z.object({ status: z.nativeEnum(MessageStatus) }).safeParse(request.body)
    if (!result.success) {
      response.status(400).json({ error: 'Invalid status' })
      return
    }
    const message = await prisma.contactMessage.update({ where: { id: request.params.id }, data: result.data })
    response.json({ message })
  } catch (error) {
    next(error)
  }
})

export default router
