import type { FastifyInstance } from 'fastify'
import { db } from '../lib/db.js'

export async function dashboardRoutes( app: FastifyInstance) {
  app.get('/dashboard', async (_request, reply) => {
    try {
//metricsResult
      const metricsResult = await db.query(
        `
        SELECT
        COUNT(*)::int AS total_clients,

        COUNT(*) FILTER (
        WHERE created_at >= NOW() - INTERVAL '7 days'
        )::int AS recent_clients_count
        FROM clients
        `,
      )
// latestClientsResult
      const latestClientsResults = await db.query(
        `
       SELECT
          id,
          name,
          email,
          phone,
          created_at
        FROM clients
        ORDER BY created_at DESC
        LIMIT 5
        `,
      )
// metrics
      const metrics = metricsResult.rows[0]


      return reply.send({
        totalClients: metrics.total_clients,
        recentClientsCount:
          metrics.recent_clients_count,
        latestClients: latestClientsResults.rows,
      })
      } catch (error) {
        app.log.error(error)

        return reply.status(500).send({
          error: 'Erro interno ao carregar dashboard',
        })
      }
     })
}