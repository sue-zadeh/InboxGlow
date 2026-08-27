import { app } from './app.js'
import { config } from './config.js'
import { prisma } from './lib/prisma.js'

const server = app.listen(config.PORT, () => {
  console.log(`InboxGlow API listening on http://localhost:${config.PORT}`)
})

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
