import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [chamados, setChamados] = useState([])

  useEffect(() => {
    async function buscarChamados() {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:3000/chamados', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setChamados([])
        return
      }

      setChamados(data.chamados || [])
    }

    buscarChamados()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo ao HelpDesk</p>
        </div>

        <div>
          <button onClick={() => navigate('/chamados/novo')}>
            Novo chamado
          </button>

          <button onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      <h2>Chamados</h2>

      {chamados.length === 0 && (
        <p>Nenhum chamado encontrado.</p>
      )}

      {chamados.map((chamado) => {
        return (
          <div
            className="chamado-card"
            key={chamado.id}
            onClick={() => navigate(`/chamados/${chamado.id}`)}
          >
            <h3>{chamado.titulo}</h3>

            <p>{chamado.descricao}</p>

            <p>
              Tipo: {chamado.tipoAjuda}
            </p>

            <p>
              Status: {chamado.status}
            </p>

            <p>
              Criado em: {new Date(chamado.dataDeCriacao).toLocaleString('pt-BR')}
            </p>
          </div>
        )
      })}

    </div>
  )
}

export default Dashboard