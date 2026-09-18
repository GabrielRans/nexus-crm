import Fastify from 'fastify'
import cors from '@fastify/cors'

import { db } from './lib/db.js'
import { clientRoutes } from './routes/clients.js'

const app = Fastify({
  logger: true,
})

async function start() {
  try {
    await app.register(cors, {
      origin: 'http://localhost:5173',
      methods: [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
    })

    await app.register(clientRoutes)

    app.get('/', async () => {
      return {
        message: 'NexusCRM API',
      }
    })

    app.get('/health', async () => {
      return {
        status: 'ok',
        service: 'nexus-crm-api',
      }
    })

    const databaseTest = await db.query(
      'SELECT NOW() AS now',
    )

    console.log(
      'PostgreSQL conectado:',
      databaseTest.rows[0],
    )

    await app.listen({
      port: 3333,
      host: '127.0.0.1',
    })

    console.log(
      'API rodando em http://127.0.0.1:3333',
    )
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

app.addHook('onClose', async () => {
  await db.end()
})

start()