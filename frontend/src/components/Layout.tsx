import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <strong>NexusCRM</strong>
          <span>Gestão de clientes</span>
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              end
              className={({ isActive}) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Dashboard
            </NavLink>
            
            <NavLink
             to="/clients"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Clientes
            </NavLink>
          </nav>
        </div>
      </aside>
      <section className="app-content">
        <Outlet />
      </section>
    </div>
  )
}

export default Layout