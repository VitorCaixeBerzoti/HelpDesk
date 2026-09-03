import './App.css'
import RotaProtegida from './components/RotaProtegida.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import NovoChamado from './components/NovoChamado.jsx'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
