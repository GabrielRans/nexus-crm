import Fastify from 'fastify'
import cors from '@fastify/cors'
import { clientRoutes } from './routes/clients.js'
import { db } from './lib/db.js'

const app = Fastify({
  logger: true,
})

async function start() {
  await app.register(cors, {
    origin: 'http://localhost:5173',
  })

    await app.register(clientRoutes)

  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'nexus-crm-api',
    }
  })

  app.get('/', async () => {
    return {
      message: 'NexusCRM API',
    }
  })

  try {
    await app.listen({
      port: 3333,
      host: '127.0.0.1',
    })

    console.log('API rodando em http://127.0.0.1:3333')
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()