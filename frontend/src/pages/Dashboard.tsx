import {
  useEffect,
  useState,
} from 'react'

import {
  getDashboard,
  type DashboardData,
} from '../services/api'

function Dashboard() {
  // 1. ESTADOS
  const [DashboardData, setDashboardData] =
  useState<DashboardData | null>(null)

  const [loading, setLoading] =
  useState(true)

  const [error, setError] =
  useState('')

// 2. USEEFFECT - BUSCA OS DADOS DA API
   useEffect(() => {
    let cancelled = false

    getDashboard()
      .then((data) => {
        if (!cancelled) {
          setDashboardData(data)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (error instanceof Error) {
            setError(error.message)
          } else {
            setError(
              'Não foi possível carregar o dashboard.',
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

// 3. MÉTRICAS CALCULADAS
   const totalClients =
    DashboardData?.totalClients ?? 0

   const recentClientsCount =
    DashboardData?.recentClientsCount ?? 0

   const latestClients =
    DashboardData?.latestClients ?? []

  // 4. INTERFACE
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">
            NexusCRM
          </span>

          <h1>Dashboard</h1>

          <p>
            Visão geral dos dados do seu CRM.
          </p>
        </div> 
      </header>

      {error && (
        <p className="message error">
          {error}
        </p>
      )}

      <section className="dashboard-metrics">
        <article className="dashboard-metric">
          <span>
            Total de clientes
          </span>

          <strong>
            {loading ? '...' : totalClients}
          </strong>

          <small>
            Clientes cadastrados no sistema
          </small>
        </article>

        <article className="dashboard-metric">
          <span>
            Novos clientes
          </span>

          <strong>
            {loading? '...'
            : recentClientsCount}
          </strong>

          <small>
            Últimos 7 dias
          </small>
        </article>
      </section>

      <section className="recent-section">
        <div className="recent-header">
          <div>
            <span>Atividade recente</span>

            <h2>
              Clientes recentes
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">
            Carregando...
          </p>
        ) : latestClients.length === 0 ? (
          <p className="empty-state">
            Nenhum cliente cadastrado nos últimos 7 dias.
          </p>
        ) : (
          <div className="recent-list">
            {latestClients.map((client) => (
              <article
              className="recent-client"
              key={client.id}
              >
                <div className="client-avatar">
                  {client.name.charAt(0)
                  .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {client.name}
                  </strong>

                  <span>
                    {client.email}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard