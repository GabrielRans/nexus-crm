import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Dashboard  from './pages/Dashboard'
import Clients from './pages/Clients'


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route
      path="/"
      element={<Dashboard />}
      />

      <Route
      path="/Clients"
      element={<Clients />}
      />
    </Route>
    </Routes>
  )
}

export default App