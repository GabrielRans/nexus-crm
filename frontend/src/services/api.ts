const API_URL = 'http://127.0.0.1:3333'

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

export type CreateClientData = {
  name: string
  email: string
  phone: string
}

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients`)

  if (!response.ok) {
    throw new Error('Erro ao buscar clientes')
  }

  return response.json()
}

export async function createClient(
  data: CreateClientData,
): Promise<Client> {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error.error ?? 'Erro ao criar cliente')
  }

  return response.json()
}