import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import NovoChamado from './components/NovoChamado.jsx'
import DetalhesChamado from './components/DetalhesChamado.jsx'
import Usuarios from './components/Usuarios.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

        <Route
          path="/chamados/novo"
          element={
            <RotaProtegida>
              <NovoChamado />
            </RotaProtegida>
          }
        />

        <Route
          path="/chamados/:id"
          element={
            <RotaProtegida>
              <DetalhesChamado />
            </RotaProtegida>
          }
        />

        <Route
          path="/usuarios"
          element={
            <RotaProtegida>
              <Usuarios />
            </RotaProtegida>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App