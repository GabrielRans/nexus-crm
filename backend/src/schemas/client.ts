import { z } from 'zod'

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),

  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .max(150),

  phone: z
    .string()
    .trim()
    .min(8, 'Telefone inválido')
    .max(20),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>