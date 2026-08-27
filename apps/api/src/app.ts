import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from './config.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import adminRouter from './routes/admin.js'
import authRouter from './routes/auth.js'
import contactRouter from './routes/contact.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: config.WEB_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
}))
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/contact', contactRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use(notFound)
app.use(errorHandler)
