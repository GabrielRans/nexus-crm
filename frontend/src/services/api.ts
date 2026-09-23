const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://127.0.0.1:3333'

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

export type DashboardData = {
  totalClients: number
  recentClientsCount: number
  latestClients: Client[]
}

export type UpdateClientData = {
  name?: string
  email?: string
  phone?: string
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const data = await response.json()

    return (
      data.error ??
      data.message ??
      `Erro HTTP ${response.status}`
    )
  } catch {
    return `Erro HTTP ${response.status}`
  }
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetch(
    `${API_URL}/dashboard`,
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    )
  }

  return response.json()
}

export async function getClients(): Promise<Client[]> {
  const response = await fetch(
    `${API_URL}/clients`,
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    )
  }

  return response.json()
}

export async function createClient(
  data: CreateClientData,
): Promise<Client> {
  const response = await fetch(
    `${API_URL}/clients`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    )
  }

  return response.json()
}

export async function updateClient(
  id: string,
  data: UpdateClientData,
): Promise<Client> {
  const response = await fetch(
    `${API_URL}/clients/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    )
  }

  return response.json()
}

export async function deleteClient(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/clients/${id}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    )
  }
}