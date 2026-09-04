import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [chamados, setChamados] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('TODOS')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [busca, setBusca] = useState('')
  const [usuario, setUsuario] = useState(null)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function buscarChamados() {
      try {
        setCarregando(true)
        setErro('')

        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:3000/chamados', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setErro(data.mensagem || 'Erro ao carregar chamados')
          setChamados([])
          return
        }

        setChamados(data.chamados || [])
      } catch (erro) {
        console.error(erro)
        setErro('Não foi possível carregar os chamados')
      } finally {
        setCarregando(false)
      }
    }

    async function buscarPerfil() {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:3000/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          setUsuario(data.usuario)
        }
      } catch (erro) {
        console.error(erro)
      }
    }

    buscarChamados()
    buscarPerfil()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const chamadosFiltrados = chamados.filter((chamado) => {
    const combinaStatus =
      filtroStatus === 'TODOS' || chamado.status === filtroStatus

    const combinaTipo =
      filtroTipo === 'TODOS' || chamado.tipoAjuda === filtroTipo

    const combinaBusca =
      chamado.titulo.toLowerCase().includes(busca.toLowerCase())

    return combinaStatus && combinaTipo && combinaBusca
  })

  const totalChamados = chamados.length

  const totalAbertos = chamados.filter(
    (chamado) => chamado.status === 'ABERTO'
  ).length

  const totalFechados = chamados.filter(
    (chamado) => chamado.status === 'FECHADO'
  ).length

  const totalConcluidos = chamados.filter(
    (chamado) => chamado.status === 'CONCLUIDO'
  ).length

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

          {usuario?.cargo === 'ADMIN' && (
            <button onClick={() => navigate('/usuarios')}>
              Gerenciar usuários
            </button>
          )}

          <button onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      <div className="dashboard-resumo">
        <div>
          <strong>{totalChamados}</strong>
          <span>Total</span>
        </div>

        <div>
          <strong>{totalAbertos}</strong>
          <span>Abertos</span>
        </div>

        <div>
          <strong>{totalFechados}</strong>
          <span>Fechados</span>
        </div>

        <div>
          <strong>{totalConcluidos}</strong>
          <span>Concluídos</span>
        </div>
      </div>

      <h2>Chamados</h2>

      <div className="dashboard-filtros">
        <input
          type="text"
          placeholder="Buscar chamado..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />

        <select
          value={filtroStatus}
          onChange={(event) => setFiltroStatus(event.target.value)}
        >
          <option value="TODOS">Todos os status</option>
          <option value="ABERTO">Abertos</option>
          <option value="FECHADO">Fechados</option>
          <option value="CONCLUIDO">Concluídos</option>
        </select>

        <select
          value={filtroTipo}
          onChange={(event) => setFiltroTipo(event.target.value)}
        >
          <option value="TODOS">Todos os tipos</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Rede">Rede</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {carregando && (
        <p>Carregando chamados...</p>
      )}

      {erro && (
        <p>{erro}</p>
      )}

      {!carregando && !erro && chamados.length === 0 && (
        <p>Nenhum chamado encontrado.</p>
      )}

      {!carregando &&
        !erro &&
        chamados.length > 0 &&
        chamadosFiltrados.length === 0 && (
          <p>Nenhum chamado corresponde aos filtros.</p>
        )}

      {!carregando &&
        !erro &&
        chamadosFiltrados.map((chamado) => (
          <div
            className="chamado-card"
            key={chamado.id}
            onClick={() => navigate(`/chamados/${chamado.id}`)}
          >
            <h3>{chamado.titulo}</h3>

            <p>{chamado.descricao}</p>

            <p>
              Solicitante: {chamado.usuario?.nome || 'Não informado'}
            </p>

            <p>
              Técnico: {chamado.tecnico?.nome || 'Não atribuído'}
            </p>

            <p>
              Tipo: {chamado.tipoAjuda}
            </p>

            <p>
              Status: {chamado.status}
            </p>

            <p>
              Criado em:{' '}
              {new Date(chamado.dataDeCriacao).toLocaleString('pt-BR')}
            </p>
          </div>
        ))}

    </div>
  )
}

export default Dashboard