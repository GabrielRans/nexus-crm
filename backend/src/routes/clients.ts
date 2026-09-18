import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import { db } from '../lib/db.js'

import {
  clientIdSchema,
  createClientSchema,
  updateClientSchema,
} from '../schemas/client.js'

type ClientRow = {
  id: string
  name: string
  email: string
  phone: string
  created_at: Date
}

export async function clientRoutes(app: FastifyInstance) {
  // LISTAR TODOS
  app.get('/clients', async (_request, reply) => {
    try {
      const result = await db.query<ClientRow>(
        `
        SELECT
          id,
          name,
          email,
          phone,
          created_at
        FROM clients
        ORDER BY created_at DESC
        `,
      )

      return reply.send(result.rows)
    } catch (error) {
      app.log.error(error)

      return reply.status(500).send({
        error: 'Erro interno ao buscar clientes',
      })
    }
  })

  // BUSCAR POR ID
  app.get('/clients/:id', async (request, reply) => {
    const params = request.params as { id: string }

    const idValidation = clientIdSchema.safeParse(params.id)

    if (!idValidation.success) {
      return reply.status(400).send({
        error: 'ID de cliente inválido',
      })
    }

    try {
      const result = await db.query<ClientRow>(
        `
        SELECT
          id,
          name,
          email,
          phone,
          created_at
        FROM clients
        WHERE id = $1
        `,
        [idValidation.data],
      )

      const client = result.rows[0]

      if (!client) {
        return reply.status(404).send({
          error: 'Cliente não encontrado',
        })
      }

      return reply.send(client)
    } catch (error) {
      app.log.error(error)

      return reply.status(500).send({
        error: 'Erro interno ao buscar cliente',
      })
    }
  })

  // CRIAR CLIENTE
  app.post('/clients', async (request, reply) => {
    const validation = createClientSchema.safeParse(request.body)

    if (!validation.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const name = validation.data.name
    const email = validation.data.email.toLowerCase()
    const phone = validation.data.phone

    try {
      const existingClient = await db.query(
        `
        SELECT id
        FROM clients
        WHERE LOWER(email) = LOWER($1)
        `,
        [email],
      )

      if ((existingClient.rowCount ?? 0) > 0) {
        return reply.status(409).send({
          error: 'Já existe um cliente com este e-mail',
        })
      }

      const id = randomUUID()

      const result = await db.query<ClientRow>(
        `
        INSERT INTO clients (
          id,
          name,
          email,
          phone
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          name,
          email,
          phone,
          created_at
        `,
        [id, name, email, phone],
      )

      return reply.status(201).send(result.rows[0])
    } catch (error) {
      const databaseError = error as {
        code?: string
      }

      if (databaseError.code === '23505') {
        return reply.status(409).send({
          error: 'Já existe um cliente com este e-mail',
        })
      }

      app.log.error(error)

      return reply.status(500).send({
        error: 'Erro interno ao cadastrar cliente',
      })
    }
  })

  // ATUALIZAR CLIENTE
  app.put('/clients/:id', async (request, reply) => {
    const params = request.params as { id: string }

    const idValidation = clientIdSchema.safeParse(params.id)

    if (!idValidation.success) {
      return reply.status(400).send({
        error: 'ID de cliente inválido',
      })
    }

    const validation = updateClientSchema.safeParse(request.body)

    if (!validation.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const id = idValidation.data

    try {
      const currentResult = await db.query<ClientRow>(
        `
        SELECT
          id,
          name,
          email,
          phone,
          created_at
        FROM clients
        WHERE id = $1
        `,
        [id],
      )

      const currentClient = currentResult.rows[0]

      if (!currentClient) {
        return reply.status(404).send({
          error: 'Cliente não encontrado',
        })
      }

      const name =
        validation.data.name ?? currentClient.name

      const email =
        validation.data.email?.toLowerCase() ??
        currentClient.email

      const phone =
        validation.data.phone ?? currentClient.phone

      const emailConflict = await db.query(
        `
        SELECT id
        FROM clients
        WHERE LOWER(email) = LOWER($1)
          AND id <> $2
        `,
        [email, id],
      )

      if ((emailConflict.rowCount ?? 0) > 0) {
        return reply.status(409).send({
          error: 'Já existe outro cliente com este e-mail',
        })
      }

      const result = await db.query<ClientRow>(
        `
        UPDATE clients
        SET
          name = $1,
          email = $2,
          phone = $3
        WHERE id = $4
        RETURNING
          id,
          name,
          email,
          phone,
          created_at
        `,
        [name, email, phone, id],
      )

      return reply.send(result.rows[0])
    } catch (error) {
      app.log.error(error)

      return reply.status(500).send({
        error: 'Erro interno ao atualizar cliente',
      })
    }
  })

  // EXCLUIR CLIENTE
  app.delete('/clients/:id', async (request, reply) => {
    const params = request.params as { id: string }

    const idValidation = clientIdSchema.safeParse(params.id)

    if (!idValidation.success) {
      return reply.status(400).send({
        error: 'ID de cliente inválido',
      })
    }

    try {
      const result = await db.query(
        `
        DELETE FROM clients
        WHERE id = $1
        RETURNING id
        `,
        [idValidation.data],
      )

      if (result.rowCount === 0) {
        return reply.status(404).send({
          error: 'Cliente não encontrado',
        })
      }

      return reply.status(204).send()
    } catch (error) {
      app.log.error(error)

      return reply.status(500).send({
        error: 'Erro interno ao excluir cliente',
      })
    }
  })
}