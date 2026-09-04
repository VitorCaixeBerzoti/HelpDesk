import './App.css'
import RotaProtegida from './components/RotaProtegida.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import NovoChamado from './components/NovoChamado.jsx'
import Usuarios from './components/Usuarios.jsx'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        } 
        />
        <Route path='/chamados/novo'
        element={
          <RotaProtegida>
            <NovoChamado />
          </RotaProtegida>
        }
        ></Route>
        <Router path="/chamados/:id"
        element={
          <RotaProtegida>
            <DetalhesChamado />
          </RotaProtegida>
        }
        />
        <Route 
          path='/usuario'
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
