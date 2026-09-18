import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  createClient,
  deleteClient,
  getClients,
  type Client,
} from './services/api'

import './App.css'

function App() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getClients()
      .then((data) => {
        if (!cancelled) {
          setClients(data)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (error instanceof Error) {
            setError(error.message)
          } else {
            setError(
              'Não foi possível carregar os clientes.',
            )
          }
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(
      formData.get('name') ?? '',
    ).trim()

    const email = String(
      formData.get('email') ?? '',
    ).trim()

    const phone = String(
      formData.get('phone') ?? '',
    ).trim()

    try {
      const client = await createClient({
        name,
        email,
        phone,
      })

      setClients((currentClients) => [
        client,
        ...currentClients,
      ])

      form.reset()

      setSuccess(
        'Cliente cadastrado com sucesso.',
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Não foi possível cadastrar o cliente.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(
    client: Client,
  ) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${client.name}?`,
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')
    setDeletingId(client.id)

    try {
      await deleteClient(client.id)

      setClients((currentClients) =>
        currentClients.filter(
          (item) => item.id !== client.id,
        ),
      )

      setSuccess(
        'Cliente excluído com sucesso.',
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Não foi possível excluir o cliente.',
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">
            NexusCRM
          </span>

          <h1>Clientes</h1>

          <p>
            Cadastre e acompanhe os clientes
            da sua empresa.
          </p>
        </div>

        <div className="metric-card">
          <span>Total de clientes</span>

          <strong>
            {clients.length}
          </strong>
        </div>
      </section>

      <section className="content-grid">
        <form
          className="client-form"
          onSubmit={handleSubmit}
        >
          <h2>Novo cliente</h2>

          <label>
            Nome

            <input
              name="name"
              type="text"
              placeholder="Nome do cliente"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            E-mail

            <input
              name="email"
              type="email"
              placeholder="cliente@email.com"
              maxLength={150}
              required
            />
          </label>

          <label>
            Telefone

            <input
              name="phone"
              type="tel"
              placeholder="(62) 99999-9999"
              minLength={8}
              maxLength={20}
              required
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Cadastrando...'
              : 'Cadastrar cliente'}
          </button>

          {error && (
            <p className="message error">
              {error}
            </p>
          )}

          {success && (
            <p className="message success">
              {success}
            </p>
          )}
        </form>

        <section className="clients-card">
          <div className="clients-header">
            <div>
              <span>
                Base de clientes
              </span>

              <h2>
                Clientes cadastrados
              </h2>
            </div>

            <span className="counter">
              {clients.length}
            </span>
          </div>

          {loading ? (
            <p className="empty-state">
              Carregando clientes...
            </p>
          ) : clients.length === 0 ? (
            <p className="empty-state">
              Nenhum cliente cadastrado ainda.
            </p>
          ) : (
            <div className="clients-list">
              {clients.map((client) => (
                <article
                  className="client-item"
                  key={client.id}
                >
                  <div className="client-avatar">
                    {client.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="client-info">
                    <strong>
                      {client.name}
                    </strong>

                    <span>
                      {client.email}
                    </span>

                    <small>
                      {client.phone}
                    </small>
                  </div>

                  <button
                    className="delete-button"
                    type="button"
                    disabled={
                      deletingId === client.id
                    }
                    onClick={() =>
                      handleDelete(client)
                    }
                  >
                    {deletingId === client.id
                      ? 'Excluindo...'
                      : 'Excluir'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App