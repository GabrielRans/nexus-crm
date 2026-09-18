import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
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

  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

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
        const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()
        
      const filteredClients = clients.filter((client) => {
        const searchableText = `
        ${client.name}
        ${client.email}
        ${client.phone}
        `.toLowerCase()

        return searchableText.includes(normalizedSearch)
      })

  function resetForm() {
    setName('')
    setEmail('')
    setPhone('')
    setEditingId(null)
  }

  function handleEdit(client: Client) {
    setError('')
    setSuccess('')

    setEditingId(client.id)

    setName(client.name)
    setEmail(client.email)
    setPhone(client.phone)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleCancelEdit() {
    resetForm()

    setError('')
    setSuccess('')
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSubmitting(true)

    const clientData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    }

    try {
      if (editingId) {
        const updatedClient = await updateClient(
          editingId,
          clientData,
        )

        setClients((currentClients) =>
          currentClients.map((client) =>
            client.id === editingId
              ? updatedClient
              : client,
          ),
        )

        setSuccess(
          'Cliente atualizado com sucesso.',
        )

        resetForm()
      } else {
        const newClient = await createClient(
          clientData,
        )

        setClients((currentClients) => [
          newClient,
          ...currentClients,
        ])

        setSuccess(
          'Cliente cadastrado com sucesso.',
        )

        resetForm()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          editingId
            ? 'Não foi possível atualizar o cliente.'
            : 'Não foi possível cadastrar o cliente.',
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

      if (editingId === client.id) {
        resetForm()
      }

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
          <div className="form-title">
            <div>
              <span>
                {editingId
                  ? 'Modo de edição'
                  : 'Cadastro'}
              </span>

              <h2>
                {editingId
                  ? 'Editar cliente'
                  : 'Novo cliente'}
              </h2>
            </div>

            {editingId && (
              <span className="editing-badge">
                Editando
              </span>
            )}
          </div>

          <label>
            Nome

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Nome do cliente"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            E-mail

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="cliente@email.com"
              maxLength={150}
              required
            />
          </label>

          <label>
            Telefone

            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="(62) 99999-9999"
              minLength={8}
              maxLength={20}
              required
            />
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? editingId
                ? 'Salvando...'
                : 'Cadastrando...'
              : editingId
                ? 'Salvar alterações'
                : 'Cadastrar cliente'}
          </button>

          {editingId && (
            <button
              className="cancel-button"
              type="button"
              onClick={handleCancelEdit}
              disabled={submitting}
            >
              Cancelar edição
            </button>
          )}

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
              <div className="search-box">
                <input
                type="search"
                placeholder="buscar por nome, e-mail ou telefone..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
              }
              />
               </div>
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
          ) : filteredClients.length === 0 ? (
            <p className="empty-state">
              Nenhum cliente encontrado.
            </p> 
            ) : (
            <div className="clients-list">
              {filteredClients.map((client) => (
                <article
                  className={
                    editingId === client.id
                      ? 'client-item editing'
                      : 'client-item'
                  }
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

                  <div className="client-actions">
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() =>
                        handleEdit(client)
                      }
                    >
                      Editar
                    </button>

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
                  </div>
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