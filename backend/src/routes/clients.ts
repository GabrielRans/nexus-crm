import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import {
  createClientSchema,
  updateClientSchema,
} from '../schemas/client.js'

import { db } from '../lib/db.js'

type ClientRow = {
  id: string
  name: string
  email: string
  phone: string
  created_at: Date
}

export async function clientRoutes(app: FastifyInstance) {
  app.get('/clients', async () => {
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

    return result.rows
  })

  app.get('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

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
      [id],
    )

    const client = result.rows[0]

    if (!client) {
      return reply.status(404).send({
        error: 'Cliente não encontrado',
      })
    }

    return client
  })

  app.post('/clients', async (request, reply) => {
    const validation = createClientSchema.safeParse(request.body)

    if (!validation.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const { name, email, phone } = validation.data

    const existingClient = await db.query(
      `
      SELECT id
      FROM clients
      WHERE LOWER(email) = LOWER($1)
      `,
      [email],
    )

    if (existingClient.rowCount && existingClient.rowCount > 0) {
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
  })

  app.put('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const validation = updateClientSchema.safeParse(request.body)

    if (!validation.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const currentClient = await db.query<ClientRow>(
      `
      SELECT *
      FROM clients
      WHERE id = $1
      `,
      [id],
    )

    if (currentClient.rowCount === 0) {
      return reply.status(404).send({
        error: 'Cliente não encontrado',
      })
    }

    const current = currentClient.rows[0]

    const name = validation.data.name ?? current.name
    const email = validation.data.email ?? current.email
    const phone = validation.data.phone ?? current.phone

    const emailConflict = await db.query(
      `
      SELECT id
      FROM clients
      WHERE LOWER(email) = LOWER($1)
        AND id <> $2
      `,
      [email, id],
    )

    if (emailConflict.rowCount && emailConflict.rowCount > 0) {
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

    return result.rows[0]
  })

  app.delete('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const result = await db.query(
      `
      DELETE FROM clients
      WHERE id = $1
      RETURNING id
      `,
      [id],
    )

    if (result.rowCount === 0) {
      return reply.status(404).send({
        error: 'Cliente não encontrado',
      })
    }

    return reply.status(204).send()
  })
}