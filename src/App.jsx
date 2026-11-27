import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import NovoChamado from './components/NovoChamado.jsx'
import DetalhesChamado from './components/DetalhesChamado.jsx'
import Usuarios from './components/Usuarios.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'

import AlternarTema from './components/AlternarTema.jsx'

function Layout({ children }) {
  const { pathname } = useLocation()
  return (
    <div
      className={
        pathname === '/dashboard' ? 'app-pagina app-quadro' : 'app-pagina'
      }
    >
      <AlternarTema />
      {children}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

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
      </Layout>
    </BrowserRouter>
  )
}

export default App
