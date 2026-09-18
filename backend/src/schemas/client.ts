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
    .max(150, 'E-mail muito longo'),

  phone: z
    .string()
    .trim()
    .min(8, 'Telefone inválido')
    .max(20, 'Telefone muito longo'),
})

export const updateClientSchema = createClientSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'Informe pelo menos um campo para atualizar',
    },
  )

export const clientIdSchema = z.string().uuid('ID de cliente inválido')

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>